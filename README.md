
---

# AdvancedTODO

This project is a full-stack application with a **React.js** frontend and a **Node.js** backend. The application is built using **TypeScript** for both frontend and backend, **Vite** for bundling the frontend, and **TailwindCSS** for styling. The backend is connected to **MongoDB** for the database and uses **Morgan** for logging.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Frontend Setup](#frontend-setup)
3. [Backend Setup](#backend-setup)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Technologies Used](#technologies-used)

## Project Setup

### Prerequisites

Before setting up the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (for dependency management)
- [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/your-repo/advanced-TODO.git
cd advanced-TODO
```

### Install Dependencies

1. **Frontend Dependencies:**

   Navigate to the frontend directory and install the necessary dependencies.

   ```bash
   cd frontend
   npm install
   ```

2. **Backend Dependencies:**

   Navigate to the backend directory and install the necessary dependencies.

   ```bash
   cd backend
   npm install
   ```

### Running the Project Locally

#### Frontend

To run the frontend locally, follow these steps:

1. Navigate to the `frontend` directory.

   ```bash
   cd frontend
   ```

2. Start the development server with **Vite**.

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` by default.

#### Backend

To run the backend locally, follow these steps:

1. Navigate to the `backend` directory.

   ```bash
   cd backend
   ```

2. Start the backend server.

   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:4000` by default.

### Environment Variables

Make sure to configure the environment variables for both frontend and backend.

- **Frontend (.env file)**: 
  - Add API base URLs or any necessary environment variables for frontend communication with the backend.

- **Backend (.env file)**:
  - `MONGO_URI`: MongoDB connection string.
  - `PORT`: The port for the backend server (default is 4000).

  
You can create a `.env` file in the `backend` and `frontend` directories to define these variables.

## Frontend Setup (React.js with Vite & TailwindCSS)

The frontend is built using **React.js** with **Vite** as the bundler and **TailwindCSS** for styling.

1. **Vite**: Vite is used for fast development and build processes. The default port is 3000, but you can change it in `vite.config.ts`.

2. **TailwindCSS**: TailwindCSS is used for utility-first CSS styling. Ensure your Tailwind configuration is set up correctly in the `tailwind.config.ts` file.

#### Commands for Frontend

- **Run development server:**

  ```bash
  npm run dev
  ```

- **Build the project for production:**

  ```bash
  npm run build
  ```

- **Check for linter errors (ESLint):**

  ```bash
  npm run lint
  ```

## Backend Setup (Node.js with TypeScript & MongoDB)

The backend is a **Node.js** application developed using **TypeScript** and **MongoDB** for database interaction. **Morgan** is used as the logger.

1. **MongoDB**: Make sure you have a MongoDB instance running (locally or through a service like MongoDB Atlas) and configure the connection string in your `.env` file.

2. **Morgan**: Morgan is used for logging requests to the backend API.

#### Commands for Backend

- **Run the development server:**

  ```bash
  npm run dev
  ```

- **Build the project for production:**

  ```bash
  npm run build
  ```

- **Run tests:**

  ```bash
  npm run test
  ```

## CI/CD Pipeline

Both the frontend and backend have **CI/CD pipelines** connected to **AWS Elastic Beanstalk** for deployment and **AWS S3** for storage.

- **Frontend**:
  - When changes are pushed to the `develop` branch, the CI/CD pipeline automatically deploys the frontend to AWS S3.

- **Backend**:
  - The backend is deployed to **AWS Elastic Beanstalk** when changes are pushed to the `develop` branch.

### How the CI/CD Pipeline Works

1. **GitHub Actions** is used for Continuous Integration and Deployment.
2. For each push to the `develop` branch:
   - Frontend code is built and deployed to AWS S3.
   - Backend code is built and deployed to AWS Elastic Beanstalk.

## Technologies Used

### Frontend

- **React.js**: JavaScript library for building user interfaces.
- **Vite**: Next-generation frontend build tool for faster development.
- **TailwindCSS**: Utility-first CSS framework for designing custom UIs.

### Backend

- **Node.js**: JavaScript runtime for building backend applications.
- **Express.js**: Web framework for Node.js to handle API requests.
- **TypeScript**: Superset of JavaScript that adds type safety to the application.
- **MongoDB**: NoSQL database for storing application data.
- **Morgan**: HTTP request logger middleware for Node.js.

### DevOps / CI/CD

- **AWS Elastic Beanstalk**: Platform as a Service (PaaS) for deploying and managing applications in the cloud.
- **AWS S3**: Cloud storage service for static assets such as frontend builds.
- **GitHub Actions**: CI/CD automation platform integrated with GitHub.

---

