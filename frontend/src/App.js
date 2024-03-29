import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// components
import Header from './components/Header';
import BottomHeader from './components/BottomHeader';
import Footer from './components/Footer';
import BottomFooter from './components/BottomFooter';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

// admin pages
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';
import OrderList from './pages/OrderList';
import UserList from './pages/UserList';
import UserEdit from './pages/UserEdit';

// pages
import AboutUs from './pages/AboutUs';
import AskedQuestions from './pages/AskedQuestions';
import Cart from './pages/Cart';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import PaymentMethod from './pages/PaymentMethod';
import PlaceOrder from './pages/PlaceOrder';
import ProductMag from './pages/ProductMag';
import Profile from './pages/Profile';
import ShippingAddress from './pages/ShippingAddress';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Design from './pages/Design';
import Search from './pages/Search';

import ForgetPassword from './pages/ForgetPassword'; // lesson 10
import ResetPassword from './pages/ResetPassword'; // lesson 10

function App() {
  return (
    <BrowserRouter>
      <Header />
      <BottomHeader />
      <main className='mt-0'>
        <Routes>
          <Route path='/about' element={<AboutUs />} />
          <Route path='/askedQuestions' element={<AskedQuestions />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/design' element={<Design />} />
          <Route path='/' element={<Home />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/payment' element={<PaymentMethod />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route path='/product/:slug' element={<ProductMag />} />
          <Route path='/search' element={<Search />} />
          <Route path='/shipping' element={<ShippingAddress />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />

          {/* Lesson 10 */}
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />

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
          <Route
            path='/admin/orders'
            element={
              <AdminRoute>
                <OrderList />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/users'
            element={
              <AdminRoute>
                <UserList />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/product/:id'
            element={
              <AdminRoute>
                <ProductEdit />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/user/:id'
            element={
              <AdminRoute>
                <UserEdit />
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
