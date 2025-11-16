#!/usr/bin/env tsx

/**
 * Test Inventory Script
 *
 * Scans the codebase for test files and generates a comprehensive inventory
 * including test counts, coverage statistics, and gap identification.
 *
 * Usage:
 *   npm run test:inventory
 *   npm run test:inventory -- --format=json
 *   npm run test:inventory -- --format=csv
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';

// Types
interface TestFile {
  path: string;
  type: 'e2e' | 'integration' | 'unit' | 'story';
  testCount: number;
  suites: string[];
  status?: 'passing' | 'failing' | 'unknown';
  lines: number;
}

interface InventoryReport {
  timestamp: string;
  summary: {
    totalFiles: number;
    totalTests: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  files: TestFile[];
  coverage: {
    features: Record<string, { tested: boolean; files: string[] }>;
  };
  gaps: string[];
}

// Configuration
const ROOT_DIR = path.resolve(__dirname, '../..');
const APPS_WEB_DIR = path.join(ROOT_DIR, 'apps/web');
const TEST_PATTERNS = {
  e2e: 'apps/web/tests/e2e/**/*.e2e.ts',
  integration: 'apps/web/tests/integration/**/*.spec.ts',
  unit: 'apps/web/src/**/*.test.{ts,tsx}',
  story: 'apps/web/src/**/*.stories.{ts,tsx}',
};

