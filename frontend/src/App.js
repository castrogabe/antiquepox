import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// COMPONENTS
import Header from './components/Header';
import BottomHeader from './components/BottomHeader';
import Footer from './components/Footer';
import BottomFooter from './components/BottomFooter';
import AdminRoute from './components/AdminRoute'; // lesson 8
import ProtectedRoute from './components/ProtectedRoute'; // lesson 8

// ADMIN PAGES
import Dashboard from './pages/Dashboard'; // lesson 8
import ProductList from './pages/ProductList'; // lesson 8

// PAGES
import AboutUs from './pages/AboutUs';
import Cart from './pages/Cart'; // step 1
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import PaymentMethod from './pages/PaymentMethod'; // step 3
import PlaceOrder from './pages/PlaceOrder'; // step 4
import ProductMag from './pages/ProductMag';
import Profile from './pages/Profile';
import ShippingAddress from './pages/ShippingAddress'; // step 2
import Signin from './pages/Signin';
import Signup from './pages/Signup';

import AskedQuestions from './pages/AskedQuestions'; // lesson 8
import Design from './pages/Design'; // lesson 8
import Search from './pages/Search'; // lesson 8

function App() {
  return (
    <BrowserRouter>
      <Header />
      <BottomHeader />
      <main className='mt-0'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product/:slug' element={<ProductMag />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route path='/shipping' element={<ShippingAddress />} />
          <Route path='/payment' element={<PaymentMethod />} />

          {/* lesson 8 */}
          <Route path='/askedQuestions' element={<AskedQuestions />} />
          <Route path='/design' element={<Design />} />
          <Route path='/search' element={<Search />} />

          {/* Protected Routes */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/order/:id'
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orderhistory'
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path='/admin/dashboard'
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <AdminRoute>
                <ProductList />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <BottomFooter />
    </BrowserRouter>
  );
}

export default App;
