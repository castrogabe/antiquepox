import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// COMPONENTS
import Header from './components/Header';
import BottomHeader from './components/BottomHeader';
import Footer from './components/Footer';
import BottomFooter from './components/BottomFooter';

// PAGES
import AboutUs from './pages/AboutUs';
import Cart from './pages/Cart';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import PaymentMethod from './pages/PaymentMethod';
import ProductMag from './pages/ProductMag';
import ShippingAddress from './pages/ShippingAddress';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <BottomHeader />
      <ToastContainer />
      <main className='mt-0'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product/:slug' element={<ProductMag />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/shipping' element={<ShippingAddress />} />
          <Route path='/payment' element={<PaymentMethod />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </main>
      <Footer />
      <BottomFooter />
    </BrowserRouter>
  );
}

export default App;
