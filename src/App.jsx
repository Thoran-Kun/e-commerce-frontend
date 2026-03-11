import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NotFound from "./components/NotFound"
import AppNavbar from "./components/AppNavbar"
import Login from "./components/Login"
import Register from "./components/Register"
import AdminDashboard from "./components/AdminDashboard"

function App() {
  return (
    <>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<div>Pagina Home</div>} />
          <Route path="/home" element={<div>Pagina Home</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotta per le categorie (usando i parametri) */}
          <Route
            path="/category/:categoryName"
            element={<div>Pagina Categoria</div>}
          />

          {/* Rotta Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
