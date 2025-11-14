variable "aws_region" {
  description = "Region for Amplify resources"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Name of the Amplify app"
  type        = string
  default     = "tenant-custom"
}

variable "repository" {
  description = "Git repository URL"
  type        = string
}

variable "production_branch" {
  description = "Branch to deploy for production"
  type        = string
  default     = "main"
}

variable "environment_variables" {
  description = "Amplify environment variables"
  type        = map(string)
  default     = {}
}

variable "custom_domain" {
  description = "Custom domain (e.g., test.1pet.me)"
  type        = string
}

variable "route53_zone_id" {
  description = "Hosted zone ID for the root domain"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for the custom domain"
  type        = string
}

variable "amplify_build_spec" {
  description = "Amplify build spec YAML"
  type        = string
  default     = <<-EOB
version: 1
backend:
  phases:
    build:
      commands: []
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
EOB
}
