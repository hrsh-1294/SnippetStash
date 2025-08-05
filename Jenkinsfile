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

    stage('Fetch EC2 DNS') {
      steps {
        dir('terraform') {
          script {
            def dns = bat(script: 'terraform output -raw public_dns', returnStdout: true).trim()
            echo "Fetched DNS: ${dns}"
            env.EC2_DNS = dns
          }
        }
      }
    }

    stage('Deploy App on EC2') {
      steps {
        dir('terraform') {
          script {
            echo "Deploying to EC2 at DNS: ${env.EC2_DNS}"

            bat """
              icacls snippetstash-key.pem /inheritance:r
              icacls snippetstash-key.pem /grant:r "%USERNAME%:R"

              ssh -o StrictHostKeyChecking=no -i "snippetstash-key.pem" ubuntu@${env.EC2_DNS} ^
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
        echo "Visit your app at: http://${env.EC2_DNS}"
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
