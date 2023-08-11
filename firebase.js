import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";
import { get, getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyADUOk-Z3iOYLQG1wkujfDD8FtxWBDfZ7A",
    authDomain: "gather-f0ca8.firebaseapp.com",
    databaseURL: "https://gather-f0ca8-default-rtdb.firebaseio.com",
    projectId: "gather-f0ca8",
    storageBucket: "gather-f0ca8.appspot.com",
    messagingSenderId: "355309946566",
    appId: "1:355309946566:web:29a40e978651aae209b9c7",
    measurementId: "G-49K2HZH2VL"
};

export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const database = getDatabase(app);
export const setDataToDb = (path, data, onSuccess, onError) => {
    set(ref(database, path), data).then(() => {
        if(onSuccess !== undefined) {
            onSuccess()
        }
    }).catch((error) => {
        if(onError !== undefined) {
            onError(error)
        }
    });
}