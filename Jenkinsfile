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

    stage('Fetch EC2 IP') {
      steps {
        dir('terraform') {
          script {
            def ip = bat(script: 'terraform output -raw public_ip', returnStdout: true).trim()
            echo "Fetched IP: ${ip}"
            env.EC2_IP = ip
          }
        }
      }
    }

    stage('Deploy App on EC2') {
      steps {
        dir('terraform') {
          script {
            // Extract public IP to file
            bat 'terraform output -raw public_ip > ec2_ip.txt'

            // Read public IP into a variable
            def ec2Ip = readFile('ec2_ip.txt').trim()

            // Log IP
            echo "Deploying to EC2 at IP: ${ec2Ip}"

            // Run SSH commands using secure permissions
            bat """
              icacls snippetstash-key.pem /inheritance:r
              icacls snippetstash-key.pem /grant:r "%USERNAME%:R"

              ssh -o StrictHostKeyChecking=no -i "snippetstash-key.pem" ec2-user@${ec2Ip} ^
              "docker pull harshvashishth/snippetstash:latest && ^
               docker rm -f snippetstash_container || true && ^
               docker run -d --name snippetstash_container -p 80:80 harshvashishth/snippetstash:latest"
            """
          }
        }
      }
    }




    stage('App URL') {
      steps {
        echo "Visit your app at: http://${env.EC2_IP}"
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed. Please check the logs.'
    }
  }
}
