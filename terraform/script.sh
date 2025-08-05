 #!/bin/bash
              sudo apt update -y
              sudo apt install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu

              sudo apt install fontconfig openjdk-21-jre -y
              java -version

              sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
                https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
              echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
                https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
                /etc/apt/sources.list.d/jenkins.list > /dev/null
              sudo apt-get update
              sudo apt-get install jenkins -y
              sudo usermod -aG docker $USER
              sudo usermod -aG docker jenkins && newgrp docker
              
              sudo systemctl restart docker
              sudo systemctl restart jenkins


              sudo systemctl status jenkins
              sudo systemctl enable jenkins
              sudo systemctl start jenkins