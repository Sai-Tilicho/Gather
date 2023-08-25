import "@/styles/globals.css";
import { SparkContentContext } from "@/src/components/context/sparkContentContext";

export default function App({ Component, pageProps }) {
  return (
    <SparkContentContext>
      <Component {...pageProps} />
    </SparkContentContext>
  );
}
