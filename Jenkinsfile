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
        dir('terraform') {
          withCredentials([file(credentialsId: 'snippetstash-key', variable: 'PEM_FILE')]) {
            powershell '''
              $dns = "${env.EC2_DNS}"
              $pemPath = "${PEM_FILE}"
              
              Write-Host "Using PEM file at $pemPath"
              Write-Host "Deploying to $dns"

              ssh -o StrictHostKeyChecking=no -i "$pemPath" ubuntu@$dns `
              "docker pull harshvashishth/snippetstash:latest && `
               docker rm -f snippetstash_container || true && `
               docker run -d --name snippetstash_container -p 80:80 harshvashishth/snippetstash:latest"
            '''
          }
        }
      }
    }

    stage('App URL') {
      steps {
        echo "Visit your deployed app at: http://${env.EC2_IP}"
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
