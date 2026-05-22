@Library('Shared-library') _
pipeline {
  agent { label 'jenkins-agent' }

  environment {
    SONAR_HOME = tool "Sonar"
    MAVEN_HOME = tool "Maven"
  }

  tools {
    maven "Maven"
  }

  stages {

    // stage('Workspace Cleanup') {
    //   steps { 
    //     cleanWs() 
    //     }
    // }

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

  }

  post {
        success {
            script {
                emailext attachLog: true,
                from: 'harshvashishth12@gmail.com',
                subject: "SnippetStash Application has been updated and deployed - '${currentBuild.result}'",
                body: """
                    <html>
                    <body>
                        <div style="background-color: #FFA07A; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Project: ${env.JOB_NAME}</p>
                        </div>
                        <div style="background-color: #90EE90; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Build Number: ${env.BUILD_NUMBER}</p>
                        </div>
                        <div style="background-color: #87CEEB; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">URL: ${env.BUILD_URL}</p>
                        </div>
                    </body>
                    </html>
            """,
            to: 'harshvashishth12@gmail.com',
            mimeType: 'text/html'
            }
        }
      failure {
            script {
                emailext attachLog: true,
                from: 'harshvashishth12@gmail.com',
                subject: "SnippetStash Application build failed - '${currentBuild.result}'",
                body: """
                    <html>
                    <body>
                        <div style="background-color: #FFA07A; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Project: ${env.JOB_NAME}</p>
                        </div>
                        <div style="background-color: #90EE90; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Build Number: ${env.BUILD_NUMBER}</p>
                        </div>
                    </body>
                    </html>
            """,
            to: 'harshvashishth12@gmail.com',
            mimeType: 'text/html'
            }
        }
    }
}
