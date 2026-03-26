import "./App.css"
// AGGIUNTO: Navigate agli import di react-router-dom
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import NotFound from "./components/NotFound"
import AppNavbar from "./components/AppNavbar"
import Login from "./components/Login"
import Register from "./components/Register"
import AdminDashboard from "./components/AdminDashboard"
import Home from "./components/Home"
import ProductDetail from "./components/ProductDetail"
import Cart from "./components/Cart"
import Orders from "./components/Orders"
import Footer from "./components/Footer"
// Nota: AdminOrders non serve più perché lo abbiamo integrato nella Dashboard

function App() {
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotta Admin Protetta (Dashboard che ora include anche gli ordini) */}
            <Route
              path="/admin/dashboard"
              element={
                token && userRole === "ADMIN" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* Se avevi link che puntavano a /admin/orders-report, li mandiamo alla dashboard */}
            <Route
              path="/admin/orders-report"
              element={<Navigate to="/admin/dashboard" />}
            />

            <Route
              path="/category/:categoryName"
              element={<div>Pagina Categoria</div>}
            />

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
