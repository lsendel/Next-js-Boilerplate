# Deployment Automation Scripts

**Automated setup scripts for SocialPet deployment to Cloudflare**

These scripts automate the entire deployment setup process, from creating git branches to configuring GitHub environments and Cloudflare D1 databases.

---

## 🚀 Quick Start

### Verify Prerequisites (Recommended First Step)

Before running the setup wizard, verify that all prerequisites are met:

```bash
./scripts/verify-setup.sh
```

This script checks:
- ✅ Required tools (git, gh, wrangler, pnpm, node)
- ✅ Authentication status (GitHub, Cloudflare)
- ✅ Git repository and remote configuration
- ✅ Project files and script permissions

**Time**: ~30 seconds

---

### Complete Automated Setup (Recommended)

Run the master wizard that executes all setup steps:

```bash
./scripts/setup-complete-deployment.sh
```

This single command will:
1. ✅ Create git branches (dev, staging, main)
2. ✅ Create GitHub environments with protection rules
3. ✅ Create 4 D1 databases on Cloudflare
4. ✅ Update wrangler.jsonc with database IDs
5. ✅ Configure GitHub secrets (interactive)
6. ✅ Verify complete setup

**Time**: ~10-15 minutes (interactive)

---

## 📋 Individual Scripts

If you prefer to run steps individually:

### 0. Verify Setup (Run This First)

Verify prerequisites before running setup scripts:

```bash
./scripts/verify-setup.sh
```

**What it checks**:
- Required tools installation (git, gh, wrangler, pnpm, node)
- Authentication status (GitHub, Cloudflare)
- Git repository configuration
- Project files and permissions

**Features**:
- Color-coded output for easy reading
- Detailed error messages with fix suggestions
- Pass/fail summary with next steps

**Time**: ~30 seconds

---

### 1. Setup Git Branches

Creates and pushes dev, staging, and main branches:

```bash
./scripts/setup-git-branches.sh
```

**What it does**:
- Creates `dev` branch for development
- Creates `staging` branch for pre-production
- Ensures `main` branch exists for production
- Pushes all branches to remote
- Optionally sets up branch protection for `main`

**Time**: ~2-3 minutes

---

### 2. Setup GitHub Environments

Creates GitHub environments with protection rules:

```bash
./scripts/setup-github-environments.sh
```

**What it does**:
- Creates 4 environments: dev, test, staging, production
- Configures deployment branch restrictions
- Sets up production protection (reviewers + wait timer)
- Verifies environment creation

**Requirements**:
- GitHub CLI (`gh`) installed and authenticated
- Repository admin access

**Time**: ~3-5 minutes

---

### 3. Setup D1 Databases

Creates Cloudflare D1 databases:

```bash
./scripts/setup-d1-databases.sh
```

**What it does**:
- Creates 4 D1 databases (dev, test, staging, production)
- Updates `apps/web/wrangler.jsonc` with database IDs
- Creates backup of wrangler.jsonc
- Provides migration commands

**Requirements**:
- Wrangler CLI installed and authenticated
- Cloudflare account

**Time**: ~5-7 minutes

---

## 🛠️ Prerequisites

Before running any scripts, ensure you have:

### Required Tools

1. **GitHub CLI** (`gh`)
   ```bash
   # macOS
   brew install gh

   # Linux
   sudo apt install gh

   # Windows
   winget install --id GitHub.cli

   # Authenticate
   gh auth login
   ```

2. **Wrangler CLI**
   ```bash
   npm install -g wrangler

   # Authenticate
   npx wrangler login
   ```

3. **Git**
   ```bash
   git --version  # Should be 2.0+
   ```

### Accounts

- ✅ GitHub account with repository admin access
- ✅ Cloudflare account (free tier works)
- ✅ Domain added to Cloudflare (socialpet.io)

---

## 📖 Script Details

### setup-complete-deployment.sh

**Master wizard** that runs all scripts in order.

**Features**:
- Interactive prompts
- Progress tracking
- Verification at each step
- Colored output for clarity
- Error handling

**Usage**:
```bash
./scripts/setup-complete-deployment.sh
```

**Output**:
- Step-by-step progress
- Success/failure indicators
- Next steps guidance
- Documentation links

---

### setup-git-branches.sh

**Creates git branches** for environment promotion.

**Features**:
- Detects existing branches
- Handles master → main renaming
- Force push option for existing branches
- Sets default branch on GitHub
- Optional branch protection

**Usage**:
```bash
./scripts/setup-git-branches.sh
```

**Options** (interactive):
- Recreate existing branches
- Rename master to main
- Delete remote master
- Add branch protection

---

### setup-github-environments.sh

**Creates GitHub environments** via GitHub API.

**Features**:
- Creates all 4 environments
- Configures deployment branch policies
- Sets production wait timer (5 minutes)
- Adds required reviewers (interactive)
- Verifies environment creation

**Usage**:
```bash
./scripts/setup-github-environments.sh
```

**Environment Configuration**:

| Environment | Protection | Branches | Auto-Deploy |
|-------------|-----------|----------|-------------|
| dev | None | dev only | ✅ Yes |
| test | None | All | ⚡ Manual |
| staging | None | staging only | ✅ Yes |
| production | Reviewers + Wait | main only | ❌ Approval required |

---

### setup-d1-databases.sh

**Creates D1 databases** on Cloudflare.

