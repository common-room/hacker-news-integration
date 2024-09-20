const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  databaseURL: "https://hacker-news.firebaseio.com",
};

function initializeFirebaseApp() {
  return initializeApp(firebaseConfig);
}

module.exports = { initializeFirebaseApp };
