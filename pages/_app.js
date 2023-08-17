
import '@/styles/globals.css' 
import GatherContext from './gatherContext'
import Context from './gatherContext'
import { SparkContentContext } from "@/src/components/sparkContentContext";

export default function App({ Component, pageProps }) {

return (    
<Context>
     <Component {...pageProps} />
  </Context>)
}

export default function App({ Component, pageProps }) {
  return (
    <SparkContentContext>
      <Component {...pageProps} />
    </SparkContentContext>
  );
}

