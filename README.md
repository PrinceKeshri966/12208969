# 🔗 URL Shortener with Analytics

A modern, client-side URL shortener built using **React** and **Material UI**, with features like:

* Custom or auto-generated shortcodes
* Click tracking with timestamp, location & browser info
* Link expiration support
* Local storage persistence

---

## 📦 Features

* ⏱️ Set link validity in minutes
* 📊 View statistics like click history & source info
* ✏️ Option to define custom shortcodes
* 🔐 Data stored safely in browser using `localStorage`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

* Node.js (v14 or higher recommended)
* npm or yarn

---

### 🛠️ Installation

```bash
git clone https://github.com/PrinceKeshri966/12208969.git
cd frontend
npm install
```

---

### 💻 Running the App

```bash
npm run dev
```

This will start the development server and open the app at:

```
http://localhost:3000
```

---

## 🧪 Usage

1. **Go to the "Shortener" tab**

   * Enter a long/original URL
   * Set optional shortcode or leave it to auto-generate
   * Set expiry time (in minutes)
   * Click **Shorten URLs**

2. **Use shortened URL**

   * Click the short link to open the original
   * Analytics (click timestamp, browser, and location) will be recorded

3. **Go to the "Statistics" tab**

   * View all shortened links
   * Expand a row to view detailed click history

---

## 📁 Project Structure

```
src/
├── App.js
├── pages/
│   └── URLShortenerApp.js
├── components/
│   ├── URLForm.js
│   ├── ShortenedUrlResults.js
│   └── StatisticsPage.js
├── hooks/
│   └── useLocalStorage.js
├── utils/
│   ├── helpers.js
│   ├── geolocation.js
│   └── logger.js
```

---

## 🧩 Technologies Used

* React
* Material UI (MUI)
* JavaScript (ES6+)
* Browser Local Storage API
* IP-based Geolocation API (optional, for analytics)

---

## 📌 Notes

* No backend is required. All data is stored client-side using `localStorage`.
* Shortened URLs work only within the current browser/device environment.
* Link expiry is checked on UI load and not enforced by a backend timer.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a PR

