#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting EC2 setup for Docker and Jenkins..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update -y
sudo apt upgrade -y

# Install essential tools
echo "🛠️ Installing essential tools..."
sudo apt install -y curl wget gnupg lsb-release software-properties-common apt-transport-https ca-certificates

# Install Docker
echo "🐳 Installing Docker..."
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add users to docker group
sudo usermod -aG docker ubuntu
sudo usermod -aG docker $USER

# Install Java (required for Jenkins)
echo "☕ Installing Java..."
sudo apt install -y fontconfig openjdk-17-jre-headless

# Verify Java installation
echo "✅ Java version:"
java -version

# Install Jenkins
echo "🏗️ Installing Jenkins..."
# Add Jenkins repository key
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

# Add Jenkins repository
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Update package list and install Jenkins
sudo apt-get update -y
sudo apt-get install -y jenkins

# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Install Terraform (needed for your pipeline)
echo "🏗️ Installing Terraform..."
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update -y
sudo apt install -y terraform

# Install AWS CLI (useful for AWS operations)
echo "☁️ Installing AWS CLI..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install -y unzip
unzip awscliv2.zip
sudo ./aws/install
rm -rf aws awscliv2.zip

# Install Git (if not already installed)
echo "📝 Installing Git..."
sudo apt install -y git

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart docker
sudo systemctl restart jenkins

# Enable services to start on boot
sudo systemctl enable docker
sudo systemctl enable jenkins

# Wait for Jenkins to start
echo "⏳ Waiting for Jenkins to start..."
sleep 30

# Check service status
echo "🔍 Checking service status..."
echo "Docker status:"
sudo systemctl status docker --no-pager -l

echo "Jenkins status:"
sudo systemctl status jenkins --no-pager -l

# Display Jenkins initial admin password
echo "🔑 Jenkins initial admin password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword 2>/dev/null || echo "Password file not found yet, please wait a moment and check manually"

# Display useful information
echo "📋 Setup Summary:"
echo "==================="
echo "✅ Docker installed and running"
echo "✅ Java $(java -version 2>&1 | head -n 1 | cut -d'"' -f2) installed"
echo "✅ Jenkins installed and running"
echo "✅ Terraform installed: $(terraform version | head -n 1)"
echo "✅ AWS CLI installed: $(aws --version)"
echo "✅ Git installed: $(git --version)"
echo ""
echo "🌐 Access Jenkins at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
echo "🔐 Use the password above to unlock Jenkins"
echo ""
echo "📝 Next steps:"
echo "1. Access Jenkins web interface"
echo "2. Install suggested plugins"
echo "3. Create admin user"
echo "4. Configure Jenkins with your credentials"
echo ""
echo "⚠️ Note: You may need to log out and back in for Docker group membership to take effect"

# Create a simple test script
cat > /home/ubuntu/test-docker.sh << 'EOF'
#!/bin/bash
echo "Testing Docker installation..."
docker run --rm hello-world
echo "Docker test completed!"
EOF

chmod +x /home/ubuntu/test-docker.sh
chown ubuntu:ubuntu /home/ubuntu/test-docker.sh

echo "🧪 Test script created at /home/ubuntu/test-docker.sh"
echo "🎉 Setup completed successfully!"