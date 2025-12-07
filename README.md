# Civic Tech Platform - Backend

This is the backend API for the FixIt Civic Platform, built with Node.js, Express, and MongoDB. It handles report submissions, data persistence, image uploads via Cloudinary, and serves data to the frontend dashboard.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Local instance or Atlas URI)
- **Cloudinary Account** (for image uploads)

### Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd civic_tech_backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    - Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    - Open `.env` and fill in your details:
      ```env
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/civic_tech
      
      # Cloudinary Credentials (Get these from your Cloudinary Dashboard)
      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret
      ```

### Database Seeding

To populate your database with initial test data (reports with various statuses, locations, and images):

```bash
npm run seed
```

### Running the Server

- **Development Mode** (with auto-restart):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

The server will start on `http://localhost:5000` (or your specified PORT).

---

## 🛠️ API Endpoints

### Reports

| Method | Endpoint | Description | Body / Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/reports` | Get all reports | Query params: `status` (e.g., `?status=Open`) |
| **POST** | `/api/reports` | Create a new report | Form Data: `title`, `description`, `category`, `type`, `lat`, `lng`, `image` (file) |
| **PATCH** | `/api/reports/:id/upvote` | Upvote a report | None |
| **PATCH** | `/api/reports/:id/status` | Update report status | JSON: `{ "status": "Resolved" }` |

### Categories

- **Water**: Leaks, outages, quality issues
- **Roads**: Potholes, blockages, traffic lights
- **Power**: Outages, exposed wires
- **Waste**: Missed pickup, illegal dumping

---

## 📂 Project Structure

- `server.js`: Entry point of the application.
- `routes/`: API route definitions.
- `models/`: Mongoose data models.
- `config/`: Configuration files (Cloudinary, DB).
- `middleware/`: Custom middleware (File upload).
- `utils/`: Helper functions (Smart routing logic).
- `seed.js`: Script to seed the database.

## 🧪 Testing

Currently, there are no automated tests. You can test the API using Postman or by running the frontend application.
