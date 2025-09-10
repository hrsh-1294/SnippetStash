@Library('Shared-library') _
pipeline {
  agent {label "jenkins-agent"}


  stages {
    stage('Clone GitHub Repo') {
      steps {
        script{
          code_checkout("https://github.com/hrsh-1294/SnippetStash.git","main")
        }
      }
    }

    stage('Build Docker Image') {
      steps {
          script{
            docker_build("snippet-stash","latest","harshvashishth")
          }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script{
          docker_push("snippet-stash","latest","harshvashishth")
        }
      }
    }

    stage('Deploy the Application') {
      steps {
        script{
          docker_compose()
        }
      }
    }

  }
}