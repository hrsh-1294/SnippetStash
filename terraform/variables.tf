variable "region" {
  default = "ap-south-1"
  type = string
}

variable "aws_ec2_instance_type" {
  default = "t3.small"
  type = string
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  default     = "ami-0f918f7e67a3323f0" # Ubuntu 22.04 for ap-south-1
  type        = string
}

variable "jenkins_port" {
  default = 8080
}

variable "jenkins_instance_type" {
  default = "t3.micro"
  type    = string
}