terraform {
  required_version = ">= 1.6.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = ">= 4.36.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "cloudflare_accounts" "this" {}

locals {
  account_id = var.cloudflare_account_id != "" ? var.cloudflare_account_id : one(data.cloudflare_accounts.this.accounts).id
  zone_name  = var.zone_name
  shared_fqdn = "${var.shared_subdomain}.${var.zone_name}"
}

resource "cloudflare_pages_project" "shared" {
  account_id = local.account_id
  name       = var.pages_project_name
  production_branch = var.production_branch

  build_config {
    build_command   = var.build_command
    destination_dir = var.destination_dir
  }

  deployment_configs {
    production {
      env_vars = var.production_env
    }
    preview {
      env_vars = var.preview_env
    }
  }
}

resource "cloudflare_pages_domain" "shared" {
  account_id    = local.account_id
  project_name  = cloudflare_pages_project.shared.name
  domain        = local.shared_fqdn
}

resource "cloudflare_record" "shared_cname" {
  zone_id = var.zone_id
  name    = var.shared_subdomain
  value   = cloudflare_pages_project.shared.subdomain
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
