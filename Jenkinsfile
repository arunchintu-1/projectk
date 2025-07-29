pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'
    ECR_REPO_NAME = 'backend'
    ECR_REGISTRY = "933768354046.dkr.ecr.us-east-1.amazonaws.com/backend" 
    IMAGE_TAG = "${backend}:latest"
    FULL_IMAGE_NAME = "${backend}/${latest}"
  }

  stages {
    stage('Clone Repo') {
     steps {
       git branch: 'main', url: 'https://github.com/arunchintu-1/projectk.git'
     }
  }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t backend:latest .'
      }
    }

    stage('Login to ECR') {
      steps {
        sh '''
          aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 933768354046.dkr.ecr.us-east-1.amazonaws.com/backend
        '''
      }
    }

    stage('Tag & Push to ECR') {
      steps {
        sh '''
          docker tag latest backend:latest
          docker push backend:latest
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          # Update kubeconfig for EKS (optional if already done in Jenkins node)
          aws eks update-kubeconfig --region $AWS_REGION --name projectcluster

          # Replace image in the deployment file dynamically (optional)
          sed -i "s|node:18|backend:latest|" ./backend/backend-deployment.yaml

          # Apply the deployment
          kubectl apply -f ./backend/backend-deployment.yaml
        '''
      }
    }
  }
}