**Features**:
- Creates 4 databases automatically
- Extracts database IDs
- Updates wrangler.jsonc
- Creates backup before modification
- Provides migration commands

**Usage**:
```bash
./scripts/setup-d1-databases.sh
```

**Databases Created**:
```
socialpet-db-dev
socialpet-db-test
socialpet-db-staging
socialpet-db-production
```

---

## 🔍 Verification

After running the scripts, verify your setup:

### Check Git Branches

```bash
git branch -a
```

Expected output:
```
* main
  dev
  staging
  remotes/origin/dev
  remotes/origin/main
  remotes/origin/staging
```

### Check GitHub Environments

```bash
gh api /repos/:owner/:repo/environments --jq '.environments[].name'
```

Expected output:
```
dev
test
staging
production
```

### Check D1 Databases

```bash
wrangler d1 list | grep socialpet
```

Expected output:
```
socialpet-db-dev
socialpet-db-test
socialpet-db-staging
socialpet-db-production
```

### Check GitHub Secrets

```bash
gh secret list
```

Expected output should include:
```
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

---

## 🚨 Troubleshooting

### "GitHub CLI not installed"

Install GitHub CLI:
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Verify
gh --version
```

### "Not authenticated with GitHub"

Login to GitHub:
```bash
gh auth login
```

Follow the prompts to authenticate.

### "Wrangler not found"

Install Wrangler:
```bash
npm install -g wrangler

# Verify
wrangler --version
```

### "Could not parse repository URL"

Ensure you have a git remote:
```bash
git remote -v

# Add if missing
git remote add origin https://github.com/your-org/your-repo.git
```

### "Permission denied"

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### "Environment already exists"

Scripts handle existing environments gracefully. They will:
- Skip if environment exists
- Ask before overwriting
- Update configuration if needed

### "Database ID not found in output"

If database creation output doesn't show ID:
1. List databases: `wrangler d1 list`
2. Manually copy IDs to `wrangler.jsonc`

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| [CLOUDFLARE_SOCIALPET_SETUP.md](../docs/CLOUDFLARE_SOCIALPET_SETUP.md) | Complete manual setup guide |
| [DEPLOYMENT_CHECKLIST_SOCIALPET.md](../docs/DEPLOYMENT_CHECKLIST_SOCIALPET.md) | Step-by-step checklist |
| [SOCIALPET_DEPLOYMENT_SUMMARY.md](../docs/SOCIALPET_DEPLOYMENT_SUMMARY.md) | Quick reference |
| [CI_CD_COMPLETE_GUIDE.md](../docs/CI_CD_COMPLETE_GUIDE.md) | Complete CI/CD docs |

---

## 🎯 What to Do Next

After running the setup scripts:

### 1. Configure Cloudflare Pages

Create a Cloudflare Pages project:
1. Go to https://dash.cloudflare.com
2. Workers & Pages → Create application → Pages
3. Connect your GitHub repository
4. Project name: `socialpet`
5. Build command: `pnpm build`
6. Build directory: `.next`
7. Root directory: `apps/web`

### 2. Add Custom Domains

Add these domains to your Pages project:
- dev.socialpet.io
- tst.socialpet.io
- stg.socialpet.io
- socialpet.io
- www.socialpet.io

### 3. Apply Database Migrations

```bash
cd apps/web

# Development
pnpm d1:migrate

# Test
npx wrangler d1 migrations apply socialpet-db-test --remote --env test

# Staging
pnpm d1:migrate:stage

# Production
pnpm d1:migrate:prod
```

### 4. Deploy to Dev

```bash
git checkout dev
git push origin dev
```

### 5. Monitor Deployment

```bash
gh run watch
```

### 6. Verify Deployment

```bash
curl https://dev.socialpet.io/api/health
```

---

## 💡 Tips

### Run Scripts from Project Root

All scripts should be run from the project root directory:
```bash
cd /path/to/Next-js-Boilerplate
./scripts/setup-complete-deployment.sh
```

### Use the Master Wizard

For first-time setup, use the complete wizard:
```bash
./scripts/setup-complete-deployment.sh
```

### Run Individual Scripts for Updates

If you need to update a specific component:
```bash
# Update environments only
./scripts/setup-github-environments.sh

# Add new database
./scripts/setup-d1-databases.sh
```

### Check Script Help

Most scripts provide help when run without arguments:
```bash
./scripts/setup-git-branches.sh --help
```

---

## 🆘 Getting Help

**Script Issues**:
- Check the troubleshooting section above
- Review script output for error messages
- Run with `bash -x script.sh` for debug output

**Deployment Issues**:
- See [CI_CD_COMPLETE_GUIDE.md](../docs/CI_CD_COMPLETE_GUIDE.md)
- Check [CLOUDFLARE_SOCIALPET_SETUP.md](../docs/CLOUDFLARE_SOCIALPET_SETUP.md)

**GitHub Issues**:
- Create an issue in the repository
- Include script output and error messages

---

## ✅ Success Checklist

After running scripts, you should have:

- [x] Git branches created (dev, staging, main)
- [x] GitHub environments configured (4 environments)
- [x] Environment protection rules set (production)
- [x] D1 databases created (4 databases)
- [x] wrangler.jsonc updated with database IDs
- [x] GitHub secrets configured
- [x] All scripts executable

**Next**: Configure custom domains and deploy!

---

**Happy automating! 🚀**

For questions or issues, see the troubleshooting section or check the complete documentation.
