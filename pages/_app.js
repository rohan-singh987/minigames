import '../styles/globals.css'
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
