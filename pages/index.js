import CreateContacts from '@/pages/createContacts';
import React from 'react';
import { getDatabase, ref, child, get } from "firebase/database";
import CreateGroup from './createGroup';
export default function Home() {
  return (
    <div>
      <CreateGroup/>
      <CreateContacts/>
    </div>
  )
}