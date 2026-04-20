import { useState, useEffect } from "react"
import { Container, Form, Button, Card, Alert, Row, Col, Tab, Tabs, Table, Badge, Spinner } from "react-bootstrap"
import { API_ENDPOINT } from "../services/api"

const AdminDashboard = () => {
  // --- STATO PRODOTTO (invariato) ---
  const [product, setProduct] = useState({
    name: "", description: "", price: "", stockQuantity: "",
    categoryId: "", author: "", publisher: "", imageUrl: "", brand: "", scale: "",
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // --- STATO ORDINI ---
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)

  // Carica gli ordini quando si monta il componente
  useEffect(() => {
    const token = localStorage.getItem("token")
    setOrdersLoading(true)

    fetch(API_ENDPOINT.ALL_ORDERS, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento degli ordini")
        return res.json()
      })
      .then((data) => {
        setOrders(data)
        setOrdersLoading(false)
      })
      .catch((err) => {
        setOrdersError(err.message)
        setOrdersLoading(false)
      })
  }, [])

  // --- HANDLERS PRODOTTO (invariati) ---
  const handleChange = (e) => {
    const { name, value } = e.target
    const val =
      name === "price" || name === "stockQuantity" || name === "categoryId"
        ? value === "" ? "" : Number(value)
        : value
    setProduct({ ...product, [name]: val })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const token = localStorage.getItem("token")

    fetch(API_ENDPOINT.PRODUCTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) return response.json().then((err) => { throw new Error(err.message || "Errore nel salvataggio") })
        return response.json()
      })
      .then(() => {
        setSuccess(true)
        setProduct({ name: "", description: "", price: "", stockQuantity: "", categoryId: "", author: "", publisher: "", imageUrl: "", brand: "", scale: "" })
      })
      .catch((err) => setError(err.message))
  }

  // Badge colore in base allo stato ordine
  const getStatusBadge = (status) => {
    const map = {
      PENDING: "warning",
      CONFIRMED: "primary",
      SHIPPED: "info",
      DELIVERED: "success",
      CANCELLED: "danger",
    }
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-uppercase text-center">
        Pannello Admin 🛠️
      </h2>

      <Tabs defaultActiveKey="products" className="mb-4">

        {/* ── TAB 1: AGGIUNGI PRODOTTO (invariata) ── */}
        <Tab eventKey="products" title="📦 Aggiungi Prodotto">
          <Card className="shadow-lg border-0 p-4 mx-auto" style={{ maxWidth: "850px" }}>
            <h4 className="mb-4 text-primary">Aggiungi un nuovo articolo al magazzino</h4>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess(false)}>Prodotto salvato con successo!</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Nome Opera</Form.Label>
                    <Form.Control type="text" name="name" value={product.name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Prezzo (€)</Form.Label>
                    <Form.Control type="number" step="0.01" name="price" value={product.price} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">ID Categoria</Form.Label>
                    <Form.Control type="number" name="categoryId" value={product.categoryId} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Autore</Form.Label>
                    <Form.Control type="text" name="author" value={product.author} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Editore / Publisher</Form.Label>
                    <Form.Control type="text" name="publisher" value={product.publisher} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Descrizione</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={product.description} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">URL Immagine (Cloudinary)</Form.Label>
                <Form.Control type="text" name="imageUrl" value={product.imageUrl} onChange={handleChange} required />
              </Form.Group>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Quantità Stock</Form.Label>
                    <Form.Control type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Brand (Opzionale)</Form.Label>
                    <Form.Control type="text" name="brand" value={product.brand} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Scala (es. 1/7 - Opzionale)</Form.Label>
                    <Form.Control type="text" name="scale" value={product.scale} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end mt-4">
                <Button variant="success" type="submit" className="px-5 py-2 fw-bold shadow-sm">
                  SALVA PRODOTTO 🚀
                </Button>
              </div>
            </Form>
          </Card>
        </Tab>

        {/* ── TAB 2: STORICO ORDINI ── */}
        <Tab eventKey="orders" title="📋 Storico Ordini">
          <Card className="shadow-lg border-0 p-4">
            <h4 className="mb-4 text-primary">Tutti gli ordini degli utenti</h4>

            {ordersLoading && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Caricamento ordini...</p>
              </div>
            )}

            {ordersError && <Alert variant="danger">{ordersError}</Alert>}

            {!ordersLoading && !ordersError && (
              <Table responsive hover striped>
                <thead className="table-dark">
                  <tr>
                    <th>#ID</th>
                    <th>Utente</th>
                    <th>Data</th>
                    <th>Totale</th>
                    <th>Stato</th>
                    <th>Prodotti</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">Nessun ordine trovato</td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-bold">#{order.id}</td>
                        <td>{order.user?.email || "—"}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString("it-IT")}</td>
                        <td className="fw-bold">€ {order.totalPrice?.toFixed(2)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>{order.items?.length || 0} articoli</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        </Tab>

      </Tabs>
    </Container>
  )
}

export default AdminDashboard