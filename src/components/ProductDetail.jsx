import { Badge, Col, Container, Row, Spinner, Button } from "react-bootstrap"
import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const handleAddToCart = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert(
        "devi essere loggato o registrato per comprare un nostro fantastico prodotto ;)",
      )
      navigate("/login")
      return
    }
    const currentCart = JSON.parse(localStorage.getItem("cart")) || []
    const existingProductIndex = currentCart.findIndex(
      (item) => item.id === product.id,
    )

    if (existingProductIndex !== -1) {
      // Se esiste già, aumento la quantità
      currentCart[existingProductIndex].quantity += 1
    } else {
      // Se è nuovo, aggiungo con quantità 1
      currentCart.push({ ...product, quantity: 1 })
    }

    // 3. Salva di nuovo nel localStorage
    localStorage.setItem("cart", JSON.stringify(currentCart))

    window.dispatchEvent(new Event("cart-updated"))
    alert(`${product.name} aggiunto al carrello!`)
  }

  useEffect(() => {
    fetch(`https://e-commerce-backend-c9cn.onrender.com/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((err) => console.error(err))
  }, [id])

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />
  return (
    <Container className="py-5">
      <Link to="/" className="btn btn-outline-secondary mb-4">
        ← Torna al Catalogo
      </Link>
      <Row>
        <Col md={5}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </Col>
        <Col md={7}>
          <Badge bg="dark" className="mb-2 text-uppercase">
            {product.category?.name}
          </Badge>
          <h1 className="fw-bold">{product.name}</h1>
          <h4 className="text-muted mb-4">di {product.author}</h4>

          <div className="bg-light p-4 rounded mb-4">
            <h2 className="text-success fw-bold">
              {product.price.toFixed(2)} €
            </h2>
            <p className="small text-muted">
              Disponibilità: {product.stockQuantity} pezzi
            </p>
            <Button
              variant="success"
              size="lg"
              className="px-5 shadow-sm"
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
            >
              {product.stockQuantity > 0 ? "Aggiungi al Carrello" : "Esaurito"}
            </Button>
          </div>

          <h5>Descrizione</h5>
          <p className="lead">{product.description}</p>

          <hr />
          <p>
            <strong>Editore:</strong> {product.publisher}
          </p>
          {product.brand && (
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
          )}
          {product.scale && (
            <p>
              <strong>Scala:</strong> {product.scale}
            </p>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ProductDetail
