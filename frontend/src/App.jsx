import  {useState} from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Footer from './components/Footer'
import LoginPopup from './components/LoginPopup'
import Verify from './pages/Verify'
import QueryForm from './pages/Contact'
import MenuPage from './pages/Menu'
import ProfilePage from './pages/ProfilePage'
import MyOrders from './pages/MyOrders'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [showLogin,setShowLogin] = useState(false);
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} ></LoginPopup>:<></>}
    <div className='app' >
    <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar setShowLogin={setShowLogin} ></Navbar>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<PlaceOrder />} />
        <Route path='/verify' element={<Verify />} />
        <Route path="/contact" element={<QueryForm/>}/>
        <Route path="/menu" element={<MenuPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/myorders" element={<MyOrders/>}/>
      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App