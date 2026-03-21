import { useEffect, useState } from "react"
import { Container, Table, Badge, Card } from "react-bootstrap"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetch("https://e-commerce-backend-c9cn.onrender.com/orders/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Errore caricamento ordini:", err))
  }, [token])

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-uppercase">Storico Ordini 📜</h2>
      {orders.length === 0 ? (
        <p>Non hai ancora effettuato ordini.</p>
      ) : (
        <Table responsive hover className="shadow-sm bg-white rounded">
          <thead className="table-dark">
            <tr>
              <th>ID Ordine</th>
              <th>Data</th>
              <th>Prodotti</th>
              <th>Totale</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  {order.orderItem.map((item) => (
                    <div key={item.id} className="small">
                      {item.product.name} (x{item.quantity})
                    </div>
                  ))}
                </td>
                <td className="fw-bold text-success">
                  {order.totalCart.toFixed(2)} €
                </td>
                <td>
                  <Badge
                    bg={order.status === "PRESO_IN_CARICO" ? "info" : "success"}
                  >
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default Orders
