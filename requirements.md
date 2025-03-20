# Requirements for my-next-app

This project uses the following libraries:

## Frontend Dependencies
- framer-motion: ^12.5.0
- my-next-app: file:
- next: 15.2.2
- react: ^19.0.0
- react-dom: ^19.0.0
- react-icons: ^5.5.0
- axios: ^1.3.1
- react-query: ^3.34.16
- zustand: ^3.7.6
- check
## Frontend Dev Dependencies
- @eslint/eslintrc: ^3
- @tailwindcss/postcss: ^4
- autoprefixer: ^10.4.21
- eslint: ^9
- eslint-config-next: 15.2.2
- postcss: ^8.5.3
- tailwindcss: ^4.0.14
- prettier: ^2.8.4

## Backend Dependencies
- express: ^4.18.2
- mongoose: ^7.0.3
- dotenv: ^16.0.3
- cors: ^2.8.5
- body-parser: ^1.20.1
- mysql2: ^3.1.0
- sequelize: ^7.1.0

## Backend Dev Dependencies
- nodemon: ^2.0.22
- eslint: ^9.0.0

## Installation
To install the required libraries, run the following commands for frontend:
```bash
npm install next react react-dom axios framer-motion react-query zustand
npm install --save-dev @eslint/eslintrc @tailwindcss/postcss autoprefixer eslint eslint-config-next postcss tailwindcss prettier
```

If you encounter issues, you can use the following command to clean the npm cache and install the dependencies afresh:
```bash
npm ci
```

For backend, run the following command:
```bash
npm install express mongoose dotenv cors body-parser mysql2 sequelize
npm install --save-dev nodemon eslint
```

To run the backend server with automatic reload using `nodemon`, add the following script to your `package.json`:
```json
"scripts": {
  "dev": "nodemon index.js"
}
```

Then, you can start the server with:
```bash
npm run dev
```

To run your FastAPI server with `uvicorn`, add the following script to your `package.json`:
```json
"scripts": {
  "dev:api": "uvicorn main:app --reload --host 127.0.0.1 --port 8000 --log-level info"
}
```

Then, you can start the FastAPI server with:
```bash
npm run dev:api
```
