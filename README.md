
# 🍔 QuickEats

![image](https://github.com/user-attachments/assets/824a332f-e9dc-481a-9d63-d0c93579d336)


<div align="center">
  <b>Modern MERN-based food ordering web application</b><br/>
  Complete with user ordering flow, admin CRM dashboard, lead management system, and payment gateway integration.
</div>

---

![GitHub repo size](https://img.shields.io/github/repo-size/Shinkhal/QuickEats)
![GitHub last commit](https://img.shields.io/github/last-commit/Shinkhal/QuickEats)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🚀 Overview

**QuickEats** is a comprehensive MERN stack food ordering platform that allows users to explore food items, add them to the cart, and place orders using an integrated payment system. It also features a robust **admin panel** with order processing, lead tracking, CRM analytics, and full CRUD operations for managing food items and customer interactions.

---

## 🧩 Features

### 👨‍🍳 User Features
- 📝 Secure Sign Up / Sign In with JWT
- 🍕 Browse food menu with detailed item view
- 🛒 Add items to cart, modify quantity, remove
- 💳 Order with integrated payment gateway
- 📦 View order history and live order tracking

### 🧑‍💼 Admin Features
- 📊 **CRM Dashboard** with sales metrics, user data
- 🔍 **Lead Management System** for handling potential clients
- ⚙️ Manage menu (add/update/delete food items)
- 🧾 Full order lifecycle management (approve/reject/process)
- 📈 Track daily and cumulative order performance

---

## 🛠 Tech Stack

| Tech         | Description                  |
|--------------|------------------------------|
| **React.js** | Frontend development         |
| **Tailwind CSS** | Utility-first styling       |
| **Node.js**  | Backend runtime              |
| **Express.js** | RESTful APIs                |
| **MongoDB**  | NoSQL database               |
| **Mongoose** | MongoDB ODM                  |
| **JWT**      | Authentication               |
| **Razorpay / Stripe** | Payment integration     |

---

## 📸 Preview Screenshots

> ⚠️ Add actual image links from your hosted screenshots or local images

| User View | Admin Dashboard | Lead Management |
|----------|----------------|----------------|
| ![image](https://github.com/user-attachments/assets/e437599b-94c2-446b-ae5b-e1edd3eb6011)| ![image](https://github.com/user-attachments/assets/bb75a683-b14a-43ca-ae6f-99921197db83)| ![image](https://github.com/user-attachments/assets/6776cc42-ffab-4ee3-b671-fa597f54da68)|

---

## 📦 Installation

### Clone the Repository

```bash
git clone https://github.com/Shinkhal/QuickEats.git
cd QuickEats
```

### Install Frontend & Backend Dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file in `backend/` with:

```env
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
PAYMENT_GATEWAY_KEY=your_payment_key
```

### Run the App

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev

# Admin
cd admin
nppm run dev
```

---

## 📁 Folder Structure

```
QuickEats/
│
├── frontend/              # Frontend React app
├── backend/               # Backend API with Express
├── admin/                 # Business logic
└── README.md              # You're here!
```

---

## ✅ To-Do (Suggestions)

- [ ] Add email notifications for order confirmation
- [ ] Add delivery tracking status
- [ ] Mobile app version (React Native / Flutter)

---

## 📬 Contact

For feedback or collaboration:

- GitHub: [@Shinkhal](https://github.com/Shinkhal)
- Email: [shinkhalsinha@gmail.com]

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ by Shinkhal Sinha
