pipeline {
    agent any
    
    environment {
        IMAGE_NAME = "snippetstash"
        IMAGE_TAG = "latest"
        DOCKERHUB_USER = "harshvashishth"
        AWS_ACCESS_KEY_ID = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
        AWS_REGION = "ap-south-1"
        CONTAINER_NAME = "snippetstash_container"
    }
    
    stages {
        stage('Clone GitHub Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/hrsh-1294/SnippetStash.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat '''
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                        docker push %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%
                    '''
                }
            }
        }
        
        stage('Provision Infrastructure with Terraform') {
            steps {
                dir('terraform') {
                    bat '''
                        terraform init
                        terraform apply -auto-approve
                    '''
                }
            }
        }
        
        stage('Fetch EC2 DNS and IP') {
            steps {
                dir('terraform') {
                    script {
                        def dns = bat(script: 'terraform output -raw public_dns', returnStdout: true).trim()
                        def ip = bat(script: 'terraform output -raw public_ip', returnStdout: true).trim()
                        echo "Fetched DNS: ${dns}"
                        echo "Fetched IP: ${ip}"
                        env.EC2_DNS = dns
                        env.EC2_IP = ip
                    }
                }
            }
        }
        
        stage('Deploy App on EC2') {
            steps {
                withCredentials([file(credentialsId: 'snippetstash-key', variable: 'PEM_FILE')]) {
                    script {
                        def dns = env.EC2_DNS
                        def ip = env.EC2_IP
                        
                        echo "Deploying to DNS: ${dns}"
                        echo "Deploying to IP: ${ip}"
                        
                        // Copy PEM file to workspace with proper permissions
                        bat """
                            copy "%PEM_FILE%" "%WORKSPACE%\\temp_key.pem"
                            icacls "%WORKSPACE%\\temp_key.pem" /inheritance:r
                            icacls "%WORKSPACE%\\temp_key.pem" /grant:r "%USERNAME%":(F)
                        """
                        
                        // Wait a bit for EC2 to be ready
                        sleep(time: 30, unit: 'SECONDS')
                        
                        // Deploy using SSH
                        bat """
                            ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=NUL -o ConnectTimeout=30 -i "%WORKSPACE%\\temp_key.pem" ubuntu@${dns} "sudo docker pull ${env.DOCKERHUB_USER}/${env.IMAGE_NAME}:${env.IMAGE_TAG} && sudo docker rm -f ${env.CONTAINER_NAME} || true && sudo docker run -d --name ${env.CONTAINER_NAME} -p 80:80 ${env.DOCKERHUB_USER}/${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                        """
                        
                        // Verify deployment
                        bat """
                            ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=NUL -i "%WORKSPACE%\\temp_key.pem" ubuntu@${dns} "sudo docker ps | grep ${env.CONTAINER_NAME}"
                        """
                        
                        // Clean up temporary key file
                        bat 'del "%WORKSPACE%\\temp_key.pem"'
                    }
                }
            }
        }
        
        stage('App URL') {
            steps {
                script {
                    if (env.EC2_DNS && env.EC2_IP) {
                        echo "🎉 Deployment completed successfully!"
                        echo "📱 Access your SnippetStash application at:"
                        echo "🌐 DNS: http://${env.EC2_DNS}"
                        echo "🔗 IP:  http://${env.EC2_IP}"
                        echo ""
                        echo "⏰ Please wait 1-2 minutes for the application to fully start up."
                        
                        // Test connectivity
                        bat """
                            echo Testing connectivity to ${env.EC2_IP}...
                            ping -n 4 ${env.EC2_IP} || echo "Ping failed, but this is normal for some EC2 instances"
                        """
                    } else {
                        error " EC2 DNS or IP not found. Deployment may have failed."
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up any remaining temporary files
                bat 'if exist "%WORKSPACE%\\temp_key.pem" del "%WORKSPACE%\\temp_key.pem"'
            }
        }
        success {
            echo '''
                Pipeline completed successfully!
                Your SnippetStash application is now live!
            '''
        }
        failure {
            echo '''
                Pipeline failed. Check the logs above for details.
                
            '''
        }
    }
}