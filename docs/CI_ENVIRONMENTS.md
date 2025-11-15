# Environment Matrix: dev, stage, prod

This repo follows a trunk-based workflow with three long-lived environments:

| Environment | Git Branch | Cloudflare domain | AWS domain |
| --- | --- | --- | --- |
| `dev` | `dev` | `environment-dev.1pet.com` | `dev.test.1pet.me` |
| `stage` | `staging` | `environment-stage.1pet.com` | `stage.test.1pet.me` |
| `prod` | `main` | `environment.1pet.com` | `test.1pet.me` |

## How deployments run
1. Push to `dev` / `staging` / `main`, or trigger the `Infrastructure Deploy` workflow manually with `environment=dev|stage|prod`.
2. `.github/workflows/infra.yml` infers the environment and runs Terraform for Cloudflare (Pages + DNS) and AWS (Amplify + Route53) using environment-specific workspaces.
3. Cloudflare Pages + Amplify automatically pick up their respective branches (`dev`, `staging`, `main`) to build and deploy the app. Custom environment variables (`NEXT_PUBLIC_APP_URL`) are set via Terraform.
4. After infra deploy, the existing CI workflow runs quality checks and Playwright E2E (`e2e-shared`, `e2e-custom`) using the `E2E_SHARED_HOST` / `E2E_CUSTOM_HOST` secrets.

## Manual smoke test
```bash
# Shared-domain (Cloudflare)
curl -I https://environment-dev.1pet.com/acme/fr/pricing

# Custom-domain (AWS)
curl -I https://dev.test.1pet.me/pricing
```

## Local testing
```bash
# Run shared + custom Playwright tests against dev hosts
E2E_TENANT_MODE=both \
E2E_SHARED_HOST=https://environment-dev.1pet.com \
E2E_CUSTOM_HOST=https://dev.test.1pet.me \
E2E_TENANT_SLUG=acme \
E2E_TENANT_DEFAULT_LOCALE=en \
npm run test:e2e
```

For more detail, see:
- `docs/INFRA_TERRAFORM.md` for Terraform usage.
- `docs/CI_E2E_ENVIRONMENTS.md` for the domain/secret mapping used by E2E tests.
