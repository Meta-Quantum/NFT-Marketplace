import '../styles/globals.css';

//INTERNAL IMPORT
import { NavBar, Footer } from "../components/componentsindex";
import { NFTMarketplaceProvider } from '../Context/NFTMarketplaceContext';

const MyApp = ({ Component, pageProps }) => (
<div>
    <NFTMarketplaceProvider>
    <NavBar /> {/*PRIN ASTA PUTEM ACCESA NAVBARU DIN FIECARE PAGINA */}
    <Component {...pageProps} />
    <Footer />
    </NFTMarketplaceProvider>
</div>
);

export default MyApp;