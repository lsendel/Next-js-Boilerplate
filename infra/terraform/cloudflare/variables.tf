variable "cloudflare_api_token" {
  description = "API token with Pages + DNS permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Optional account ID override"
  type        = string
  default     = ""
}

variable "zone_id" {
  description = "Cloudflare zone ID for the root domain"
  type        = string
}

variable "zone_name" {
  description = "Root domain name (e.g., 1pet.com)"
  type        = string
}

variable "shared_subdomain" {
  description = "Subdomain for the shared environment"
  type        = string
  default     = "environment"
}

variable "pages_project_name" {
  description = "Cloudflare Pages project name"
  type        = string
  default     = "nextjs-shared"
}

variable "production_branch" {
  description = "Branch for production builds"
  type        = string
  default     = "main"
}

variable "build_command" {
  description = "Command used by Pages to build the app"
  type        = string
  default     = "npm run build"
}

variable "destination_dir" {
  description = "Output directory for the build"
  type        = string
  default     = ".next"
}

variable "production_env" {
  description = "Map of environment variables for production deployments"
  type        = map(string)
  default     = {}
}

variable "preview_env" {
  description = "Map of environment variables for preview deployments"
  type        = map(string)
  default     = {}
}
