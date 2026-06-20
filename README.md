# Brand Name E-Commerce Platform

A high-performance, modern e-commerce application built to showcase advanced full-stack development skills. This platform is tailored for a premium sports nutrition brand, offering a seamless customer shopping experience alongside a secure, functional administrative dashboard.

## 🌟 Project Overview

This project demonstrates the ability to architect and build a scalable web application from the ground up. It integrates modern frontend frameworks with robust backend-as-a-service (BaaS) solutions to handle authentication, real-time data, and secure financial transactions. 

## 🚀 Tech Stack & Architecture

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), React, [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) for fast, lightweight global cart state.
- **Backend/Database:** Firebase Firestore (NoSQL) secured with custom Firestore Rules.
- **Authentication:** Firebase Auth (Email/Password & Google OAuth).
- **Payment Processing:** [Stripe](https://stripe.com/) Elements & Webhooks.
- **Media Management:** [ImageKit](https://imagekit.io/) for optimized image hosting and delivery.
- **Email Notifications:** [Resend](https://resend.com/) for automated order confirmations.

## ✨ Core Features

### 🛒 Customer Experience
- **Dynamic Product Catalog:** Users can filter and browse through various supplement categories (Whey Protein, Pre-Workout, etc.).
- **Rich Product Details:** Pages dynamically render critical product metadata including flavor, weight, protein per serving, and total servings.
- **Persistent Shopping Cart:** Built with Zustand to maintain cart state across sessions.
- **Secure Checkout Flow:** Integrated Stripe Elements allow users to securely pay with multiple methods without leaving the application.
- **Order Tracking System:** Customers can view their purchase history and track current order statuses directly from their dashboard.

### 🛡️ Administrative Dashboard
- **Role-Based Access Control:** The admin panel is strictly gated. Only pre-approved admin emails can access the dashboard or write to the database.
- **Product Management:** Admins can easily add new products, specify detailed nutritional data, and upload product images directly to ImageKit via a secure backend route.
- **Order Fulfillment:** Admins can view all incoming orders, track customer shipping details, and update fulfillment statuses (e.g., from *Processing* to *Shipped*).

### ⚙️ Backend & Security Highlights
- **Stripe Webhooks:** Order creation is decoupled from the client. Stripe webhooks securely notify the Next.js backend upon successful payment, which then safely writes the order to Firestore and triggers a Resend email confirmation.
- **Firestore Security Rules:** The database is locked down. Customers can only read products and view their own orders. Only verified admins can mutate product and order data.
- **Server-Side Token Verification:** Sensitive API routes (like image uploading) verify Firebase ID tokens using the Firebase Admin SDK to ensure requests are legitimately authorized.

## 💡 Technical Challenges Solved

1. **Secure Payment Fulfillment:** Moving the order creation logic from the client to a secure Stripe Webhook listener (`/api/stripe/webhook/route.ts`) eliminated the risk of client-side tampering during checkout.
2. **Optimized Asset Delivery:** By integrating ImageKit, product images are automatically optimized and served via CDN, drastically improving the Core Web Vitals and load times of the catalog.
3. **Complex State without Redux:** Zustand was utilized to handle the cart logic, proving that complex global state (like calculating totals, modifying quantities, and persisting to local storage) can be achieved cleanly without the boilerplate of Redux.

---

*Note: This repository is a personal project showcase and portfolio piece. It is not licensed for open-source distribution or commercial reuse.*
