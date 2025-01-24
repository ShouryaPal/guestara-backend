# Intern Assignment

This project is built using Node.js and requires MongoDB as a database.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- npm/pnpm

## Installation

1. Clone the repository
```bash
git clone https://github.com/shouryapal/intern-assignment.git
```

2. Navigate to the project directory
```bash
cd guestara-backend
```

3. Install dependencies
```bash
npm install
```

4. Create a `.env` file in the root directory
```bash
touch .env
```

5. Add your MongoDB connection URL in the `.env` file
```env
DATABASE_URL=your_mongodb_connection_string_here
```

## Running the Application

To start the server:

```bash
npm start
```

For development with nodemon:
```bash
npm run dev
