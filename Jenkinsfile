pipeline {
  agent any
  environment {
    IMAGE_NAME = "snippetstash"
    CONTAINER_NAME = "snippetstash_container"
  }

  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/hrsh-1294/SnippetStash.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        dir('SnippetStash') {
          sh 'sudo docker build -t $IMAGE_NAME .'
        }
      }
    }

    stage('Remove Old Container') {
      steps {
        sh 'sudo docker rm -f $CONTAINER_NAME || true'
      }
    }

    stage('Run New Container') {
      steps {
        sh 'sudo docker run -d --name $CONTAINER_NAME -p 80:80 $IMAGE_NAME'
      }
    }
  }
}
