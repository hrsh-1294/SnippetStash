#!/bin/bash

# Install Java
sudo apt update -y
sudo apt install -y fontconfig openjdk-21-jre
java -version

# FIX: create keyrings directory
sudo mkdir -p /etc/apt/keyrings

# Install Jenkins
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update -y

# Install Jenkins
sudo apt-get install -y jenkins

# Reload systemd (VERY IMPORTANT)
sudo systemctl daemon-reload

# Enable + start Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

# Check status
sudo systemctl status jenkins