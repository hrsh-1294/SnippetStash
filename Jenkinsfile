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
    EC2_IP = ''
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
            env.EC2_IP = bat(
              script: "terraform output -raw ec2_ip",
              returnStdout: true
            ).trim()
            echo "EC2 IP fetched: ${env.EC2_IP}"
          }
        }
      }
    }

    stage('Deploy App on EC2') {
      steps {
        sshagent(['ec2-ssh-key']) {
          bat """
            ssh -o StrictHostKeyChecking=no ec2-user@${env.EC2_IP} ^
              "docker pull %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% && ^
              docker rm -f %CONTAINER_NAME% || exit 0 && ^
              docker run -d --name %CONTAINER_NAME% -p 80:80 %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG%"
          """
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
