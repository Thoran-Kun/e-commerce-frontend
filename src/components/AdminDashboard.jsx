import { useState, useEffect } from "react"
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
  Table,
  Badge,
} from "react-bootstrap"
import { API_ENDPOINT } from "../services/api"

const AdminDashboard = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    author: "",
    publisher: "",
    imageUrl: "",
    brand: "",
    scale: "",
  })

  // Stati per la gestione degli ordini
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const token = localStorage.getItem("token")

  // --- Recupero degli ordini globali ---
  useEffect(() => {
    fetch(API_ENDPOINT.ALL_ORDERS, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("RISPOSTA SERVER (STATUS):", res.status)
        if (!res.ok) throw new Error("Errore nel caricamento degli ordini")
        return res.json()
      })
      .then((data) => setOrders(data))
      .catch((err) => console.error("Errore fetch ordini:", err))
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    const val =
      name === "price" || name === "stockQuantity" || name === "categoryId"
        ? value === ""
          ? ""
          : Number(value)
        : value

    setProduct({ ...product, [name]: val })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    fetch(API_ENDPOINT.PRODUCTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Errore nel salvataggio")
          })
        }
        return response.json()
      })
      .then(() => {
        setSuccess(true)
        setProduct({
          name: "",
          description: "",
          price: "",
          stockQuantity: "",
          categoryId: "",
          author: "",
          publisher: "",
          imageUrl: "",
          brand: "",
          scale: "",
        })
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-uppercase">Pannello Admin 🛠️</h2>

      {/* SEZIONE 1: AGGIUNTA PRODOTTO */}
      <Card className="shadow-lg border-0 p-4 mb-5">
        <h4 className="mb-4 text-primary fw-bold">
          Aggiungi un nuovo articolo al magazzino
        </h4>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">Prodotto salvato con successo!</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Nome Opera</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Prezzo (€)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">ID Categoria</Form.Label>
                <Form.Control
                  type="number"
                  name="categoryId"
                  value={product.categoryId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Autore</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={product.author}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">
                  Editore / Publisher
                </Form.Label>
                <Form.Control
                  type="text"
                  name="publisher"
                  value={product.publisher}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">
              URL Immagine (Cloudinary)
            </Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">
                  Quantità Stock
                </Form.Label>
                <Form.Control
                  type="number"
                  name="stockQuantity"
                  value={product.stockQuantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">
                  Brand (Opzionale)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">
                  Scala (es. 1/7 - Opzionale)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="scale"
                  value={product.scale}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end mt-4">
            <Button
              variant="success"
              type="submit"
              className="px-5 py-2 fw-bold shadow-sm"
            >
              SALVA PRODOTTO
            </Button>
          </div>
        </Form>
      </Card>

      {/* <hr className="my-5" /> */}

      {/* SEZIONE 2: STORICO VENDITE */}
      {/* <Card className="shadow-lg border-0 p-4">
        <h4 className="mb-4 text-danger fw-bold">Registro Vendite Totali 🛒</h4>
        <Table responsive striped hover>
          <thead className="table-dark">
            <tr>
              <th>ID Ordine</th>
              <th>Cliente (Email)</th>
              <th>Data</th>
              <th className="text-center">Totale Acquisto</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="align-middle">
                <td>
                  <Badge bg="secondary">#{order.id}</Badge>
                </td>
                <td>{order.user?.email || "Utente non trovato"}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="text-center fw-bold text-success">
                  {order.totalCart?.toFixed(2)} €
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  Nessun ordine presente nel database.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card> */}
    </Container>
  )
}

export default AdminDashboard
