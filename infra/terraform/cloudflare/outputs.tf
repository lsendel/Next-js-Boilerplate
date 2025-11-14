output "shared_domain" {
  value       = cloudflare_pages_domain.shared.domain
  description = "Fully qualified shared-domain hostname"
}

output "pages_project_subdomain" {
  value       = cloudflare_pages_project.shared.subdomain
  description = "Cloudflare-managed subdomain"
}
