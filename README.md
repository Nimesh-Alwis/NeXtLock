# 🔐 NeXtLock - Premium Multi-Profile Password Vault

<div align="center">

![NeXtLock Security Banner](https://img.shields.io/badge/Security-Master%20Class-00f2fe?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-31.0.0-4785D4?style=for-the-badge&logo=electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, hyper-secure, offline desktop Password Manager & Credential Vault built with Electron, HTML5, CSS3, and Vanilla JavaScript.**

</div>

---

## 📸 Application Screenshots & UI Showcase

<div align="center">

### 🔐 Profile Selection & Authentication
![Profile Selection & Login](<gitpush images/Screenshot 2026-08-02 231545.png>)

### 📂 Vault Categories Dashboard
![Vault Categories Dashboard](<gitpush images/Screenshot 2026-08-02 231701.png>)

### 🔑 Accounts & Credential Management
![Accounts & Credential Management](<gitpush images/Screenshot 2026-08-02 231918.png>)

### ➕ Add New Account Credential
![Add New Account Modal](<gitpush images/Screenshot 2026-08-02 232049.png>)

### 🕵️ Master Password Verification
![Master Password Verification Modal](<gitpush images/Screenshot 2026-08-02 232253.png>)

### 🏷️ Category Management & Emoji Selector
![Add & Edit Category Modal](<gitpush images/Screenshot 2026-08-02 232446.png>)

</div>

---

## 🌟 Key Features

### 👤 Multi-User Profile System
- **Profile Partitioning**: Create and manage isolated user profiles (e.g., Personal, Work, Family). Each profile maintains its own encrypted vault data.
- **Custom Avatars & Photo Uploads**: Personalize profiles with custom emoji avatars or upload custom profile pictures (up to 2MB).
- **Profile Locking & Deletion**: Quick-lock active profiles or completely delete profiles with complete vault data purging.

### 🕵️ Double-Locked Hidden Vault
- **Extra Security Layer**: Built-in secret category (`🕵️ Hidden Vault`) requiring **Master Password re-verification** before viewing sensitive credentials.
- **Visual Indicators**: Highlighted with red glassmorphic glow and double-lock badges.

### 📁 Category & Credential Management
- **Custom Categories**: Create, rename, search, and delete custom categories.
- **Emoji Icon Selector**: Assign custom emoji icons to categories with organized category tabs (Popular, Work, Finance, Social, Entertainment, Gaming, Crypto).
- **Brand Auto-Icons**: Automatic visual icon assignment for top services (Instagram, GitHub, Netflix, PayPal, Commercial Bank, etc.).
- **Live Search**: Instant real-time filtering across categories and saved account credentials.

### 📤 Multi-Format Import & Export
- **Password-Protected Export**: Securely export full vault credentials in **`.md` (Markdown)**, **`.csv` (Spreadsheet)**, or **`.txt` (Text Document)** format after Master Password verification.
- **Universal Multi-Format Import**: Import credentials directly from `.md`, `.csv`, or `.txt` files into active profiles seamlessly.

### 🔒 Cross-Drive & Custom Directory Installation
- **Any Drive & Location**: Installable on **C:, D:, E: drives** or external portable storage devices via custom setup location selection.
- **Safe Data Storage**: Dynamically handles local storage and `userData` pathing to prevent Windows UAC / write permission issues in `Program Files`.
- **Portable & Desktop Installer**: Build standalone portable executables or full Windows Setup wizards.

---

## 💻 Tech Stack & Architecture

- **Core Framework**: [Electron v31](https://www.electronjs.org/)
- **Frontend Logic**: HTML5, Vanilla JavaScript (ES6+ Modules & File API)
- **Styling**: Custom CSS3 (Dark Glassmorphism, CSS Grid/Flexbox, Dynamic Glow Effects)
- **Data Persistence**: Isolated LocalStorage per profile & Electron `userData` API
- **Installer Engines**: Inno Setup Compiler 6/7 & Electron-Builder (NSIS)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Nimesh-Alwis/NeXtLock.git
cd NeXtLock
npm install
```

### 2. Run in Development Mode
Launch the application locally with Electron:
```bash
npm start
```

---

## 📦 Building Installer & Executables

### Option A: Build Portable Executable (Unpacked Directory)
Generates standalone portable files inside `dist/win-unpacked/`:
```bash
npm run pack
```

### Option B: Build Custom Installer via Inno Setup (Recommended)
1. Run `npm run pack` to generate the unpacked executable directory.
2. Open **Inno Setup Compiler**.
3. Open [`installer.iss`](file:///f:/MY_projects/NeXtLocK/installer.iss) (or `Nextloxk installer.iss`).
4. Click **Build ➡️ Compile** (or press `Ctrl + F9`).
5. Your custom setup executable `dist/NeXtLock-Setup-v1.2.1.exe` will be ready!

### Option C: Build via Electron-Builder (NSIS)
```bash
npm run dist
```

---

## 📁 Project Structure

```
NeXtLock/
├── main.js                     # Electron main process entry point
├── index.html                  # Main application loader / redirect
├── package.json                # Project dependencies & build configurations
├── installer.iss               # Inno Setup installer script
├── dist/                       # Output directory for builds & installers
├── data/                       # Local offline storage folder
└── src/
    ├── login/                  # Profile login, creation, & authentication
    │   ├── login.html
    │   ├── login.css
    │   └── login.js
    ├── ui/                     # Main Vault dashboard & account views
    │   ├── index.html
    │   ├── styles.css
    │   ├── app.js
    │   └── accounts/
    │       ├── accounts.html
    │       └── accounts.js
    └── storage/                # File management & markdown parsing
        ├── fileManager.js
        └── markdownManager.js
```

---

## 🔒 Security Principles

1. **Client-Side Storage**: All credentials and profile data remain strictly offline on the user's local machine. No remote cloud servers or third-party tracking.
2. **Master Password Protection**: Sensitive vault operations (exporting credentials, unlocking the hidden vault) demand Master Password verification.
3. **Data Isolation**: Each profile operates in an isolated storage namespace.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

Developed with ❤️ by **Nimesh Alwis**.
