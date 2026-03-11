import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NotFound from "./components/NotFound"
import AppNavbar from "./components/AppNavbar"

function App() {
  return (
    <>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<div>Pagina Home</div>} />
          <Route path="/home" element={<div>Pagina Home</div>} />
          <Route path="/Login" element={<div>Pagina Login</div>} />
          <Route path="/register" element={<div>Pagina Registrazione</div>} />

          {/* Rotta per le categorie (usando i parametri) */}
          <Route
            path="/category/:categoryName"
            element={<div>Pagina Categoria</div>}
          />

          {/* Rotta Admin */}
          <Route path="/admin/dashboard" element={<div>Dashboard Admin</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
