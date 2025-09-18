
# Socai-Talk 🗨️  
A Real-Time Social Chat Application

[🌐 Live Demo](https://social-talk.vercel.app/)

Socai-Talk is a full-stack social chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with real-time capabilities powered by Socket.io. It supports features like authentication, real-time messaging, friend requests, online user tracking, and more — all wrapped inside a clean, responsive UI.

---

## 🚀 Features

### 🌐 Frontend Routing & Layout
- **Routing** maps URLs to specific pages using React Router.
- **Layout** ensures consistent UI components like navbar and sidebar stay fixed while content changes.
- Together, they provide a smooth Single Page Application (SPA) experience.

### 🔐 Authentication & Authorization
- **Email OTP Verification** for secure signup.
- **JWT Tokens** for maintaining sessions.
- **Password Reset via Email**.
- **Authorization Middleware** on the backend (`protectRoute`) to restrict access to protected routes.

### 💡 Frontend State Management with Zustand
- Centralized stores for:
  - Theme switching
  - Online users
  - Active chat messages
- Zustand makes data sharing seamless across components without prop-drilling.

### 🔁 API Communication Layer
- Uses **Axios** with `withCredentials: true` to send and receive secure HTTP requests.
- `api.js` centralizes all endpoints to keep code clean and organized.
- Acts as the communication bridge between frontend and backend.

### 🧩 Backend with Mongoose Models
- Mongoose models for:
  - `User`
  - `Message`
  - `FriendRequest`
- Each model defines schema, validation, and relationships.
- Uses `pre("save")` middleware for actions like password hashing.

### 🧠 Backend Business Logic (Controllers)
- Controllers handle:
  - Message sending
  - Friend request handling
  - User profile updates
- Apply rules and logic to ensure consistency, validation, and database integrity.

### ⚡ Real-time Communication with Socket.io
- Enables **Live Chat**, **Online Status**, and **Notifications** in real-time.
- Features include:
  - Emitting and listening to events (`emit`, `on`)
  - Real-time delivery of messages
  - Auto-updating online user list

---

## 📦 Tech Stack

| Layer        | Tech                                |
|--------------|-------------------------------------|
| Frontend     | React, Zustand, Axios, React Router |
| Backend      | Node.js, Express, Mongoose, JWT     |
| Database     | MongoDB (via Mongoose)              |
| Real-time    | Socket.io                           |
| Email        | Nodemailer for OTP and reset links  |

---

## 🛠️ Setup Instructions

1. **Clone the repo**  
```bash
git clone https://github.com/sachinkumar2222/Socai-Talk.git
```

2. **Install dependencies**  
Navigate to both `client` and `server` folders and run:
```bash
npm install
```

3. **Setup environment variables**

- In the `server` folder, create a `.env` file with the following:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

4. **Run the app**

Start both backend and frontend:
```bash
# In /server
npm run dev

# In /client
npm start
```

---

## 🧪 Key Functional Modules

| Module         | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `routes/`      | API routes for auth, messages, users                                        |
| `controllers/` | Logic for handling incoming API requests                                    |
| `models/`      | Mongoose schemas for structured database documents                          |
| `store/`       | Zustand stores managing frontend states                                     |
| `api.js`       | Axios wrapper for API calls                                                 |
| `socket.js`    | Handles socket connection, message/event dispatch                           |

---

## 🔮 Future Enhancements

- ✅ **OTP-based Authentication**
- ✅ **Email-based Password Reset**
- 🔜 **Audio & Video Calling**
- 🔜 **Group Chat Support**
- 🔜 **Video Chat Rooms**

---

## 👨‍💻 Author

**Sachin Kumar**  
📍 GitHub: [sachinkumar2222](https://github.com/sachinkumar2222)

---

## 📄 License

MIT License. Feel free to use, modify, and distribute.

---

## 💬 Contributing

Pull requests are welcome! If you have suggestions or bug fixes, feel free to open an issue or fork the repo and make a PR.
