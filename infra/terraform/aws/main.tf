terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.50"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  app_name        = var.app_name
  domain_name     = var.custom_domain
  zone_id         = var.route53_zone_id
  certificate_arn = var.acm_certificate_arn
}

resource "aws_s3_bucket" "artifact" {
  bucket = "${local.app_name}-artifacts"
}

resource "aws_iam_role" "amplify_service" {
  name               = "${local.app_name}-amplify-service-role"
  assume_role_policy = data.aws_iam_policy_document.amplify_assume.json
}

data "aws_iam_policy_document" "amplify_assume" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["amplify.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_amplify_app" "tenant" {
  name  = local.app_name
  iam_service_role_arn = aws_iam_role.amplify_service.arn
  repository = var.repository
  build_spec = var.amplify_build_spec

  environment_variables = var.environment_variables
}

resource "aws_amplify_branch" "main" {
  app_id     = aws_amplify_app.tenant.id
  branch_name = var.production_branch
}

resource "aws_amplify_domain_association" "tenant" {
  app_id      = aws_amplify_app.tenant.id
  domain_name = local.domain_name

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }
}

resource "aws_route53_record" "tenant" {
  zone_id = local.zone_id
  name    = local.domain_name
  type    = "A"

  alias {
    name                   = aws_amplify_domain_association.tenant.domain_name
    zone_id                = local.zone_id
    evaluate_target_health = false
  }
}
