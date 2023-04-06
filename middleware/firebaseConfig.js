const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyARsB3x-JEsGod1K-503zfplKmAKaPBujg",
  authDomain: "editor-d3fd6.firebaseapp.com",
  databaseURL: "https://editor-d3fd6-default-rtdb.firebaseio.com",
  projectId: "editor-d3fd6",
  storageBucket: "editor-d3fd6.appspot.com",
  messagingSenderId: "738304670274",
  appId: "1:738304670274:web:2dae9bbf8fe18b52d38bdb",
};

const firebaseApp = initializeApp(firebaseConfig);

module.exports = getStorage(firebaseApp);
