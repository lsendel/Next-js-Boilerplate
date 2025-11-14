output "amplify_app_id" {
  description = "ID of the Amplify app"
  value       = aws_amplify_app.tenant.id
}

output "custom_domain" {
  description = "Deployed custom domain"
  value       = aws_amplify_domain_association.tenant.domain_name
}
