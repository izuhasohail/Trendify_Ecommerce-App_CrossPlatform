// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/homePage/Home'
import Checkout from './pages/checkoutPage/Checkout'
import ProductPage from './pages/productPage/ProductPage';
import SuccessPage from './pages/success/SuccessPage';
import CancelPage from './pages/cancel/CancelPage';
import Cart from './pages/cart/Cart';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from './cartService';
import { setUserState, deleteUserState } from './slices/UserSlice';
import Login from './pages/Login/Login'
import ProductDetail from './pages/ProductDetails/ProductDetail'
import Account from './pages/Account/Account'
import { setPageState } from './slices/PageSlice';
import { deleteProductState, setProductState } from './slices/ProductSlice';
import Error from './pages/Error/Error';
function App() {

  const dispatch = useDispatch();
  const handleBeforeUnload = () => {
    dispatch(deleteUserState());
    dispatch(setPageState('/'));
    dispatch(deleteProductState())
  };
  window.addEventListener('unload', handleBeforeUnload);




  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/Checkout' element={<Checkout />} />
        <Route exact path='/Products/:category' element={<ProductPage />} />
        <Route exact path='/Cart' element={<Cart />} />
        <Route exact path='/success' element={<SuccessPage />} />
        <Route exact path='/cancel' element={<CancelPage />} />
        <Route exact path="/Login" element={<Login />} />
        <Route exact path='/ProductDetails' element={<ProductDetail />} />
        <Route exact path='/Account' element={<Account />} />
        <Route exact path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;