pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'
    ECR_REPO_NAME = 'backend'
    ECR_REGISTRY = '933768354046.dkr.ecr.us-east-1.amazonaws.com'
    IMAGE_TAG = 'latest'
    FULL_IMAGE_NAME = "backend/ backend:latest"
  }

  stages {
    stage('Clone Repo') {
      steps {
        git branch: 'main', url: 'https://github.com/arunchintu-1/projectk.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          echo "Building Docker image..."
          ls -l  # Optional: Show files
          docker build -t backend:latest ./fullstackapp/backend
        '''
      }
    }

    stage('Login to ECR') {
      steps {
        sh '''
           echo "Logging into AWS ECR..."
           aws configure set aws_access_key_id $AWS_CREDENTIALS_USR
           aws configure set aws_secret_access_key $AWS_CREDENTIALS_PSW
           aws configure set region us-east-1
           aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 933768354046.dkr.ecr.us-east-1.amazonaws.com/backend       '''

      }
    }

    stage('Tag & Push to ECR') {
      steps {
        sh '''
          echo "Pushing image to ECR..."
          docker push backend:latest
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          echo "Deploying to EKS cluster..."
          aws eks update-kubeconfig --region us-east-1 --name projectcluster

          # Replace image in deployment YAML (optional if already set)
          sed -i "s|image:.*|image: backend:latest|" ./backend/backend-deployment.yaml

          kubectl apply -f ./backend/backend-deployment.yaml
        '''
      }
    }
  }
}
