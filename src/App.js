import './App.css';
import Navbar from './Pages/user/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Category from './Pages/user/shop/Category';
import Product from './Pages/user/shop/Product';
import CartShop from './Pages/user/shop/CartShop';
import LoginPage from './Pages/user/LoginPage';
import Shop from './Pages/user/shop/Shop';
import MailRecommend from './Pages/user/Home/MailRecommend';
import Footer from './Pages/user/Home/Footer';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/post' element={<Category category="post"/>}/>
        <Route path='/coffee' element={<Category category="coffee"/>}/>
        <Route path='/fruit' element={<Category category="fruit"/>}/>
        <Route path='/fns' element={<Category category="fns"/>}/>
        <Route path="/product" element={<Product/>}>
          <Route path='productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<CartShop/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>
      <MailRecommend/>
      <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
