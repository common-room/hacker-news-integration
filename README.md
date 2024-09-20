# Hacker News + Common Room Integration
End to end working example that integrates Hacker News with Common Room.

## Overview

This project provides a service that fetches data from Hacker News and integrates it with Common Room. The service performs the following tasks:

1. **Fetch Historical Data**: Retrieves historical stories from Hacker News based on specified story types.
2. **Subscribe for Updates**: Subscribes to real-time updates from Hacker News and processes new stories as they are published.
3. **Filter and Process Stories**: Filters stories and comments to only those that match the configured keywords and processes them to be added to Common Room.

## Installation

1. **Clone the Repository**:
```bash
git clone https://github.com/your-username/hacker-news-integration.git
cd hacker-news-integration
```
2. **Install Dependencies**:
```bash
npm install
```
## Configuration
Update the following config files with keywords, tokens, and destinationSourceId:
- appConfig.js 
- commonRoomConfig.js
    
## Running the Application
To run the application locally, use the following command:
```bash
npm start
```

## Build a Docker container
To run the application in a Docker container, install Docker and follow these steps:

1. **Build the Docker Image**
```bash
docker build -t hacker-news-integration .
```

2. **Run the Docker Container**
```bash
docker run -d --name hacker-news-integration-container hacker-news-integration
```

## Deploy
There are many options for deploying the integration to a cloud service. In this example, we'll walk through 
how you can deploy the Docker container to AWS Fargate, Amazon's serverless compute engine. This will allow
us to deploy our container without having to worry about managing the underlying infrastructure. 

1. **Create an ECS Cluster**
    1. Open the Amazon ECS Console: Navigate to the Amazon ECS console.
    2. Create a Cluster: Click on "Create Cluster" and select the "Networking only" option for Fargate.
    3. Configure Cluster: Provide a name for your cluster and click "Create".
2. **Create an ECR Repository**
    1. Open the Amazon ECR Console: Navigate to the Amazon ECR console.
    2. Create a Repository: Click on "Create repository" and name your repository `hacker-news-integration`.
    3. Note the Repository URI: You will need this URI to push your Docker image.
3. **Build and Push Your Docker Image to ECR**
    1. Authenticate Docker to Your ECR Registry:
        ```bash
        aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com
        ```
        You can use the `aws configure` command to set up your access key ID, secret access key, region and output if you haven't already done so. You can read more [here](https://docs.aws.amazon.com/cli/v1/userguide/cli-authentication-user.html).
        
    2. Build the Docker Image:
        ```bash
        docker build -t hacker-news-integration .
        ```
    3. Tag the Docker Image:
        ```bash
        docker tag hacker-news-integration:latest <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com/hacker-news-integration:latest
        ```
    4. Push the Docker Image to ECR:
        ```bash
        docker push <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com/hacker-news-integration:latest
        ```
4. **Create a Task Definition**
    1. Open the Amazon ECS Console: Navigate to the Amazon ECS console.
    2. Create a Task Definition: Go to "Task Definitions" and click "Create new Task Definition".
    3. Select Fargate: Choose the Fargate launch type.
    4. Configure the Task Definition:
        - Container Name: Provide a name for your container.
        - Image: Specify the Docker image URI (e.g. \<your-account-id\>.dkr.ecr.\<your-region\>.amazonaws.com/hacker-news-integration:latest).
        - Memory Limits: Set the memory limits.
        - ort Mappings: Map the container port to a host port (e.g., 3000:3000).

5. **Create a Service**
    1. Create a Service: In the ECS console, go to "Services" and click "Create".
    2. Configure the Service:
        - Launch Type: Select Fargate.
        - Task Definition: Choose the task definition you created.
        - Cluster: Select the cluster you created.
        - Service Name: Provide a name for your service.
        - Number of Tasks: Specify the number of tasks to run.
        - VPC and Subnets: Select the VPC and subnets for your service.
        - Security Groups: Configure security groups to allow traffic to your container.

6. **Deploy the Docker Container**
    1. Deploy the Service: Click "Create Service" to deploy your Docker container.
    2. Monitor the Deployment: Use the ECS console to monitor the deployment and ensure that your container is running.


## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
