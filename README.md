# 🍔 QuickEats

![image](https://github.com/user-attachments/assets/3efd9e4c-31d5-4195-89c2-2d4d14058ec2)


<div align="center">
  <b>Modern MERN-based food ordering web application</b><br/>
  Complete with user ordering flow, admin CRM dashboard, lead management system, payment gateway integration, and real-time email notifications.
</div>

---

![GitHub repo size](https://img.shields.io/github/repo-size/Shinkhal/QuickEats)
![GitHub last commit](https://img.shields.io/github/last-commit/Shinkhal/QuickEats)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🚀 Overview

**QuickEats** is a full-featured MERN stack food ordering platform where users can browse food items, place orders with integrated payments, and receive real-time updates via email. It also includes a powerful **admin dashboard** for order management, lead tracking, CRM insights, inventory control, and email-based communication with users using an SMTP server.

---

## 🧩 Features

### 👨‍🍳 User Features
- 📝 Secure Sign Up / Sign In with JWT
- 🍕 Browse food menu with detailed item view
- 🛒 Add items to cart, modify quantity, remove
- 💳 Pay securely via integrated payment gateway
- 📬 Real-time order email notifications (via SMTP)
- 📦 View order history and live order tracking

### 🧑‍💼 Admin Features
- 📊 **CRM Dashboard** with sales/user metrics
- 🔍 **Lead Management System** for handling potential clients
- ⚙️ Manage food inventory (Add / Update / Delete)
- 🧾 Order processing system (Pending / Processed / Rejected)
- 📈 Daily and cumulative performance reports
- 📬 Send emails/updates to users using SMTP

---

## 🛠 Tech Stack

| Tech         | Description                         |
|--------------|-------------------------------------|
| **React.js** | Frontend development                |
| **Tailwind CSS** | Utility-first styling            |
| **Node.js**  | Backend runtime                     |
| **Express.js** | RESTful APIs                       |
| **MongoDB**  | NoSQL database                      |
| **Mongoose** | MongoDB ODM                         |
| **JWT**      | Authentication                      |
| **Razorpay / Stripe** | Payment gateway integration    |
| **Nodemailer** | Email notifications via SMTP server |

---

## 📸 Preview Screenshots


| User View | Admin Dashboard | Lead Management |
|----------|----------------|----------------|
| ![image](https://github.com/user-attachments/assets/bccf21c1-ee6f-4561-8c5e-0130fecda323) |![image](https://github.com/user-attachments/assets/604e2421-f03a-40d6-8a6e-b8fe6a9f382c) | ![image](https://github.com/user-attachments/assets/6776cc42-ffab-4ee3-b671-fa597f54da68) |

---

## 📦 Installation

### Clone the Repository

```bash
git clone https://github.com/Shinkhal/QuickEats.git
cd QuickEats
```

### Install Frontend & Backend Dependencies

```bash
cd frontend
npm install

cd ../backend
npm install

cd ../admin
npm install
```

### Configure Environment Variables

Create a `.env` file in `backend/` with:

```env
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
PAYMENT_GATEWAY_KEY=your_payment_key
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

### Run the App

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd ../backend
npm run dev

# Admin
cd ../admin
npm run dev
```

---

## 📁 Folder Structure

```
QuickEats/
│
├── frontend/              # React.js user-facing site
├── backend/               # Express.js + MongoDB APIs
├── admin/                 # Admin dashboard for management
└── README.md              # You're here!
```

---


## 📬 Contact

For feedback or collaboration:

- GitHub: [@Shinkhal](https://github.com/Shinkhal)
- Email: [shinkhalsinha@gmail.com](mailto:shinkhalsinha@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ by Shinkhal Sinha
