# Crypto-trades

This server-side application is built with Node.js and MongoDB Atlas, designed to handle trade data and calculate balances. The application exposes two key APIs: one for uploading trade data via CSV files and another for calculating balances based on the uploaded data.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Uploading Trades](#uploading-trades)
  - [Calculating Balances](#calculating-balances)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Docker](#docker)
- [CI/CD Pipeline](#ci-cd-pipeline)
- [Helm](#helm)
- [Contributing](#contributing)

## Features

- **Upload Trades via CSV:** Easily upload trade data using a CSV file.
- **Balance Calculation:** Calculate the balance based on the uploaded trade data.
- **MongoDB Atlas Integration:** Efficiently stores and retrieves trade data using MongoDB Atlas.
- **RESTful API:** Exposes two APIs for trade uploading and balance calculation.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v20 or later)
- npm (v6 or later)
- MongoDB Atlas account and a configured database
- Docker (optional, for containerized deployment)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/PranayReddy-K/Crypto-trades.git
   cd Crypto-trades
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the root directory with the following contents:

   ```env
   MONGODB_URI=your_mongodb_atlas_uri_main_database
   MONGODB_TEST_URI=your_test_database_uri
   ```

4. **Running Application:**

   ```bash
   node src/server.js
   ```

## Configuration

- **MONGODB_URI:** Your MongoDB Atlas connection string for main-database.
- **MONGODB_TEST_URI:** Your MongoDB Atlas connection string for test-database.

## Usage

### Uploading Trades

You can upload trade data via a CSV file using the `/api/upload` endpoint. This API parses the CSV file and stores the trade data in the MongoDB Atlas database.

### Calculating Balances

To calculate the balance based on the uploaded trades, use the `/api/balance` endpoint. This API processes the trade data and returns the calculated balances.

## API Endpoints

### 1. Upload Trades

- **Endpoint:** `/api/upload`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Description:** Upload a CSV file containing trade data.
- **Request Parameters:**
  - `file`: The CSV file containing trade data.
- **Response:**
  - `200 OK`: File uploaded and data saved to database.
  - `400 Bad Request`: Invalid file format or missing parameters.
  - `404 Not Found`: File not found.
  - `500 Internal Server Error`: Internal server error. Please try again later.

### 2. Calculate Balances

- **Endpoint:** `/api/balances`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Description:** Calculate the balance based on the uploaded trade data up to a specific timestamp.
- **Request Parameters:**
  - `timestamp`: The timestamp up to which the balance should be calculated.
- **Response:**
  - `200 OK`: Returns the calculated balances.
  - `400 Bad Request`: `"Timestamp is required"`

## Technologies Used

- **Node.js:** JavaScript runtime for building the server-side application.
- **Express.js:** Web framework for Node.js to build RESTful APIs.
- **MongoDB Atlas:** Cloud-based NoSQL database for data storage.
- **Mongoose:** ODM library for MongoDB and Node.js.
- **CSV-Parser:** Library to parse CSV files in Node.js.

## Docker

### Multi-Stage Build

This project uses Docker to containerize the application. The `Dockerfile` provided utilizes multi-stage builds to optimize the build process and reduce the size of the final image. The multi-stage build helps in separating the build environment from the runtime environment, ensuring that only necessary files are included in the final image.

### Building the Docker Image

To build the Docker image for this application, run the following command:

```bash
docker build -t my-backend-app .
```

## CI/CD Pipeline

This project employs a CI/CD pipeline to automate the build, test, and deployment processes:

- **GitHub Actions**: On each commit or feature update, GitHub Actions triggers the CI/CD pipeline.
- **Build and Test**: The pipeline builds the application, runs test cases, and ensures that the application functions as expected.
- **Image Build and Push**: After a successful build and test, a Docker image is built and pushed to the container registry.
- **Helm Chart Update**: The latest image tag is updated in the Helm chart to reflect the new version, ensuring seamless deployment to the Kubernetes cluster.

This process ensures that every change is validated and deployed efficiently, maintaining the integrity and reliability of the application.

## Helm

This project uses Helm to manage Kubernetes deployments. Helm simplifies the deployment and management of applications on Kubernetes with reusable templates and configuration.

### Helm Templates

- **`deployment.yaml`**: Defines the Kubernetes Deployment for the application, specifying how the pods should be created and managed.
- **`service.yaml`**: Defines the Kubernetes Service to expose the application and manage its network communication.

### GitOps with ArgoCD

- **ArgoCD Integration**: The Helm charts are configured to be watched by ArgoCD. Any changes to the Helm charts trigger ArgoCD to automatically pick up the updates and deploy the new configuration to the Kubernetes cluster.
- **Automatic Deployment**: This setup ensures that any updates to the Helm charts are seamlessly applied to the cluster, maintaining consistency and up-to-date deployments.

By using Helm and ArgoCD together, you achieve a robust and automated deployment process that leverages the power of GitOps for efficient management of your Kubernetes applications.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes.
