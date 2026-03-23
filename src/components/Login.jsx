import { useState } from "react"
import { Alert, Card, Container, Form, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { API_ENDPOINT } from "../services/api"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handlesubmit = (e) => {
    e.preventDefault()
    setError(null)

    fetch(API_ENDPOINT.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        // Se la risposta non è OK (200-299)
        if (!response.ok) {
          try {
            // Proviamo a leggere il JSON d'errore dal backend
            const errorData = await response.json()
            // Lanciamo l'errore col messaggio del server (es. "Email o password non corretti")
            throw new Error(errorData.message || "Errore durante il login")
          } catch {
            // Se il backend non ha mandato un JSON, usiamo i codici HTTP
            if (response.status === 401)
              throw new Error("Credenziali non valide")
            if (response.status === 500)
              throw new Error("Errore del server. Riprova più tardi")
            throw new Error("Si è verificato un errore imprevisto")
          }
        }
        return response.json()
      })
      .then((data) => {
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("role", data.role)
        localStorage.setItem("userId", data.id)
        navigate("/")
        window.location.reload()
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card style={{ width: "400px" }} className="shadow p-4">
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handlesubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Entra
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default Login
