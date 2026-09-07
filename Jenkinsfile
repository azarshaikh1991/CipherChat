pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = 'docker-hub-credentials'
        DOCKER_HUB_USER  = 'azarr1991'
        IMAGE_NAME       = 'arzo-messenger'
        IMAGE_TAG        = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    export PATH="/Users/azarshaikh/.nvm/versions/node/v24.19.0/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/bin:/bin:/usr/sbin:/sbin"
                    npm install
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Arzo Image...'
                sh '''
                    export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin"
                    docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_HUB_CREDS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin"
                        echo "$PASS" | docker login -u "$USER" --password-stdin
                        docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy Arzo') {
            steps {
                sh '''
                    export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin"
                    docker compose down || true
                    docker compose up -d
                '''
            }
        }
    }

    post {
        always {
            sh '''
                export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin"
                docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true
            '''
        }
        success {
            echo 'Arzo App deployment pipeline finished successfully! Access it on http://localhost:3000'
        }
    }
}
