pipeline {
  agent any

  environment {
    IMAGE_NAME = "snippetstash"
    IMAGE_TAG = "latest"
    DOCKERHUB_USER = "harshvashishth"
    AWS_REGION = "ap-south-1"
    CONTAINER_NAME = "snippetstash_container"
  }

  stages {
    stage('Terraform Init & Apply') {
      steps {
        dir('terraform') {
          withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'aws-creds'
          ]]) {
            withEnv(["AWS_REGION=${env.AWS_REGION}"]) {
              bat 'terraform init'
              bat 'terraform apply -auto-approve'
            }
          }
        }
      }
    }

    stage('Fetch EC2 Public DNS & IP') {
      steps {
        script {
          dir('terraform') {
            env.EC2_PUBLIC_DNS = bat(script: 'terraform output -raw public_dns', returnStdout: true).trim()
            env.EC2_PUBLIC_IP = bat(script: 'terraform output -raw public_ip', returnStdout: true).trim()
          }
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        bat 'docker build -t %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% .'
      }
    }

    stage('Push to DockerHub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
          bat 'docker push %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG%'
        }
      }
    }

    stage('Deploy to EC2 via SSH') {
      steps {
        script {
          echo "Running SSH command to deploy on EC2..."
          withCredentials([file(credentialsId: 'snippetstash-key', variable: 'PEM_FILE')]) {
            bat """
              ssh -o StrictHostKeyChecking=no -i "%PEM_FILE%" ubuntu@${env.EC2_PUBLIC_DNS} ^
              "docker pull %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% && ^
              docker rm -f %CONTAINER_NAME% || true && ^
              docker run -d --name %CONTAINER_NAME% -p 80:80 %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG%"
            """
          }
        }
      }
    }

    stage('App URL') {
      steps {
        echo "Visit your deployed app at: http://${env.EC2_PUBLIC_IP}"
      }
    }
  }

  post {
    success {
      echo "Pipeline completed successfully!"
    }
    failure {
      echo "Pipeline failed. Check the logs above."
    }
  }
}
