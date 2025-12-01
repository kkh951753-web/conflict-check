// pages/_app.js
import "../styles/globals.css";
import "../styles/result.css";
import "../styles/test.css";   // ⭐ 여기에서 test.css를 불러온다

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
