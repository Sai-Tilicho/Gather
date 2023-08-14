import '@/styles/globals.css' 
import GatherContext from './gatherContext'
import Context from './gatherContext'

export default function App({ Component, pageProps }) {

return (    
<Context>
     <Component {...pageProps} />
  </Context>)
}
