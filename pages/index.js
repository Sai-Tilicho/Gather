import { database } from '@/firbase';
import React from 'react';
import { getDatabase, ref, child, get } from "firebase/database";
import DisplayContactsList from '@/src/components/displayContactsList';

export default function Home() {
  return (
    <div>
      <DisplayContactsList />
    </div>
  )
}