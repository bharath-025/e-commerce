# E-Commerce Project

## Project Overview
This project is an e-commerce backend application with the following features:
- **SQLite Database Setup**
- **User Management API**
- **JWT Authentication**
- **CSV Upload and Database Storage**
- **Dynamic Product Reporting APIs**

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **SQLite** (included in the project)
- **Postman** or a similar API testing tool (optional)

### Installation Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/bharath-025/e-commerce.git
   cd e-commerce

2. Install Dependencies:
    npm install

3. Configure Environment Variables: Create a .env file in the root directory and add the following variables:
    PORT=3000  
    JWT_SECRET=<your_secret_key>

4. Run the Project:
    npm start
    The server will be live at http://localhost:3000.

API Endpoints
1. CSV File Upload
Endpoint: POST /upload-csv
Description: Upload a CSV file containing product data, which is then stored in the products table in the SQLite database.
Sample Fields:
Campaign Name
Ad Group ID
FSN ID
Product Name
Ad Spend, Views, Clicks, Direct Revenue, Indirect Revenue, Direct Units, Indirect Units

2. User Management
Endpoints:
POST /users – Create a new user.
GET /users/:id – Get user details by ID.
PUT /users/:id – Update user details.
DELETE /users/:id – Delete a user.
Requirements:
Passwords are securely hashed using bcrypt.

3. Login and JWT Authentication
Endpoint: POST /login
Description: Verifies user credentials and generates a JWT token for secure access to other endpoints.
JWT Middleware:
A valid JWT token is required for accessing all endpoints except login and user creation.

4. Product Reporting APIs
These APIs retrieve product campaign statistics dynamically based on filters.
Endpoints:
POST /products/report/campaign – Retrieves statistics filtered by Campaign Name.
POST /products/report/adGroupID – Retrieves statistics filtered by Ad Group ID.
POST /products/report/fsnID – Retrieves statistics filtered by FSN ID.
POST /products/report/productName – Retrieves statistics filtered by Product Name.
Filters: Additional filters like Campaign Name, Ad Group ID, FSN ID, or Product Name can be applied.
Response Structure: The response dynamically adapts based on the main filter used.

Testing Instructions
Use Postman or any API testing tool to send requests.
Test the endpoints in the following order:
POST /users – Create a user.
POST /login – Authenticate the user and get a JWT token.
Use the JWT token to access secured endpoints like /upload-csv or reporting APIs.


Postman Collection
All the API endpoints are documented in the Postman collection provided under the postmanCollections folder. Import the collection into Postman for easier testing.