// Utility functions
function countTests(content: string): number {
  // Count test(), it(), and test.skip() occurrences
  const testMatches = content.match(/\b(test|it)\s*\(/g) || [];
  const skipMatches = content.match(/\b(test|it)\.skip\s*\(/g) || [];
  return testMatches.length + skipMatches.length;
}

function extractSuites(content: string): string[] {
  // Extract describe() block names
  const suiteRegex = /describe\s*\(\s*['"`]([^'"`]+)['"`]/g;
  const suites: string[] = [];
  let match;

  while ((match = suiteRegex.exec(content)) !== null) {
    suites.push(match[1]);
  }

  return suites;
}

function countLines(content: string): number {
  return content.split('\n').length;
}

function determineTestType(
  filePath: string,
): 'e2e' | 'integration' | 'unit' | 'story' {
  if (filePath.includes('.e2e.')) return 'e2e';
  if (filePath.includes('.spec.')) return 'integration';
  if (filePath.includes('.stories.')) return 'story';
  return 'unit';
}

async function scanTestFiles(): Promise<TestFile[]> {
  const testFiles: TestFile[] = [];

  for (const [type, pattern] of Object.entries(TEST_PATTERNS)) {
    const files = await glob(pattern, { cwd: ROOT_DIR });

    for (const file of files) {
      const fullPath = path.join(ROOT_DIR, file);
      const content = fs.readFileSync(fullPath, 'utf-8');

      testFiles.push({
        path: file,
        type: determineTestType(file),
        testCount: countTests(content),
        suites: extractSuites(content),
        lines: countLines(content),
        status: 'unknown', // Could be enhanced by parsing test results
      });
    }
  }

  return testFiles;
}

function analyzeCoverage(testFiles: TestFile[]): Record<string, { tested: boolean; files: string[] }> {
  const features: Record<string, { tested: boolean; files: string[] }> = {
    'Authentication': { tested: false, files: [] },
    'Database': { tested: false, files: [] },
    'I18n': { tested: false, files: [] },
    'Middleware': { tested: false, files: [] },
    'Monitoring': { tested: false, files: [] },
    'Analytics': { tested: false, files: [] },
    'Counter': { tested: false, files: [] },
    'Dashboard': { tested: false, files: [] },
    'Navigation': { tested: false, files: [] },
  };

  for (const file of testFiles) {
    const fileName = path.basename(file.path).toLowerCase();
    const content = fs.readFileSync(path.join(ROOT_DIR, file.path), 'utf-8').toLowerCase();

    // Check for feature keywords
    if (fileName.includes('auth') || content.includes('authentication') || content.includes('sign-in')) {
      features.Authentication.tested = true;
      features.Authentication.files.push(file.path);
    }
    if (fileName.includes('counter') || content.includes('counter')) {
      features.Counter.tested = true;
      features.Counter.files.push(file.path);
    }
    if (fileName.includes('i18n') || fileName.includes('locale') || content.includes('locale')) {
      features.I18n.tested = true;
      features.I18n.files.push(file.path);
    }
    if (fileName.includes('dashboard')) {
      features.Dashboard.tested = true;
      features.Dashboard.files.push(file.path);
    }
    if (fileName.includes('navigation')) {
      features.Navigation.tested = true;
      features.Navigation.files.push(file.path);
    }
    if (content.includes('database') || content.includes('pg') || fileName.includes('db')) {
      features.Database.tested = true;
      features.Database.files.push(file.path);
    }
    if (content.includes('middleware')) {
      features.Middleware.tested = true;
      features.Middleware.files.push(file.path);
    }
    if (content.includes('sentry') || content.includes('posthog') || content.includes('logger')) {
      features.Monitoring.tested = true;
      features.Monitoring.files.push(file.path);
    }
    if (content.includes('posthog') || content.includes('analytics')) {
      features.Analytics.tested = true;
      features.Analytics.files.push(file.path);
    }
  }

  return features;
}

function identifyGaps(coverage: Record<string, { tested: boolean; files: string[] }>): string[] {
  const gaps: string[] = [];

  for (const [feature, data] of Object.entries(coverage)) {
    if (!data.tested) {
      gaps.push(`Missing tests for: ${feature}`);
    } else if (data.files.length === 1 && data.files[0].includes('.e2e.')) {
      gaps.push(`${feature} only has E2E tests, missing unit/integration tests`);
    }
  }

  // Hardcoded gaps based on known issues
  gaps.push('No unit tests found in src/ directory');
  gaps.push('Middleware has no dedicated integration tests');
  gaps.push('Auth providers (Clerk, Cloudflare) lack E2E test suites');
  gaps.push('Monitoring stack (Sentry, PostHog) not tested');
  gaps.push('No performance or accessibility tests');

  return gaps;
}

function generateReport(testFiles: TestFile[]): InventoryReport {
  const totalTests = testFiles.reduce((sum, file) => sum + file.testCount, 0);
  const byType = testFiles.reduce<Record<string, number>>((acc, file) => {
    acc[file.type] = (acc[file.type] || 0) + file.testCount;
    return acc;
  }, {});

  const byStatus = testFiles.reduce<Record<string, number>>((acc, file) => {
    const status = file.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const coverage = analyzeCoverage(testFiles);
  const gaps = identifyGaps(coverage);

  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: testFiles.length,
      totalTests,
      byType,
      byStatus,
    },
    files: testFiles.sort((a, b) => b.testCount - a.testCount),
    coverage: { features: coverage },
    gaps,
  };
}

function formatMarkdown(report: InventoryReport): string {
  let output = '# Test Inventory Report\n\n';
  output += `Generated: ${report.timestamp}\n\n`;

  // Summary
  output += '## Summary\n\n';
  output += `- **Total Test Files**: ${report.summary.totalFiles}\n`;
  output += `- **Total Tests**: ${report.summary.totalTests}\n\n`;

  output += '### Tests by Type\n\n';
  for (const [type, count] of Object.entries(report.summary.byType)) {
    output += `- **${type}**: ${count} tests\n`;
  }
  output += '\n';

  // Feature Coverage
  output += '## Feature Coverage\n\n';
  output += '| Feature | Tested | Test Files |\n';
  output += '|---------|--------|------------|\n';
  for (const [feature, data] of Object.entries(report.coverage.features)) {
    const status = data.tested ? '✅' : '❌';
    const fileCount = data.files.length;
    output += `| ${feature} | ${status} | ${fileCount} |\n`;
  }
  output += '\n';

  // Test Files
  output += '## Test Files (by test count)\n\n';
  output += '| File | Type | Tests | Lines | Suites |\n';
  output += '|------|------|-------|-------|--------|\n';
  for (const file of report.files.slice(0, 20)) { // Top 20
    const relativePath = file.path.replace('apps/web/', '');
    output += `| ${relativePath} | ${file.type} | ${file.testCount} | ${file.lines} | ${file.suites.length} |\n`;
  }
  output += '\n';

  // Gaps
  output += '## Identified Gaps\n\n';
  for (const gap of report.gaps) {
    output += `- ⚠️  ${gap}\n`;
  }
  output += '\n';

  return output;
}

function formatJSON(report: InventoryReport): string {
  return JSON.stringify(report, null, 2);
}

function formatCSV(report: InventoryReport): string {
  let csv = 'File,Type,Tests,Lines,Suites\n';
  for (const file of report.files) {
    csv += `"${file.path}",${file.type},${file.testCount},${file.lines},${file.suites.length}\n`;
  }
  return csv;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'markdown';

  console.log('🔍 Scanning for test files...\n');

  const testFiles = await scanTestFiles();
  const report = generateReport(testFiles);

  console.log(`✅ Found ${report.summary.totalFiles} test files with ${report.summary.totalTests} tests\n`);

  let output: string;
  let extension: string;

  switch (format) {
    case 'json':
      output = formatJSON(report);
      extension = 'json';
      break;
    case 'csv':
      output = formatCSV(report);
      extension = 'csv';
      break;
    case 'markdown':
    default:
      output = formatMarkdown(report);
      extension = 'md';
  }

  // Output to console
  console.log(output);

  // Save to file
  const outputDir = path.join(ROOT_DIR, 'docs/testing');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `test-inventory.${extension}`);
  fs.writeFileSync(outputPath, output);

  console.log(`\n📊 Report saved to: ${outputPath}\n`);

  // Print quick stats
  console.log('Quick Stats:');
  console.log(`├─ E2E Tests: ${report.summary.byType.e2e || 0}`);
  console.log(`├─ Integration Tests: ${report.summary.byType.integration || 0}`);
  console.log(`├─ Unit Tests: ${report.summary.byType.unit || 0}`);
  console.log(`├─ Story Tests: ${report.summary.byType.story || 0}`);
  console.log(`└─ Total Files: ${report.summary.totalFiles}`);

  console.log(`\n⚠️  Gaps Identified: ${report.gaps.length}`);
}

// Run
main().catch((error) => {
  console.error('Error running test inventory:', error);
  process.exit(1);
});
