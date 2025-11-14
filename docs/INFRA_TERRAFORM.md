# Terraform Infrastructure

To keep Cloudflare (shared-domain) and AWS (custom-domain) environments reproducible, the `infra/terraform` directory includes starter Terraform configurations. Each stack is modular so you can plug it into your existing IaC pipeline.

## Cloudflare (environment.1pet.com)
- Directory: `infra/terraform/cloudflare`
- Resources: `cloudflare_pages_project`, custom domain, DNS record for `environment.1pet.com` -> Pages subdomain.
- Required variables: `cloudflare_api_token`, `zone_id`, `zone_name`. Optional overrides for account ID, project names, env vars.
- Usage:
  ```bash
  cd infra/terraform/cloudflare
  terraform init
  terraform plan -var cloudflare_api_token=... -var zone_id=... -var zone_name=1pet.com
  ```

## AWS (test.1pet.me)
- Directory: `infra/terraform/aws`
- Resources: Amplify app + branch, domain association, Route53 record.
- Required variables: `repository`, `custom_domain`, `route53_zone_id`, `acm_certificate_arn` (certificate must be in us-east-1 for CloudFront/Amplify).
- Usage:
  ```bash
  cd infra/terraform/aws
  terraform init
  terraform plan -var repository=https://github.com/... -var custom_domain=test.1pet.me -var route53_zone_id=Z123 -var acm_certificate_arn=arn:aws:acm:...
  ```

## CI Integration
1. Configure Terraform cloud or backend for state.
2. Add workflow steps to run `terraform fmt` + `plan` on pull requests (non-destructive) and `apply` on `main`.
3. Export the resulting URLs as GitHub Action outputs and feed them into `E2E_SHARED_HOST` / `E2E_CUSTOM_HOST` so Playwright hits the fresh deployments every run.
