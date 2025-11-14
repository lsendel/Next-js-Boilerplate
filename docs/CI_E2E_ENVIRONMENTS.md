# CI E2E Environment Configuration

This project exercises tenant routing against two hosts for every CI run so both shared-domain and custom-domain behaviours stay verified.

## Domains

| Environment | Provider | Purpose | URL |
| --- | --- | --- | --- |
| Shared Preview | Cloudflare Pages | Slug + locale routing | `https://environment.1pet.com` |
| Custom Tenant | AWS (Amplify/CloudFront) | Custom-domain routing | `https://test.1pet.me` |

## GitHub Secrets
Add the following secrets so the `e2e-shared` and `e2e-custom` jobs can target the correct hosts:

| Secret | Description |
| --- | --- |
| `E2E_SHARED_HOST` | Base URL for the Cloudflare deployment (e.g., `https://environment.1pet.com`). |
| `E2E_CUSTOM_HOST` | Base URL for the AWS tenant domain (e.g., `https://test.1pet.me`). |
| `E2E_TENANT_SLUG` | Default tenant slug to test (e.g., `acme`). |
| `E2E_TENANT_DEFAULT_LOCALE` | Default locale (usually `en`). |

## Running Locally
```bash
E2E_TENANT_MODE=both \
E2E_SHARED_HOST=https://environment.1pet.com \
E2E_CUSTOM_HOST=https://test.1pet.me \
E2E_TENANT_SLUG=acme \
npm run test:e2e
```
