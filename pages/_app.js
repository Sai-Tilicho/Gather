import "@/styles/globals.css";
import { SparkContentContext } from "@/src/components/sparkContentContext";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <SparkContentContext>
        <Component {...pageProps} />
      </SparkContentContext>
    </div>
  );
}
