pipeline {
    agent any
    environment {
        // Define variables
        GITHUB_REPO = 'https://github.com/Suyashchavan10/SpotFinder.git'
        DOCKERHUB_USERNAME = 'krutikpatel'
        // DOCKERHUB_USERNAME = 'suyash1910'
        K8S_DEPLOYMENT_FILE = 'k8s-deployment.yml'
        CONFIGMAP_FILE = 'configmap.yml'
    }
    stages {
        // stage('Checkout Code') {
        //     steps {
        //         script {
        //             git branch: 'main', url: "${GITHUB_REPO}"
        //         }
        //     }
        // }

        // stage('Build Docker Images') {
        //     steps {
        //         script{
        //             sh 'docker-compose build'
        //         }
        //     }
        // }

        // stage('Push Docker Images') {
        //     steps {
        //         script{
        //             docker.withRegistry('', 'DockerHubCred'){
        //                 sh "docker tag frontend:latest ${env.DOCKERHUB_USERNAME}/frontend"
        //                 sh "docker tag backend:latest ${env.DOCKERHUB_USERNAME}/backend"
        //                 sh "docker tag model:latest ${env.DOCKERHUB_USERNAME}/model"
        //                 sh "docker push ${env.DOCKERHUB_USERNAME}/frontend"
        //                 sh "docker push ${env.DOCKERHUB_USERNAME}/backend"
        //                 sh "docker push ${env.DOCKERHUB_USERNAME}/model"
        //             }
        //         }
        //     }
        // }

        stage('Deploy to kubernetes using Ansible notebook') {
            steps {
                script {
                    sh """
                        ansible-playbook ansible-deploy.yml \
                        --extra-vars "dockerhub_username=${DOCKERHUB_USERNAME} \
                                    k8s_deployment_file=${K8S_DEPLOYMENT_FILE} \
                                    configmap_file=${CONFIGMAP_FILE}" \
                        -vv
                    """
                }
            }
        }

        // stage('Start Minikube') {
        //     steps {
        //         script {
        //             // change driver=virtualbox if needed
        //             sh "minikube delete"
        //             sh "minikube start --driver=docker"
        //         }
        //     }
        // }

        // stage('Deploy to Kubernetes') {
        //     steps {
        //         script{
        //             sh "kubectl apply -f ${env.CONFIGMAP_FILE}"
        //             sh "kubectl apply -f ${env.K8S_DEPLOYMENT_FILE}"
        //         }
        //     }
        // }

        // stage('Check Minikube Status') {
        //     steps {
        //         script {
        //             sh 'minikube status'
        //             sh 'kubectl get services'
        //             sh 'kubectl get pods'
        //             sh 'minikube ip'
        //         }
        //     }
        // }
    }
}
