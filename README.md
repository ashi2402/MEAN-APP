# MEAN Stack – Employee Management App

A full-stack Employee Management application built using the MEAN stack: MongoDB, Express.js, Angular, and Node.js.

## Features

- Employee management APIs using Node.js and Express.js
- MongoDB integration using Mongoose
- Employee listing, search, filtering, and pagination
- Angular frontend with routing and reusable components
- Authentication and route protection
- HTTP interceptors for API requests
- Centralized backend error handling

## Tech Stack

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Database |
| Express.js | Backend API framework |
| Angular | Frontend framework |
| Node.js | JavaScript runtime |
| Mongoose | MongoDB object modeling |
| TypeScript | Type-safe frontend development |

## Project Structure

```text
MEAN-APP/
├── backend/
│   ├── scripts/
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
└── employee-management-ui/
    ├── src/
    ├── angular.json
    ├── package.json
    └── .gitignore
```

## Prerequisites

- Node.js and npm
- MongoDB Atlas account or a MongoDB instance
- Angular CLI (if needed)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ashi2402/MEAN-APP.git
cd MEAN-APP
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Never commit your `.env` file or expose database credentials.

Start the backend using the appropriate script defined in `backend/package.json`.

### 3. Set up the Angular frontend

Open a new terminal:

```bash
cd employee-management-ui
npm install
```

Start the frontend using the script defined in `employee-management-ui/package.json`.

## Learning Objectives

This project demonstrates practical experience with:

- REST API development
- Angular and Node.js integration
- MongoDB queries and pagination
- Authentication and authorization
- Frontend-backend communication
- Environment configuration and Git version control

## Author

Ashish Shrivastava

## License

This project is intended for learning and interview preparation.
