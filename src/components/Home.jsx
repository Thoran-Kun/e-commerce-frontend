import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { API_ENDPOINT } from "../services/api"

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showToast, setShowToast] = useState(false)
  const [addedProductName, setAddedProductName] = useState("")

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const categoryFilter = searchParams.get("category")
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")

  useEffect(() => {
    // faccio una chiamata GET al mio endpoint per recuperare tutti i prodotti
    fetch(API_ENDPOINT.PRODUCTS)
      .then((response) => {
        if (!response.ok) throw new Error("Errore nel caricamento del catalogo")
        return response.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // --- LOGICA AGGIUNTA RAPIDA AL CARRELLO ---
  const handleQuickAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation() // Impedisce di navigare ai dettagli cliccando il tasto

    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Controllo se il prodotto è già presente per aumentare la quantità o aggiungerlo
    const productIndex = currentCart.findIndex((item) => item.id === product.id)

    if (productIndex !== -1) {
      currentCart[productIndex].quantity += 1
    } else {
      currentCart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(currentCart))

    // Trigger per aggiornare la Navbar se ascolta l'evento 'storage'
    window.dispatchEvent(new Event("cart-updated"))

    setAddedProductName(product.name)
    setShowToast(true)
  }

  const handleDelete = (id) => {
    if (
      window.confirm("Vuoi davvero eliminare questo prodotto dal catalogo?")
    ) {
      fetch(`https://e-commerce-backend-c9cn.onrender.com/product/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok || res.status === 204) {
            setProducts(products.filter((p) => p.id !== id))
          }
        })
        .catch((err) => console.error(err))
    }
  }

  const filteredProducts = categoryFilter
    ? products.filter(
        (p) => p.category?.name.toLowerCase() === categoryFilter.toLowerCase(),
      )
    : products

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="grow" variant="success" />
        <p>Caricamento del catalogo in corso... ⛩️</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger" className="border-0 shadow-sm">
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      {/* --- COMPONENTE TOAST (FEEDBACK) --- */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="dark"
        >
          <Toast.Header
            closeButton={false}
            className="bg-success text-white border-0"
          >
            <strong className="me-auto">⛩️ Salvatore MangaStore</strong>
            <small>Adesso</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            {addedProductName} aggiunto al carrello con successo!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          {categoryFilter
            ? `${categoryFilter.toUpperCase()} 🏯`
            : "Geek Shop Catalog 🏯"}
        </h1>
        <p className="lead text-muted">
          Manga, Figures e Comics scelti dai migliori Otaku
        </p>
        <hr className="w-25 mx-auto text-success" style={{ height: "3px" }} />
      </div>

      {filteredProducts.length === 0 ? (
        <Alert variant="info" className="text-center shadow-sm border-0">
          Nessun prodotto trovato.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 border-0 shadow-sm overflow-hidden hover-card position-relative">
                {/* --- BOTTONE CARRELLO RAPIDO --- */}
                <Button
                  variant="light"
                  className="position-absolute top-0 end-0 m-2 shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    zIndex: 10,
                    border: "1px solid #eee",
                  }}
                  onClick={(e) => handleQuickAddToCart(e, product)}
                >
                  <i className="bi bi-cart-plus text-success fs-5"></i>
                </Button>

                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <Card.Img
                    variant="top"
                    src={
                      product.imageUrl ||
                      "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    referrerPolicy="no-referrer"
                    style={{ height: "250px", objectFit: "contain" }}
                  />
                </div>

                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="dark" className="text-uppercase small">
                      {product.category?.name || "Prodotto"}
                    </Badge>
                    <span className="fw-bold">
                      {product.price.toFixed(2)} €
                    </span>
                  </div>

                  <Card.Title className="h6 fw-bold mb-1">
                    {product.name}
                  </Card.Title>

                  <Card.Text
                    className="small text-muted flex-grow-1"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {product.description?.substring(0, 70)}...
                  </Card.Text>

                  <Button
                    as={Link}
                    to={`/product/${product.id}`}
                    variant="outline-dark"
                    className="mt-3 w-100 fw-bold btn-sm"
                  >
                    Dettagli Opera
                  </Button>

                  {token && userRole === "ADMIN" && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-2 w-100 fw-bold"
                      onClick={() => handleDelete(product.id)}
                    >
                      Elimina prodotto 🗑️
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Home
