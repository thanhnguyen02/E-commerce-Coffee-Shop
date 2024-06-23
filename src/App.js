import './App.css';
import Navbar from './Pages/user/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Category from './Pages/user/shop/Category';
import LoginPage from './Pages/user/LoginPage';
import Shop from './Pages/user/shop/Shop';
import MailRecommend from './Pages/user/Home/MailRecommend';
import Footer from './Pages/user/Home/Footer';
import banner from './Pages/img/banner.jpg'
import banner1 from './Pages/img/banner2.jpg'
import banner2 from './Pages/img/banner4.png'
import banner3 from './Pages/img/banner5.png'
import banner4 from './Pages/img/banner5.jpg'
import Product from './Pages/user/shop/InforItem/Product';
import CartShop from './Pages/user/shop/ProductPage/Cart/CartShop';
import Post from './Pages/user/Post/Post';
import SearchResultPage from './Pages/user/shop/Search/SearchResultPage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path="/search/:searchTerm" element ={<SearchResultPage/>} />
        <Route path='/coffee' element={<Category banner={banner1} category="coffee"/>}/>
        <Route path='/fruit' element={<Category banner={banner2} category="fruit"/>}/>
        <Route path='/fns' element={<Category banner={banner3} category="fns"/>}/>
        <Route path='/other' element={<Category banner={banner4} category="other"/>}/>
        {/* <Route path='/post' element={<Post/>}/>
        <Route path='/coffee' element={<Coffee/>}/>
        <Route path='/fruit' element={<Fruit/>}/>
        <Route path='/fns' element={<FandS/>}/> */}
        <Route path='/post' element={<Post/>}/>
        <Route path="/product" element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
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
