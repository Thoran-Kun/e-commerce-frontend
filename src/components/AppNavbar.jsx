import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, LogOut } from "lucide-react"

const AppNavbar = () => {
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role") //se ADMIN o USER qualsiasi

  const handleLogout = () => {
    localStorage.clear() //cancella il token e il ruolo
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
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                0
              </span>
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
