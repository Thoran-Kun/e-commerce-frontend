import { useState } from "react"
import { Alert, Card, Container, Form, Button } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Errore durante la registrazione. L'email potrebbe essere già in uso.",
          )
        }
        return response.json()
      })
      .then(() => {
        setSuccess(true)

        setTimeout(() => navigate("/login"), 2000)
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
      <Card style={{ width: "450px" }} className="shadow p-4 border-0">
        <h2 className="text-center mb-4 fw-bold">Registrazione ✍️</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Registrazione completata! Verrai reindirizzato al login...
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <div className="d-flex gap-2">
            <Form.Group className="mb-3 w-50">
              <Form.Label className="small fw-bold">Nome</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label className="small fw-bold">Cognome</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold">Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100 fw-bold shadow-sm mb-3"
          >
            Crea Account
          </Button>

          <div className="text-center small">
            Hai già un account?{" "}
            <Link to="/login" className="text-decoration-none">
              Accedi qui
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  )
}

export default Register
