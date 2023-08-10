import { database } from '@/firbase';
import React from 'react';
import { getDatabase, ref, child, get } from "firebase/database";

export default function Home() {

  const dbRef = ref(database);
  get(child(dbRef, `/`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return (
    <div></div>
  )
}