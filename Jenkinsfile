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
                        // Get outputs and clean them properly
                        def dnsOutput = bat(script: 'terraform output -raw public_dns', returnStdout: true)
                        def ipOutput = bat(script: 'terraform output -raw public_ip', returnStdout: true)
                        
                        // Clean the outputs (remove command echoes and extra whitespace)
                        def dns = dnsOutput.split('\n').findAll { it.contains('.amazonaws.com') }[0]?.trim()
                        def ip = ipOutput.split('\n').findAll { it.matches(/^\d+\.\d+\.\d+\.\d+$/) }[0]?.trim()
                        
                        echo "Fetched DNS: ${dns}"
                        echo "Fetched IP: ${ip}"
                        
                        if (!dns || !ip) {
                            error "Failed to fetch valid DNS or IP from Terraform outputs"
                        }
                        
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
                        
                        // Use PowerShell for better permission handling
                        powershell """
                            # Copy PEM file
                            Copy-Item -Path "${env.PEM_FILE}" -Destination "${env.WORKSPACE}\\temp_key.pem" -Force
                            
                            # Set proper permissions using PowerShell
                            \$pemFile = "${env.WORKSPACE}\\temp_key.pem"
                            \$acl = Get-Acl \$pemFile
                            \$acl.SetAccessRuleProtection(\$true, \$false)
                            
                            # Add permission for current user
                            \$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
                            \$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(\$currentUser, "FullControl", "Allow")
                            \$acl.SetAccessRule(\$accessRule)
                            
                            # Add permission for SYSTEM
                            \$systemRule = New-Object System.Security.AccessControl.FileSystemAccessRule("SYSTEM", "FullControl", "Allow")
                            \$acl.SetAccessRule(\$systemRule)
                            
                            Set-Acl -Path \$pemFile -AclObject \$acl
                            
                            Write-Host "PEM file permissions set successfully"
                        """
                        
                        // Wait for EC2 to be ready
                        sleep(time: 30, unit: 'SECONDS')
                        
                        // Deploy using SSH
                        powershell """
                            \$dns = "${dns}"
                            \$pemFile = "${env.WORKSPACE}\\temp_key.pem"
                            
                            Write-Host "Deploying to: \$dns"
                            
                            # SSH command to deploy
                            ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=NUL -o ConnectTimeout=30 -i \$pemFile ubuntu@\$dns "sudo docker pull ${env.DOCKERHUB_USER}/${env.IMAGE_NAME}:${env.IMAGE_TAG} && sudo docker rm -f ${env.CONTAINER_NAME} || true && sudo docker run -d --name ${env.CONTAINER_NAME} -p 80:80 ${env.DOCKERHUB_USER}/${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                            
                            if (\$LASTEXITCODE -eq 0) {
                                Write-Host "Deployment command executed successfully"
                                
                                # Verify deployment
                                ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=NUL -i \$pemFile ubuntu@\$dns "sudo docker ps | grep ${env.CONTAINER_NAME}"
                                
                                if (\$LASTEXITCODE -eq 0) {
                                    Write-Host "Container is running successfully"
                                } else {
                                    Write-Host "Warning: Could not verify container status"
                                }
                            } else {
                                Write-Host "Deployment failed with exit code: \$LASTEXITCODE"
                                exit \$LASTEXITCODE
                            }
                            
                            # Clean up
                            Remove-Item -Path \$pemFile -Force -ErrorAction SilentlyContinue
                        """
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
                    } else {
                        error "❌ EC2 DNS or IP not found. Deployment may have failed."
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up any remaining temporary files
                powershell 'Remove-Item -Path "${env.WORKSPACE}\\temp_key.pem" -Force -ErrorAction SilentlyContinue'
            }
        }
        success {
            echo '''
                ✅ Pipeline completed successfully!
                🚀 Your SnippetStash application is now live!
            '''
        }
        failure {
            echo '''
                Pipeline failed. Check the logs above for details.
                
            '''
        }
    }
}