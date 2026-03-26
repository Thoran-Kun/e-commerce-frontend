import { useState, useEffect } from "react"
import { Container, Table, Badge, Spinner, Alert } from "react-bootstrap"
import { API_ENDPOINT } from "../services/api"

const AdminOrders = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetch(`${API_ENDPOINT.USERS}?size=50`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Errore server: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const usersList = data.content ? data.content : data
        setUsers(Array.isArray(usersList) ? usersList : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Errore report admin:", err)
        setError("Impossibile caricare i dati. Controlla i permessi Admin.")
        setLoading(false)
      })
  }, [token])

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    )
  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-uppercase">Report Vendite Globali 📊</h2>
      <Table responsive hover bordered className="shadow-sm bg-white">
        <thead className="table-dark">
          <tr>
            <th>Cliente</th>
            <th>Email</th>
            <th className="text-center">N. Ordini</th>
            <th>Dettaglio Acquisti</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="align-middle">
              <td>
                <div className="fw-bold">
                  {user.firstName} {user.lastName}
                </div>
                <small className="text-muted">@{user.username}</small>
              </td>
              <td>{user.email}</td>
              <td className="text-center">
                <Badge pill bg="dark">
                  {user.orders?.length || 0}
                </Badge>
              </td>
              <td>
                {user.orders && user.orders.length > 0 ? (
                  <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="small border-bottom mb-1 pb-1 d-flex justify-content-between"
                      >
                        <span>📦 ID: #{order.id}</span>
                        <span className="fw-bold text-success">
                          {order.totalCart?.toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted fst-italic small">
                    Nessun ordine
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default AdminOrders
