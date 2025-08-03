provider "aws" {
  region = "ap-south-1"
}


resource "aws_key_pair" "snippet_key" {
  key_name   = "snippetstash-key"
  public_key = file("${path.module}/snippetstash-key.pub")
}


resource "aws_security_group" "snippet_sg" {
  name        = "snippetstash-sg"
  description = "Allow SSH, HTTP, and Jenkins"
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH access
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Web app
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Jenkins
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Get default VPC
data "aws_vpc" "default" {
  default = true
}



resource "aws_instance" "snippetstash_server" {
  ami                         = var.ami_id
  instance_type               = var.aws_ec2_instance_type
  vpc_security_group_ids      = [aws_security_group.snippet_sg.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.snippet_key.key_name

  user_data = file("script.sh")

  tags = {
    Name = "snippetstash-jenkins-server"
  }
}
