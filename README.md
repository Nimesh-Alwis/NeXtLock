# NeXtLock 🔐

> A premium, modern **Password Manager** built with pure **HTML, CSS & JavaScript** — featuring a stunning Dark Glassmorphism UI, real-time vault management, and zero server-side dependencies.

---

## 🌟 Live Preview

```
Open: src/login/login.html
```
Or serve via: `npx serve src` → `http://localhost:3000/login/login.html`

---

## 🖼️ Screenshots

| Login Screen | Dashboard | Accounts Vault |
|---|---|---|
| Dark glassmorphic login with password strength meter | Category grid with emoji icons & vault health | Brand-colored account cards with 1-click copy |

---

## ✨ Features

### 🔑 Master Password & Security
- **Master Password Creation** with live **Password Strength Meter** (Weak → Fair → Good → Strong)
- Show / Hide password toggle on input fields
- Authenticated session management via `localStorage`
- **Reset Vault** option to wipe all saved data

### 📂 Vault Category Management
- Create, Rename & Delete password categories
- **WhatsApp-style Emoji Picker** with 35+ emojis organized into tabs:
  - 🔥 All | 💬 Social | 💼 Work | 🏦 Finance | 🎮 Media
- Smart auto-icon detection for category names
- Live **Search & Filter** categories in real time

### 🏦 Account & Password Vault
- Add accounts with **Service Name**, **Username/Email**, and **Password**
- **Official Brand Logos** auto-detected per service:
  - Instagram (gradient), Facebook (blue), Snapchat (yellow), WhatsApp (green), TikTok (black), Telegram (sky blue), X/Twitter (black), YouTube (red), Reddit (orange), Pinterest (red), LinkedIn (blue), Google, GitHub, Netflix, Spotify, PayPal, and more
- **Masked Password View** (`••••••••`) with 1-click reveal eye toggle
- **1-Click Copy Username** and **1-Click Copy Password** with toast notification
- Delete accounts with confirmation

### ⚡ Password Generator
- Generate strong random passwords with configurable:
  - **Length slider** (8–32 characters)
  - **Symbols** (`!@#$%^&*`)
  - **Numbers** (`0–9`)
- Live **Password Strength Indicator** on generated passwords

### 💾 Backup & Restore
- **Export Vault** as JSON backup file (`NeXtLock_Backup_YYYY-MM-DD.json`)
- **Import Vault** from JSON backup file with full data restore
- Cross-session persistent storage via `localStorage`

---

## 🗂️ Project Structure

```
NeXtLock/
├── index.html                       # Root redirect to login
├── src/
│   ├── index.html                   # src-level redirect
│   ├── login/
│   │   ├── login.html               # Master Password screen
│   │   ├── login.css                # Login styles (dark glassmorphism)
│   │   └── login.js                 # Auth logic & strength meter
│   ├── ui/
│   │   ├── index.html               # Main Dashboard (category grid)
│   │   ├── styles.css               # Dashboard styles + emoji picker
│   │   ├── app.js                   # Category management & emoji picker logic
│   │   └── accounts/
│   │       ├── accounts.html        # Accounts Vault page
│   │       ├── accounts.css         # Accounts styles + brand badge colors
│   │       └── accounts.js          # Account CRUD, generator, backup
│   ├── accounts/
│   │   └── accountManager.js        # (Legacy) Account logic module
│   ├── categories/
│   │   └── categoryManager.js       # (Legacy) Category logic module
│   ├── security/
│   │   └── encryption.js            # (Legacy) Encryption utilities
│   └── storage/
│       ├── fileManager.js           # (Legacy) File I/O utilities
│       └── markdownManager.js       # (Legacy) Markdown storage
├── data/                            # Data directory
├── docs/                            # Documentation
└── package.json
```

---

## 🚀 Getting Started

### Option 1 — npx serve (Recommended)
```bash
npx serve src
```
Then open `http://localhost:3000/login/login.html`

### Option 2 — Python
```bash
cd src
python -m http.server
```
Then open `http://localhost:8000/login/login.html`

### Option 3 — VS Code Live Server
1. Install **Live Server** extension by Ritwick Dey
2. Open `src/login/login.html`
3. Right-click → **Open with Live Server**

---

## 🎨 Design System

| Element | Value |
|---|---|
| **Theme** | Dark Glassmorphism |
| **Background** | `#090d16` with animated gradient orbs |
| **Window Frame** | macOS-style with red/yellow/green controls |
| **Primary Blue** | `#3b82f6` |
| **Accent Purple** | `#8b5cf6` |
| **Success Green** | `#10b981` |
| **Danger Red** | `#ef4444` |
| **Typography** | Inter + Outfit (Google Fonts) |
| **Blur Effect** | `backdrop-filter: blur(28px)` |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Structure & semantic markup |
| **CSS3** | Dark glassmorphism, animations, brand badges |
| **Vanilla JavaScript** | UI logic, CRUD, clipboard, generator |
| **localStorage** | Zero-backend persistent storage |
| **Google Fonts** | Inter & Outfit typography |
| **SVG Icons** | Brand logos & UI icons |

---

## 🔒 Security Note

> NeXtLock is a **client-side only** password manager. All data is stored in your browser's `localStorage`. It is intended for **personal/educational use** and does not use real encryption for stored passwords. For production use, consider integrating AES-256 encryption via the Web Crypto API.

---

## 📦 Default Pre-loaded Accounts

On first launch, NeXtLock auto-populates example accounts:

**Social Media:** Instagram • Facebook • Snapchat • WhatsApp • TikTok • Telegram • X (Twitter) • YouTube • Reddit • Pinterest • LinkedIn • Gmail  
**Work & Professional:** GitHub • Slack • Microsoft 365  
**Streaming & Entertainment:** Netflix • Spotify • YouTube Premium  
**Banking & Finance:** PayPal • Commercial Bank

---

## 👤 Author

**Nimesh Alwis**  
📁 [GitHub Profile](https://github.com/Nimesh-Alwis) 

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
