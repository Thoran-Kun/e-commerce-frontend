import { useEffect, useState } from "react"
import { Button, Col, Container, Table, Row, Card } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const navigate = useNavigate()

  //recupero i dati dal localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || []
    setCartItems(savedCart)
  }, [])

  // sincronizzo la navbar
  const syncNavbar = () => {
    window.dispatchEvent(new Event("cart-updated"))
  }

  // Funzione per rimuovere un singolo prodotto
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    syncNavbar() // <--- Avvisa la Navbar
  }

  //funzione per rimuovere un prodotto
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
    syncNavbar()
  }

  // --- FUNZIONE DI CHECKOUT ---
  const handleCheckout = async () => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (!token || !userId) {
      alert("Devi effettuare il login per completare l'acquisto!")
      navigate("/login")
      return
    }

    const orderPayload = {
      userId: Number(userId),
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: "Indirizzo di Spedizione Esempio, 123",
    }

    try {
      const response = await fetch(
        "https://e-commerce-backend-c9cn.onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        },
      )

      if (response.ok) {
        alert("⛩️ Ordine confermato con successo! Grazie per l'acquisto.")
        clearCart() // Svuota lo stato e il localStorage
        navigate("/home") // Torno alla Home per vedere lo stock aggiornato
      } else {
        const errorData = await response.json()
        alert(
          `Errore: ${errorData.message || "Impossibile completare l'ordine"}`,
        )
      }
    } catch (error) {
      console.error("Errore durante il checkout:", error)
      alert("Errore di connessione con il server.")
    }
  }

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Il carello è vuoto 🛒</h2>
        <p className="text-muted">
          Affrettati a scegliere qualcosa di speciale!
        </p>
        <Link to="/" className="btn btn-success mt-3">
          Torna allo Shop
        </Link>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">Il Tuo Carrello</h2>
      <Row>
        <Col lg={8}>
          <Table
            responsive
            hover
            className="align-middle shadow-sm bg-white rounded"
          >
            <thead className="table-dark">
              <tr>
                <th>Prodotto</th>
                <th>Prezzo</th>
                <th>Quantità</th>
                <th>Subtotale</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                        className="me-3 rounded"
                      />
                      <div>
                        <div className="fw-bold">{item.name}</div>
                        <div className="small text-muted">
                          {item.category?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item.price.toFixed(2)} €</td>
                  <td>
                    <strong>x{item.quantity}</strong>
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)} €</td>
                  <td>
                    <Button
                      variatn="outline-danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            variant="link"
            className="text-danger p-0 mt-2"
            onClick={clearCart}
          >
            Svuota carrello
          </Button>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 bg-light">
            <h4 className="mb-4">Riepilogo Ordine</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Prodotti:</span>
              <span>{cartItems.length}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span className="h5">TOTALE:</span>
              <span className="h5 fw-bold text-success">
                {total.toFixed(2)} €
              </span>
            </div>
            <Button
              variant="success"
              size="lg"
              className="w-100 fw-bold shadow-sm"
              onClick={handleCheckout}
            >
              PROCEDI AL CHECKOUT
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Cart
