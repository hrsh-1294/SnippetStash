#!/bin/bash
#install java(no need of jenkins on agent node)
sudo apt update -y
sudo apt install -y fontconfig openjdk-21-jre
java -version

#install docker and give add user in docker group and create a docker network
sudo apt-get update -y
sudo apt-get install -y docker.io 
sudo apt install docker-compose

sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker

sudo docker network create test-net || true

#install trivy
sudo apt-get install wget apt-transport-https gnupg lsb-release -y
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update -y
sudo apt-get install trivy -y

#install git and clone repo
sudo apt-get install -y git
# Clone repo
sudo git clone https://github.com/hrsh-1294/SnippetStash.git
cd SnippetStash

# Start monitoring
docker-compose -f docker-compose.monitoring.yaml up -d


