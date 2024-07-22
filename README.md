# Project Title

Book Management
## Introduction

A simple book management system with complex authroization and role based authentication

## Features

- Only Admins can add remove and update books 
- One book can be borrowed by a single user at once 
- Once returned other users can also borrow it

## Technologies Used

- **Frontend:** React, Tailwind
- **Backend:** Node.js, Express, JWT
- **Database:** Mongodb
- **Languages:** Javascript and TypeScript

## Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

- Node.js (version X.X.X)
- npm or yarn
- [any other prerequisites]

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/StrikerCode08/book-management
    ```

2. Navigate into the project directory:
    ```sh
    cd book-management
    ```

3. Install dependencies for both frontend and backend:
    ```sh
    cd backend
    npm install
    cd ../frontend
    npm install
    ```
4. Create Env .env for both frontend and backend:
    Frontend .env Sample
    ```sh
    VITE_APP_URL="localnodeurl/api/v1"
    ```
     Backend .env Sample
    ```sh
    PORT=PORT
    JWT_SECRECT="YOURSECRECT"
    JWT_EXPIRY="YOUREXPIRY"
    MONGODB_URL="YOURMONGOCONNECTIONSTRING"
    ADMIN_USERNAME=DESIRED
    ADMIN_NAME=DESIRED
    ADMIN_PASSWORD=DESIRED
    ```

### Running the Application

1. Start the backend server:
    ```sh
    cd backend
    npm run seed 
    npm run dev
    ```

2. Start the frontend development server:
    ```sh
    cd ../frontend
    npm run dev
    ```

Your application should now be running on `http://localhost:3000` (or another port if specified).

## Usage

Instructions on how to use the application.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [Tool or resource used]
- [Person or organization to thank]
- [Any other acknowledgements]

