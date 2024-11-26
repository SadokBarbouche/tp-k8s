pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "sadokbarbouche/tp-k8s"
        GIT_REPO = "https://github.com/SadokBarbouche/tp-k8s"
        DOCKER_CREDENTIALS_ID = 'docker-token'
    }


    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', 
                                                 usernameVariable: 'DOCKER_USERNAME', 
                                                 passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        sh '''
                            echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                            docker push $DOCKER_IMAGE
                            docker logout
                        '''
                    }
                }
            }
        }
        stage('Deploy on Kubernetes') {
            steps {
                script {
                    sh '''
                        export KUBECONFIG=/var/jenkins_home/kube
                        kubectl set image deployment/web-app-depl web-application=${DOCKER_IMAGE} --record
                    '''
                }
            }
        }
        stage('Rollout Status') {
            steps {
                script {
                    sh '''
                        export KUBECONFIG=/var/jenkins_home/kube
                        kubectl rollout status deployment/web-app-depl
                        echo "Rollout Done"
                    '''
                }
            }
        }
    }
}