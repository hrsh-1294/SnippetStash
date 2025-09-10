#!/bin/bash
#install java(no need of jenkins on agent node)
sudo apt update -y
sudo apt install -y fontconfig openjdk-21-jre
java -version

#install docker and give add user in docker group
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER && newgrp docker
sudo systemctl enable docker
sudo systemctl start docker


