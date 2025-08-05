pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'harshvashishth/snippetstash:latest'
    }

    stages {
        stage('Terraform Init & Apply') {
            steps {
                dir('terraform') {
                    withCredentials([file(credentialsId: 'snippetstash-key', variable: 'KEY')]) {
                        bat "terraform init"
                        bat "terraform apply -auto-approve"
                    }
                }
            }
        }

        stage('Fetch EC2 Public DNS & IP') {
            steps {
                dir('terraform') {
                    script {
                        def publicDns = bat(script: 'terraform output -raw public_dns', returnStdout: true).trim()
                        def publicIp = bat(script: 'terraform output -raw public_ip', returnStdout: true).trim()
                        env.EC2_DNS = publicDns
                        env.EC2_IP = publicIp
                        echo "Public DNS: ${publicDns}"
                        echo "Public IP: ${publicIp}"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    bat "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy to EC2 via SSH') {
            steps {
                withCredentials([file(credentialsId: 'snippetstash-key', variable: 'KEY')]) {
                    bat """
                    echo Y | plink -i %KEY% ubuntu@${env.EC2_DNS} ^
                    "docker pull ${DOCKER_IMAGE} && docker rm -f snippetstash_container || true && docker run -d --name snippetstash_container -p 80:80 ${DOCKER_IMAGE}"
                    """
                }
            }
        }

        stage('App URL') {
            steps {
                echo "Visit the app at: http://${env.EC2_DNS}"
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed. Check the logs above."
        }
    }
}
