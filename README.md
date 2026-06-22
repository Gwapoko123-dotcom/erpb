# NEXUS ERP — Setup Guide
## Tech Company Enterprise Resource Platform

---

## 📁 Files Included

```
nexus-erp/
├── index.html         ← Full frontend app (HTML + JS)
├── firebase-config.js ← Firebase config reference + C# backend code
└── README.md          ← This file
```

---

## 🚀 Quick Start

### Step 1 — Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **Add Project** → name it (e.g. "nexus-erp")
3. Enable **Google Analytics** (optional)

### Step 2 — Enable Firebase Services
In your Firebase console, enable:
- **Authentication** → Sign-in method → Email/Password → Enable
- **Firestore Database** → Create database → Start in **production mode**

### Step 3 — Get Your Config
Go to **Project Settings** (gear icon) → **Your Apps** → Add Web App → copy the config object.

### Step 4 — Paste Config into index.html
Find this section in `index.html` (near the bottom):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
};
```

Replace with your actual values.

### Step 5 — Set Firestore Security Rules
Go to **Firestore → Rules** and paste the rules from `firebase-config.js` (the block inside the comment).

### Step 6 — Create Your First Superadmin User

**Option A — Firebase Console (recommended for first user):**
1. Go to Authentication → Users → Add User → enter email + password
2. Copy the UID shown
3. Go to Firestore → Create collection: `users`
4. Document ID = the UID you copied
5. Add these fields:
   ```
   displayName  : "Your Name"       (string)
   email        : "you@company.com" (string)
   role         : "superadmin"      (string)
   createdAt    : [server timestamp]
   ```

**Option B — Use the app:**
After your first superadmin logs in, use **Admin Panel → Create User** to add more users.

### Step 7 — Open the App
Just open `index.html` in your browser (or deploy to Firebase Hosting, Netlify, Vercel, etc.)

---

## 🔐 Role Permissions

| Feature            | Worker | Admin | Super Admin |
|--------------------|:------:|:-----:|:-----------:|
| View Inventory     | ✅     | ✅    | ✅          |
| Add/Edit Stocks    | ❌     | ✅    | ✅          |
| Create Quotations  | ✅     | ✅    | ✅          |
| View Transactions  | ✅     | ✅    | ✅          |
| View Analytics     | ✅     | ✅    | ✅          |
| Worker Management  | ❌     | ✅    | ✅          |
| Payroll Generate   | ❌     | ✅    | ✅          |
| Payroll Release    | ❌     | ✅    | ✅          |
| Admin Panel        | ❌     | ❌    | ✅          |
| Create Users       | ❌     | ❌    | ✅          |

---

## 🏗 C# Backend (Optional — for Payroll API)

The `firebase-config.js` file contains a complete **ASP.NET Core Web API** controller for payroll computation using:
- Philippine SSS contribution table
- Pag-IBIG deduction (max ₱100/month)
- PhilHealth (2.5% employee share)
- TRAIN Law withholding tax brackets

To use it:
1. Create a new ASP.NET Core Web API project
2. Install `Google.Cloud.Firestore` NuGet package
3. Copy the controller code into your project
4. Set `GOOGLE_APPLICATION_CREDENTIALS` env var to your Firebase service account JSON

The frontend is built to call this API at `/api/payroll/compute` — update the endpoint URL in the JS as needed. Without the C# backend, payroll computation runs fully in JavaScript (same formulas are implemented in both).

---

## 📊 Firestore Collections

| Collection     | Purpose                          |
|----------------|----------------------------------|
| `users`        | All user profiles + roles        |
| `stocks`       | Inventory items                  |
| `transactions` | Sales & quotation records        |
| `payroll`      | Payroll records per employee     |
| `quotations`   | (alias — stored in transactions) |

---

## 🌐 Deployment (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# set public dir to the folder containing index.html
firebase deploy
```

---

## 🎨 Customization

- **Company name**: Change `COMPANY_NAME` constant in `index.html`
- **VAT rate**: Change `0.12` in the quotation section
- **Logo**: Replace the hexagon "N" with an `<img>` tag
- **Categories**: Edit the `<select id="s-cat">` options

---

## 💬 Support

This app uses:
- **Firebase v9 compat SDK** (CDN)
- **Chart.js v4** (CDN)
- **Google Fonts**: Exo 2, Rajdhani, Share Tech Mono
- **C# ASP.NET Core** (optional backend)

No other dependencies required.
