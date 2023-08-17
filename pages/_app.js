import { SparkContentContext } from "@/src/components/sparkContentContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <SparkContentContext>
      <Component {...pageProps} />
    </SparkContentContext>
  );
}