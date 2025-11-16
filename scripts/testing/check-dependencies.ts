#!/usr/bin/env tsx

/**
 * Dependency Analysis Script
 *
 * Checks for:
 * - Circular dependencies
 * - Orphaned files (no imports/exports)
 * - Deeply nested dependencies
 * - High-impact components (imported by many files)
 *
 * Usage:
 *   npm run check:circular           # Check for circular dependencies
 *   npm run graph:components          # Generate full dependency graph
 *   npm run graph:components -- --layer=auth  # Graph specific layer
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// Configuration
const ROOT_DIR = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(ROOT_DIR, 'apps/web/src');
const OUTPUT_DIR = path.join(ROOT_DIR, 'docs/architecture');

interface CircularDependency {
  cycle: string[];
  severity: 'high' | 'medium' | 'low';
}

interface DependencyStats {
  totalFiles: number;
  circularDependencies: CircularDependency[];
  orphanedFiles: string[];
  highImpactFiles: { file: string; dependents: number }[];
  deeplyNestedFiles: { file: string; depth: number }[];
}

async function runMadge(
  args: string[],
): Promise<{ stdout: string; stderr: string }> {
  const command = `npx madge ${args.join(' ')}`;
  console.log(`Running: ${command}`);
  return execAsync(command, { cwd: path.join(ROOT_DIR, 'apps/web') });
}

async function checkCircularDependencies(): Promise<CircularDependency[]> {
  console.log('🔍 Checking for circular dependencies...\n');

  try {
    const { stdout } = await runMadge([
      '--circular',
      '--extensions',
      'ts,tsx,js,jsx',
      'src/',
    ]);

    if (!stdout.trim()) {
      console.log('✅ No circular dependencies found!\n');
      return [];
    }

    // Parse madge output
    const cycles: string[][] = [];
    const lines = stdout.trim().split('\n');
    let currentCycle: string[] = [];

    for (const line of lines) {
      if (line.trim() === '') continue;

      if (line.startsWith(' ')) {
        // Part of current cycle
        const file = line.trim().replace(/^> /, '');
        currentCycle.push(file);
      } else {
        // Start of new cycle
        if (currentCycle.length > 0) {
          cycles.push([...currentCycle]);
        }
        currentCycle = [line.trim()];
      }
    }

    if (currentCycle.length > 0) {
      cycles.push(currentCycle);
    }

    // Classify by severity
    const circularDeps: CircularDependency[] = cycles.map((cycle) => {
      let severity: 'high' | 'medium' | 'low' = 'low';

      // High severity: Long cycles or in core libs
      if (cycle.length > 5) {
        severity = 'high';
      } else if (cycle.some((f) => f.includes('/libs/') || f.includes('/utils/'))) {
        severity = 'high';
      } else if (cycle.length > 3) {
        severity = 'medium';
      }

      return { cycle, severity };
    });

    console.log(`⚠️  Found ${circularDeps.length} circular dependencies:\n`);

    for (const dep of circularDeps) {
      console.log(`[${dep.severity.toUpperCase()}] Cycle with ${dep.cycle.length} files:`);
      for (const file of dep.cycle) {
        console.log(`  → ${file}`);
      }
      console.log();
    }

    return circularDeps;
  } catch (error: any) {
    if (error.code === 1 && !error.stdout?.trim()) {
      console.log('✅ No circular dependencies found!\n');
      return [];
    }
    throw error;
  }
}

async function generateDependencyGraph(
  layer?: string,
): Promise<void> {
  console.log('📊 Generating dependency graph...\n');

  const timestamp = new Date().toISOString().split('T')[0];
  const outputName = layer
    ? `dependency-graph-${layer}-${timestamp}`
    : `dependency-graph-${timestamp}`;

  const srcPath = layer ? `src/${layer}` : 'src/';

  try {
    // Generate SVG
    await runMadge([
      '--image',
      `${OUTPUT_DIR}/${outputName}.svg`,
      '--extensions',
      'ts,tsx,js,jsx',
      srcPath,
    ]);

    console.log(`✅ Dependency graph saved to: docs/architecture/${outputName}.svg\n`);

    // Also generate DOT file for custom processing
    const { stdout } = await runMadge([
      '--dot',
      '--extensions',
      'ts,tsx,js,jsx',
      srcPath,
    ]);

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${outputName}.dot`),
      stdout,
    );

    console.log(`✅ DOT file saved to: docs/architecture/${outputName}.dot\n`);
  } catch (error: any) {
    console.error('Error generating graph:', error.message);
    throw error;
  }
}

async function analyzeDependencies(): Promise<DependencyStats> {
  console.log('📈 Analyzing dependency structure...\n');

  try {
    // Get dependency tree as JSON
    const { stdout } = await runMadge([
      '--json',
      '--extensions',
      'ts,tsx,js,jsx',
      'src/',
    ]);

    const dependencyTree = JSON.parse(stdout);

    // Calculate statistics
    const files = Object.keys(dependencyTree);
    const totalFiles = files.length;

    // Find orphaned files (no dependencies and no dependents)
    const orphanedFiles: string[] = [];
    const dependentCount: Record<string, number> = {};

    // Count dependents for each file
    for (const [file, deps] of Object.entries<string[]>(dependencyTree)) {
      for (const dep of deps) {
        dependentCount[dep] = (dependentCount[dep] || 0) + 1;
      }

      if (deps.length === 0 && !dependentCount[file]) {
        orphanedFiles.push(file);
      }
    }

    // Find high-impact files (imported by many others)
    const highImpactFiles = Object.entries(dependentCount)
      .map(([file, count]) => ({ file, dependents: count }))
      .sort((a, b) => b.dependents - a.dependents)
      .slice(0, 10);

    // Find deeply nested dependencies (not implemented fully)
    const deeplyNestedFiles: { file: string; depth: number }[] = [];

    console.log(`Total files analyzed: ${totalFiles}`);
    console.log(`Orphaned files: ${orphanedFiles.length}`);
    console.log(`High-impact files (top 10): ${highImpactFiles.length}\n`);

    return {
      totalFiles,
      circularDependencies: [],
      orphanedFiles,
      highImpactFiles,
      deeplyNestedFiles,
    };
  } catch (error: any) {
    console.error('Error analyzing dependencies:', error.message);
    throw error;
  }
}

async function generateReport(stats: DependencyStats): Promise<void> {
  const reportPath = path.join(OUTPUT_DIR, 'dependency-analysis.md');

  let report = '# Component Dependency Analysis\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  // Summary
  report += '## Summary\n\n';
  report += `- **Total Files**: ${stats.totalFiles}\n`;
  report += `- **Circular Dependencies**: ${stats.circularDependencies.length}\n`;
  report += `- **Orphaned Files**: ${stats.orphanedFiles.length}\n`;
  report += `- **High-Impact Files**: ${stats.highImpactFiles.length}\n\n`;

  // Circular Dependencies
  report += '## Circular Dependencies\n\n';
  if (stats.circularDependencies.length === 0) {
    report += '✅ **No circular dependencies found!**\n\n';
  } else {
    for (const dep of stats.circularDependencies) {
      report += `### ${dep.severity.toUpperCase()} Severity\n\n`;
      report += 'Cycle:\n';
      for (const file of dep.cycle) {
        report += `- ${file}\n`;
      }
      report += '\n';
    }
  }

  // High-Impact Files
  report += '## High-Impact Components\n\n';
  report += 'Files imported by many other files (potential bottlenecks):\n\n';
  report += '| File | Dependents |\n';
  report += '|------|------------|\n';
  for (const file of stats.highImpactFiles) {
    const shortPath = file.file.replace('src/', '');
    report += `| ${shortPath} | ${file.dependents} |\n`;
  }
  report += '\n';

  // Orphaned Files
  report += '## Orphaned Files\n\n';
  if (stats.orphanedFiles.length === 0) {
    report += '✅ No orphaned files found.\n\n';
  } else {
    report += 'Files with no imports and no dependents:\n\n';
    for (const file of stats.orphanedFiles) {
      report += `- ${file}\n`;
    }
    report += '\n';
  }

  // Recommendations
  report += '## Recommendations\n\n';
  if (stats.circularDependencies.length > 0) {
    report += '- **Fix circular dependencies**: Refactor to break cycles\n';
  }
  if (stats.highImpactFiles.length > 0) {
    report += '- **Monitor high-impact files**: Changes may affect many components\n';
  }
  if (stats.orphanedFiles.length > 0) {
    report += '- **Review orphaned files**: Consider removing if unused\n';
  }

  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report saved to: docs/architecture/dependency-analysis.md\n`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    if (command === '--circular' || command === 'circular') {
      const circularDeps = await checkCircularDependencies();
      process.exit(circularDeps.length > 0 ? 1 : 0);
    } else if (command === '--graph' || command === 'graph') {
      const layer = args.find((arg) => arg.startsWith('--layer='))?.split('=')[1];
      await generateDependencyGraph(layer);
    } else {
      // Run full analysis
      console.log('🔬 Running full dependency analysis...\n');

      const circularDeps = await checkCircularDependencies();
      const stats = await analyzeDependencies();
      stats.circularDependencies = circularDeps;

      await generateReport(stats);
      await generateDependencyGraph();

      console.log('✨ Analysis complete!\n');

      if (circularDeps.length > 0) {
        console.log('⚠️  Warning: Circular dependencies detected. Please review the report.\n');
        process.exit(1);
      }
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
