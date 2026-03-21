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
} from "react-bootstrap"
import { Link, useSearchParams } from "react-router-dom"

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get("category")
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")

  useEffect(() => {
    // faccio una chiamata GET al mio endpoint per recuperare tutti i prodotti
    fetch("https://e-commerce-backend-c9cn.onrender.com")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel caricamento del catalogo")
        }
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

  const handleDelete = (id) => {
    if (
      window.confirm("Vuoi davvero eliminare questo prodotto dal catalogo?")
    ) {
      fetch(`https://e-commerce-backend-c9cn.onrender.com/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        (p) =>
          p.category?.name.toLowerCase() === categoryFilter.toLocaleLowerCase(),
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
          {error} - Assicurarsi che sia attivo il backend sulla porta 3001
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          {categoryFilter
            ? `${categoryFilter.toUpperCase()} 🏯`
            : "Geek Shop Catalog 🏯"}
        </h1>
        <p className="lead text-muted">
          {categoryFilter
            ? `Esplora la nostra selezione di ${categoryFilter.toLowerCase()}`
            : "Manga, Figures e Comics scelti dai migliori Otaku"}
        </p>
        <hr className="w-25 mx-auto text-success" style={{ height: "3px" }} />
      </div>

      {products.length === 0 ? (
        <Alert variant="info" className="text-center shadow-sm border-0">
          {categoryFilter
            ? `Nessun prodotto trovato nella categoria ${categoryFilter}.`
            : "Il catalogo è attualmente vuoto. Accedi come Admin per aggiungere il primo prodotto!"}
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 border-0 shadow-sm overflow-hidden hover-card">
                {/* Immagine del prodotto */}
                <div style={{ backgroundColor: "#f8f9fa", padding: "10px" }}>
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
                    <span>{product.price.toFixed(2)} €</span>
                  </div>

                  <Card.Title className="h6 fw-bold mb-1">
                    {product.name}
                  </Card.Title>
                  <div className="mb-2 text-muted small fst-italic">
                    di {product.author || "Autore Sconosciuto"}
                  </div>

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
