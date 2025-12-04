# **⚙️ Backend \- FixIt Civic Platform**

## **Tech Stack Recommendation**

* **Runtime:** Node.js  
* **Framework:** Express.js  
* **Database:** MongoDB (via Mongoose) \- *Flexible schema is better for hackathons.*  
* **Validation:** Joi or express-validator.

## **🚀 Quick Start**

\# 1\. Initialize  
mkdir backend && cd backend  
npm init \-y

\# 2\. Install Dependencies  
npm install express mongoose cors dotenv nodemon

\# 3\. Run Dev Server  
npm run dev

## **🛠️ Development Checklist & Steps**

### **Phase 1: Server & Database**

* \[ \] **Server Setup:** Create server.js. Configure cors to allow requests from localhost:5173 (Frontend).  
* \[ \] **DB Connection:** Connect to MongoDB Atlas (easiest for remote access) or local MongoDB.

### **Phase 2: Data Models (Schema)**

*Create a /models folder.*

* \[ \] **Report.js Schema:**  
  * location: { lat: Number, lng: Number, address: String }  
  * category: String (Enum: 'Water', 'Roads', 'Power')  
  * image: String (URL or Base64)  
  * status: String (Default: 'Open')  
  * votes: Number (Default: 1\)  
  * priorityScore: Number (Calculated field)  
  * primaryOwner: String (e.g., 'Water Co.')  
  * createdAt: Date  
* \[ \] **User.js Schema (Simplified):**  
  * phone: String  
  * role: String ('Citizen', 'Admin', 'Utility\_Worker')

### **Phase 3: The "Brain" (Business Logic)**

*This is the core differentiator. Create a /utils folder.*

* \[ \] **Algo: calculatePriority.js**  
  * Implement the formula: P \= (Votes \* Severity) \+ (DaysOpen \* AgingFactor).  
  * *Note:* This function should run whenever a Vote is added or the page is refreshed.  
* \[ \] **Logic: smartRouting.js**  
  * Simple switch statement:  
  * If category \=== 'Water' \-\> primaryOwner \= 'Water Utility Co'  
  * If category \=== 'Roads' \-\> primaryOwner \= 'Dept of Public Works'

### **Phase 4: API Endpoints**

*Create a /routes folder.*

* \[ \] **POST /api/reports**  
  * Receives report data.  
  * Runs smartRouting.  
  * Calculates initial priorityScore.  
  * Saves to DB.  
* \[ \] **GET /api/reports**  
  * Accepts query params (e.g., ?status=Open, ?owner=Water Co).  
  * Returns JSON array of reports.  
* \[ \] **PATCH /api/reports/:id/upvote**  
  * Increments votes by 1\.  
  * **CRITICAL:** Re-runs calculatePriority and updates the score.  
* \[ \] **PATCH /api/reports/:id/status**  
  * Updates status (e.g., to 'Resolved').  
  * If 'Resolved', maybe generate a notification (mocked).

### **Phase 5: The Demo Saver (Seeding)**

* \[ \] **Create seed.js Script:**  
  * Don't present an empty map\!  
  * Write a script that inserts **50 dummy reports** into the database.  
  * Make sure they are clustered around your specific demo location (lat/long).  
  * Make 2-3 of them "High Priority" (Red) and "Escalated" so you have something to show on the Dashboard.

## **🔑 Environment Variables (.env)**

PORT=5000  
MONGO\_URI=mongodb+srv://\<your\_connection\_string\>  
