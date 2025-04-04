# MCP Server Testing Web App

This web application allows users to input an MCP server configuration in JSON format, verify its connectivity and functionality, and display results. The app runs on a **Node.js backend** and a **React Frontend**, and is deployed on **Vercel**.

---

## 🚀 Features
- Accepts MCP server configuration as JSON input.
- Tests server connectivity by running the mcp server on backend.
- Displays results in a user-friendly interface.
- Backend implemented using **Node.js (Express)**.

---

## 🛠️ Setup Instructions

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/KartikeyM18/mcp-server-tester.git
cd mcp-server-tester
```

### 2️⃣ **Install Dependencies**
```sh
cd backend
npm install
```
```sh
cd frontend
npm install
```

### 3️⃣ **Run the Backend Server**
```sh
cd backend
node src/index.js
```

By default, the backend runs on `http://localhost:3000`.

### 4️⃣ **Create .env in the Frontend **
Just create `.env` in the frontend folder and add this -
```
VITE_API_URL=http://localhost:3000/check-mcp
```

### 5️⃣ **Run the Frontend **
```sh
npm run dev  
```


---

## 🏗️ Approach

1. **Frontend**:
   - Accepts JSON input from the user.
   - Sends MCP server config to the backend via an API request.
   - Displays server status by running the mcp server in backend.

2. **Backend**:
   - Receives JSON input from the frontend.
   - Executes the MCP server test command using `spawn(command, args)`.
   - Connects to the MCP server via WebSockets to fetch available tools.
   - Returns results to the frontend.


---

## 📌 Example JSON Input
```json
{
  "mcpServers": {
    "server-sequential-thinking": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@smithery/cli@latest",
        "run",
        "@smithery-ai/server-sequential-thinking",
        "--key",
        "your-api-key"
      ]
    }
  }
}
```

