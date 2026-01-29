import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDvtlpnynC-wgtHuaLRrZ4aDaWqB1Dkm5E",
  authDomain: "pro-org-7d220.firebaseapp.com",
  databaseURL: "https://pro-org-7d220-default-rtdb.firebaseio.com",
  projectId: "pro-org-7d220",
  storageBucket: "pro-org-7d220.appspot.com",
  messagingSenderId: "774457096727",
  appId: "1:774457096727:web:dec2a9bc7a02b638083a52"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
