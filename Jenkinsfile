pipeline {
  agent any

  environment {
    AWS_REGION = "us-east-1"
    ECR_REGISTRY = "933768354046.dkr.ecr.us-east-1.amazonaws.com"
    ECR_REPO_NAME = "backend"
    IMAGE_TAG = "latest"
    FULL_IMAGE_NAME = "${ECR_REGISTRY}/${ECR_REPO_NAME}:${IMAGE_TAG}"
  }

  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/arunchintu-1/projectk.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          echo "Building Docker image..."
          docker build -t backend:${IMAGE_TAG} ./fullstackapp/backend
        '''
      }
    }

    stage('Login to ECR') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh '''
            echo "Logging into AWS ECR..."
            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
          '''
        }
      }
    }

    stage('Tag & Push to ECR') {
      steps {
        sh '''
          echo "Tagging and pushing Docker image to ECR..."
          docker tag backend:${IMAGE_TAG} $FULL_IMAGE_NAME
          docker push $FULL_IMAGE_NAME
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh '''
            echo "Deploying to EKS cluster..."
            aws eks update-kubeconfig --region $AWS_REGION --name projectcluster

            echo "Updating Kubernetes deployment with new image..."
            sed -i "s|image:.*|image: $FULL_IMAGE_NAME|" ./fullstackapp/backend/backend-deployment.yaml

            echo "Applying deployment to Kubernetes..."
            kubectl apply -f ./fullstackapp/backend/backend-deployment.yaml
          '''
        }
      }
    }
  }
}
