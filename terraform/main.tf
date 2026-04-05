
#key pair login
resource "aws_key_pair" "my_key" {
  key_name   = "terra-key-ec2"
  public_key = file("terra-key-ec2.pub")
}

# Get default VPC
resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}


#NEW METHOD FROM DOCUMENTATION
# Security Group (empty rule container)
resource "aws_security_group" "snippet_sg" {
  name        = "snippetstash-sg"
  description = "Allow SSH, HTTP, and Jenkins"
  vpc_id      = aws_default_vpc.default.id
}

# SSH (22)
resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# HTTP (80)
resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# Jenkins (8080)
resource "aws_vpc_security_group_ingress_rule" "jenkins" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 8080
  to_port           = 8080
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# SonarQube (9000)
resource "aws_vpc_security_group_ingress_rule" "sonarqube" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 9000
  to_port           = 9000
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# OWASP
resource "aws_vpc_security_group_ingress_rule" "owasp" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 8081
  to_port           = 8081
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# Prometheus (9090)
resource "aws_vpc_security_group_ingress_rule" "prometheus" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 9090
  to_port           = 9090
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# Grafana (3000)
resource "aws_vpc_security_group_ingress_rule" "grafana" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 3000
  to_port           = 3000
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# cAdvisor
resource "aws_vpc_security_group_ingress_rule" "cadvisor" {
  security_group_id = aws_security_group.snippet_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 8082
  to_port           = 8082
  ip_protocol       = "tcp"
}

# SMTP (25)
resource "aws_vpc_security_group_ingress_rule" "smtp" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 25
  to_port           = 25
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# SMTPS (465)
resource "aws_vpc_security_group_ingress_rule" "smtps" {
  security_group_id = aws_security_group.snippet_sg.id
  from_port         = 465
  to_port           = 465
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# Allow all outbound traffic
resource "aws_vpc_security_group_egress_rule" "all_outbound" {
  security_group_id = aws_security_group.snippet_sg.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}


#instances configuration
resource "aws_instance" "jenkins-master" {
  key_name                    = aws_key_pair.my_key.key_name
  ami                         = var.ami_id
  instance_type               = var.aws_ec2_instance_type
  vpc_security_group_ids      = [aws_security_group.snippet_sg.id]
  associate_public_ip_address = true

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
  key_name               = aws_key_pair.my_key.key_name
  ami                    = var.ami_id
  instance_type          = var.jenkins_instance_type
  vpc_security_group_ids = [aws_security_group.snippet_sg.id]
  root_block_device {
    volume_type = "gp3"
    volume_size = 15
    encrypted   = true
  }

  user_data = file("jenkins-agent-script.sh")
  
  tags = {
    Name = "jenkins-agent"
  }


}


