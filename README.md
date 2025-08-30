
# 📌 Backend `README.md`

# 📸 Photo Drive – Backend (API)

A secure **Node.js + Express + MongoDB** backend for the Photo Drive application.  
Handles **authentication, folders, images, and token-based sessions**.  

Deployed at: [Photo Drive Backend](https://photo-drive-backend.onrender.com)

---

## 🛠️ Tech Stack


- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) **Node.js**  
- ![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white) **Express.js**  
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) **MongoDB (Mongoose)**  
- ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) **JWT (Access & Refresh tokens)**  
- ![bcrypt](https://img.shields.io/badge/bcrypt-003366?logo=security&logoColor=white) **bcrypt (Password Hashing)**  
- ![Cookies](https://img.shields.io/badge/Cookies-FFD43B?logo=cookiecutter&logoColor=black) **Cookies (HttpOnly, Secure)**  
- ![dotenv](https://img.shields.io/badge/dotenv-ECD53F?logo=dotenv&logoColor=black) **dotenv (Environment Variables)**  
 

---

## ✨ Features

- 👤 User authentication (signup, login, refresh, logout)  
- 📂 Folder management (create, list, delete)  
- 🖼️ Image management (upload metadata, list, delete)  
- 🔄 Token refresh mechanism  
- 🔒 Middleware-based auth protection  

---

## 📂 Project Structure

````

src/
├── routes/        # Auth, Folder, Image routes
├── middleware/    # Auth middleware
├── models/        # MongoDB schemas
└── index.ts       # App entrypoint

````

---

## 🚀 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/photo-drive-backend.git
cd photo-drive-backend
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Add environment variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
ACCESS_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
FRONTEND_URL=your_frontend_url       #for cors set-up
```

### 4️⃣ Run in development

```bash
npm run dev
```

### 5️⃣ Build & run in production

```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/auth`)

* `POST /signup` → Register new user
* `POST /login` → Login & set `access_token` + `refresh_token` cookies
* `POST /refresh` → Refresh access & refresh tokens
* `POST /logout` → Clear tokens & logout

### 📂 Folders (`/api/folders`)

* `GET /` → Get all folders of logged-in user
* `POST /` → Create a new folder
* `DELETE /:id` → Delete a folder

### 🖼️ Images (`/api/images`)

* `GET /` → Get all images in a folder
* `POST /upload` → Upload image metadata (Cloudinary URL + public\_id)
* `DELETE /:id` → Delete an image

---

## 🌍 Deployment

* **Backend** → [Render](https://render.com)
* **MongoDB** → Atlas

---

## 📝 License

MIT © \[Dipanwit Bala]

