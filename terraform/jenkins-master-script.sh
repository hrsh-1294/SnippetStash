#!/bin/bash

# Update system
sudo apt update -y

# Install Java
sudo apt install -y fontconfig openjdk-21-jre
java -version

# Install Docker
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker

# Install Jenkins
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update -y
sudo apt install -y jenkins

# Start Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

# Give permission to ubuntu user (optional)
sudo usermod -aG docker ubuntu

# Run SonarQube (wait a bit to avoid race issues)
sleep 20

sudo docker run -d \
  --name sonarqube \
  -p 9000:9000 \
  sonarqube:lts-community