provider "aws" {
  region = var.region
}

# resource "aws_key_pair" "snippet_key" {
#   key_name   = "jenkins-key-pair"
#   public_key = file("${path.module}/jenkins-key-pair.pub")
# }


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



resource "aws_instance" "jenkins-master" {
  ami                         = var.ami_id
  instance_type               = var.aws_ec2_instance_type
  vpc_security_group_ids      = [aws_security_group.snippet_sg.id]
  associate_public_ip_address = true
  key_name                    = "jenkins-key-pair"

  user_data = file("jenkins-master-script.sh")

  root_block_device {
    volume_type = "gp3"
    volume_size = 15
    encrypted   = true
  }

  tags = {
    Name = "jenkins-master"
  }
}

resource "aws_instance" "jenkins-agent" {
  ami                    = var.ami_id
  instance_type          = var.jenkins_instance_type
  key_name               = "jenkins-key-pair"
  vpc_security_group_ids = [aws_security_group.snippet_sg.id]
  root_block_device {
    volume_type = "gp3"
    volume_size = 15
    encrypted   = true
  }

  tags = {
    Name = "jenkins-agent"
  }
  user_data = file("jenkins-agent-script.sh")


}


