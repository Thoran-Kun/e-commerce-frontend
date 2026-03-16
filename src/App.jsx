import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NotFound from "./components/NotFound"
import AppNavbar from "./components/AppNavbar"
import Login from "./components/Login"
import Register from "./components/Register"
import AdminDashboard from "./components/AdminDashboard"
import Home from "./components/Home"
import ProductDetail from "./components/ProductDetail"
import Cart from "./components/Cart"
import Orders from "./components/Orders"

function App() {
  return (
    <>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotta per le categorie (usando i parametri) */}
          <Route
            path="/category/:categoryName"
            element={<div>Pagina Categoria</div>}
          />

          {/* Rotta Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
