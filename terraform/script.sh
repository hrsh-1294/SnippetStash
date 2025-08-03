#!/bin/bash
sudo apt update
sudo apt install -y docker.io git openjdk-17-jdk curl gnupg2

sudo systemctl enable --now docker

curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install -y jenkins

sudo systemctl enable --now jenkins
sudo usermod -aG docker jenkins
sudo reboot