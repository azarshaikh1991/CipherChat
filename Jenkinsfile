node {
    def DOCKER_HUB_CREDS = 'docker-hub-credentials'
    def DOCKER_HUB_USER  = 'azarr1991'
    def IMAGE_NAME       = 'arzo-messenger'
    def IMAGE_TAG        = "${env.BUILD_NUMBER}"

    try {
        stage('Checkout') {
            checkout scm
        }

        stage('Install Dependencies') {
            // Login shell use karne se Mac ka npm path automatically mil jayega
            sh '''
                export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
                npm install
            '''
        }

        stage('Build Docker Image') {
            echo 'Building Arzo Image...'
            sh '''
                export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
                docker build -t ''' + "${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}" + ''' .
                docker tag ''' + "${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest" + '''
            '''
        }

        stage('Push to Docker Hub') {
            withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                sh '''
                    export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
                    echo "$PASS" | docker login -u "$USER" --password-stdin
                    docker push ''' + "${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}" + '''
                    docker push ''' + "${DOCKER_HUB_USER}/${IMAGE_NAME}:latest" + '''
                '''
            }
        }

        stage('Deploy Arzo') {
            sh '''
                export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
                docker compose down || true
                docker compose up -d
            '''
        }
    } finally {
        sh '''
            export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
            docker rmi ''' + "${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}" + ''' || true
        '''
        echo 'Arzo App deployment pipeline finished successfully! Access it on http://localhost:3000'
    }
}node {
    def DOCKER_HUB_CREDS = 'docker-hub-credentials'
    def DOCKER_HUB_USER  = 'azarr1991'
    def IMAGE_NAME       = 'arzo-messenger'
    def IMAGE_TAG        = "${env.BUILD_NUMBER}"

    // Mac ke liye sabhi possible paths (Homebrew, Node, Docker Desktop) include kar rahe hain
    env.PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin:${env.PATH}"

    try {
        stage('Checkout') {
            checkout scm
        }

        stage('Install Dependencies') {
            sh 'npm install'
        }

        stage('Build Docker Image') {
            echo 'Building Arzo Image...'
            sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
            sh "docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
        }

        stage('Push to Docker Hub') {
            withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                sh "echo \$PASS | docker login -u \$USER --password-stdin"
                sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy Arzo') {
            sh 'docker compose down || true'
            sh 'docker compose up -d'
        }
    } finally {
        sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
        echo 'Arzo App deployment pipeline finished successfully! Access it on http://localhost:3000'
    }
}node {
    def DOCKER_HUB_CREDS = 'docker-hub-credentials'
    def DOCKER_HUB_USER  = 'azarr1991'
    def IMAGE_NAME       = 'arzo-messenger'
    def IMAGE_TAG        = "${env.BUILD_NUMBER}"

    // Mac system path configuration for npm and docker commands
    env.PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/Users/azarshaikh/.nvm/versions/node/v18.0.0/bin:${env.PATH}"

    try {
        stage('Checkout') {
            checkout scm
        }

        stage('Install Dependencies') {
            sh 'npm install'
        }

        stage('Build Docker Image') {
            echo 'Building Arzo Image...'
            sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
            sh "docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
        }

        stage('Push to Docker Hub') {
            withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                sh "echo \$PASS | docker login -u \$USER --password-stdin"
                sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy Arzo') {
            sh 'docker compose down || true'
            sh 'docker compose up -d'
        }
    } finally {
        sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
        echo 'Arzo App deployment pipeline finished successfully! Access it on http://localhost:3000'
    }
}pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/Users/azarshaikh/.nvm/versions/node/v18.0.0/bin:${env.PATH}"
        DOCKER_HUB_CREDS = 'docker-hub-credentials'
        DOCKER_HUB_USER  = 'azarr1991'
        IMAGE_NAME       = 'arzo-messenger'
        IMAGE_TAG        = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Arzo Image...'
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy Arzo') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
        success {
            echo 'Arzo App is LIVE on http://localhost:3000'
        }
    }
}pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/Users/azarshaikh/.nvm/versions/node/v18.0.0/bin:${env.PATH}"
        DOCKER_HUB_CREDS = 'docker-hub-credentials'
        DOCKER_HUB_USER  = 'azarr1991'
        IMAGE_NAME       = 'arzo-messenger'
        IMAGE_TAG        = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Arzo Image...'
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy Arzo') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
        success {
            echo 'Arzo App is LIVE on http://localhost:3000'
        }
    }
}pipeline {
    agent {
        any true
    }

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/Users/azarshaikh/.nvm/versions/node/v18.0.0/bin:${env.PATH}"
        DOCKER_HUB_CREDS = 'docker-hub-credentials'
        DOCKER_HUB_USER  = 'azarr1991'
        IMAGE_NAME       = 'arzo-messenger'
        IMAGE_TAG        = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Arzo Image...'
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy Arzo') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
        success {
            echo 'Arzo App is LIVE on http://localhost:3000'
        }
    }
}pipeline {
    agent any

    environment {
        // Mac par npm aur docker ka path access karne ke liye PATH variable add karein
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/Users/azarshaikh/.nvm/versions/node/v18.0.0/bin:${env.PATH}"
        DOCKER_HUB_CREDS = 'docker-hub-credentials'
        DOCKER_HUB_USER  = 'azarr1991' // <-- Yahan apna asli Docker Hub username dalein
        IMAGE_NAME       = 'arzo-messenger'
        IMAGE_TAG        = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Arzo Image...'
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy Arzo') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
        success {
            echo 'Arzo App is LIVE on http://localhost:3000'
        }
    }
}pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = 'docker-hub-credentials'
        DOCKER_HUB_USER  = 'your-dockerhub-username' // Apna Docker Hub Username Dalein
        IMAGE_NAME       = 'arzo-messenger'
        IMAGE_TAG        = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Arzo Image...'
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy Arzo') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
        success {
            echo 'Arzo App is LIVE on http://localhost:3000'
        }
    }
}
