import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const NotFound = function () {
  const navigate = useNavigate()

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col xs={12} md={6} className="text-center">
          <div>
            <h3>404 - Not Found</h3>
            <h5>Siamo spiacenti, non abbiamo trovato quello che cercavi.</h5>

            <Button
              variant="info"
              onClick={() => {
                navigate("/")
              }}
            >
              Torna alla Home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound
