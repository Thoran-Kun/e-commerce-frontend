import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, LogOut } from "lucide-react"
import { useEffect, useState } from "react"

const AppNavbar = () => {
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role") //se ADMIN o USER qualsiasi

  //questa funzione legge il carello e mi aggiorna lo stato locale dell'app
  const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const total = cart.reduce((acc, item) => acc + item.quantity, 0)
    setCartCount(total)
  }
  //recupero il numero degli elementi ogni volta che la navbar viene renderizzata
  useEffect(() => {
    updateCartBadge()
    //calcolo dop che recupero gli elementi il loro totale
    window.addEventListener("cart-updated", updateCartBadge)

    return () => {
      window.removeEventListener("cart-updated", updateCartBadge)
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear() //cancella il token e il ruolo
    setCartCount(0)
    navigate("/login")
  }

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          GEEK-SHOP ⛩️
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <NavDropdown title="Categorie" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/category/manga">
                Manga
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/figures">
                Figures
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/comics">
                Comics
              </NavDropdown.Item>
            </NavDropdown>

            {token && userRole === "ADMIN" && (
              <Nav.Link
                as={Link}
                to="/admin/dashboard"
                className="text-warning fw-bold"
              >
                Dashboard Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center">
            {/* Carrello sempre visibile */}
            <Nav.Link as={Link} to="/cart" className="position-relative me-3">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Nav.Link>

            {/* Se NON sono loggato */}
            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                  className="ms-2"
                >
                  Registrati
                </Button>
              </>
            ) : (
              /* Se SONO loggato */
              <NavDropdown
                title={<User size={20} />}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Miei Ordini
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  <LogOut size={16} className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
