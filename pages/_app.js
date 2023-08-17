
import { SparkContentContext } from "@/src/components/sparkContentContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <SparkContentContext>
      <Component {...pageProps} />
    </SparkContentContext>

import React from "react";
import { UserProvider } from "./dashboardContext";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>

  );
}

export default MyApp;
