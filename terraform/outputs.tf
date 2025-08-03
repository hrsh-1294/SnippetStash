output "public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.snippetstash_server.public_ip
}
