pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'
    ECR_REPO_NAME = 'backend'
    ECR_REGISTRY = '933768354046.dkr.ecr.us-east-1.amazonaws.com'
    IMAGE_TAG = 'latest'
    FULL_IMAGE_NAME = "933768354046.dkr.ecr.us-east-1.amazonaws.com/backend:latest"
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
          docker build -t backend:latest ./fullstackapp/backend
        '''
      }
    }

    stage('Login to ECR') {
      steps {
        script {
          withAWS(credentials: 'aws-creds', region: 'us-east-1') {
            sh '''
              aws ecr get-login-password --region us-east-1 | \
              docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
            '''
           }
          }
        }
      }       

    stage('Tag & Push to ECR') {
      steps {
        sh '''
          echo "Tagging image..."
          docker tag backend:latest 933768354046.dkr.ecr.us-east-1.amazonaws.com/backend:latest

          echo "Pushing image to ECR..."
          docker push 933768354046.dkr.ecr.us-east-1.amazonaws.com/backend:latest
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          echo "Deploying to EKS cluster..."
          aws eks update-kubeconfig --region us-east-1 --name projectcluster

          # Optional: Update image in deployment.yaml dynamically
          sed -i "s|image:.*|image: backend:latest|" ./fullstackapp/backend/backend-deployment.yaml

          kubectl apply -f ./fullstackapp/backend/backend-deployment.yaml
        '''
      }
    }
  }
}
