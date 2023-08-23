import "@/styles/globals.css";
import { SparkContentContext } from "@/src/components/context/sparkContentContext";
import { store } from '@/src/components/store'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <SparkContentContext>
        <Component {...pageProps} />
      </SparkContentContext>
    </Provider>
  );
}