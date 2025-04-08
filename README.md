
# 🍔 QuickEats

![QuickEats Banner](https://your-screenshot-url.com/banner.png)

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
| ![User](https://your-screenshot-url.com/user.png) | ![Admin](https://your-screenshot-url.com/admin.png) | ![Lead](https://your-screenshot-url.com/lead.png) |

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

Create a `.env` file in `server/` with:

```env
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
PAYMENT_GATEWAY_KEY=your_payment_key
```

### Run the App

```bash
# Frontend
cd client
npm run dev

# Backend
cd ../server
npm run start
```

---

## 📁 Folder Structure

```
QuickEats/
│
├── client/               # Frontend React app
├── server/               # Backend API with Express
├── models/               # MongoDB schemas
├── routes/               # API endpoints
├── controllers/          # Business logic
└── README.md             # You're here!
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
- Email: [your-email@example.com]

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ by Shinkhal Sinha
