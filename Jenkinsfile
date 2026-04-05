@Library('Shared-library') _
pipeline {
  agent { label 'jenkins-agent' }

  environment {
    SONAR_HOME = tool "Sonar"
    MAVEN_HOME = tool "Maven"
  }

  stages {

    stage('Workspace Cleanup') {
      steps { 
        cleanWs() 
        }
    }

    stage('Clone GitHub Repo') {
      steps {
        script {
          code_checkout("https://github.com/hrsh-1294/SnippetStash.git","main")
        }
      }
    }

    stage("Trivy: Filesystem scan") {
      steps { 
        script { 
          trivy_scan() 
          } 
        }
    }

    stage("OWASP: Dependency check") {
      steps { 
        script { 
          owasp_dependency() 
          } 
        }
    }

    stage('Build Selenium Tests') {
      steps {
        script {
        build_selenium_tests()
        }
      }
    }

    stage("SonarQube: Code Analysis") {
      steps {
        script {
          sonarqube_analysis("Sonar","snippetstash","snippetstash")
        }
      }
    }

    stage("SonarQube: Code Quality Gates") {
      steps { 
        script { 
          sonarqube_code_quality() 
          } 
        }
    }

    stage('Start Application') {
      steps {
        script {
          startApplication()
        }
      }
    }

    
    stage('Start Selenium Grid') {
      steps {
        script {
          startSeleniumGrid()
        }
      }
    }

    stage('Run Selenium Tests') {
      steps {
        script {
          runSeleniumTests()
        }
      }
    }

    stage('Stop Selenium Grid') {
      steps {
        script {
          stopSeleniumGrid()
        }
      }
    }

    stage('Stop Application') {
      steps {
        script {
          stopApplication()
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker_build("snippet-stash","latest","harshvashishth")
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          docker_push("snippet-stash","latest","harshvashishth")
        }
      }
    }

    stage('Deploy the Application') {
      steps {
        script {
          docker_compose_app()
        }
      }
    }
  }
}