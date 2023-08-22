import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADUOk-Z3iOYLQG1wkujfDD8FtxWBDfZ7A",
  authDomain: "gather-f0ca8.firebaseapp.com",
  databaseURL: "https://gather-f0ca8-default-rtdb.firebaseio.com",
  projectId: "gather-f0ca8",
  storageBucket: "gather-f0ca8.appspot.com",
  messagingSenderId: "355309946566",
  appId: "1:355309946566:web:29a40e978651aae209b9c7",
  measurementId: "G-49K2HZH2VL",
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export const setDataToDb = (path, data, onSuccess, onError) => {
  set(ref(database, path), data)
    .then(() => {
      if (onSuccess !== undefined) {
        onSuccess();
      }
    })
    .catch((error) => {
      if (onError !== undefined) {
        onError(error);
      }
    });
};

export const getDataFromDb = (path, onSuccess, onError) => {
  get(ref(database, path))
    .then((data) => {
      if (onSuccess !== undefined) {
        onSuccess(data.val());
      }
    })
    .catch((error) => {
      if (onError !== undefined) {
        onError(error);
      }
    });
};
