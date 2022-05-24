import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { MoralisProvider } from "react-moralis";

const API_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

function App({ Component, pageProps }) {
  return (
    <MoralisProvider appId={API_ID} serverUrl={SERVER_URL}>
      <div className="bg-gradient-to-tr from-lime-200 to-sky-600">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </MoralisProvider>
  );
}

export default App;
