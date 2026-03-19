import { Container, Row, Col, Form, Button, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-dark text-secondary py-5 mt-auto border-top border-secondary">
      <Container>
        <Row className="gy-4">
          {/* Colonna 1: Info Brand */}
          <Col md={4}>
            <h5 className="text-white fw-bold mb-3">⛩️ Salvatore MangaStore</h5>
            <p className="small">
              La tua destinazione definitiva per Manga, Figures e pezzi da
              collezione. Qualità garantita e spedizioni sicure in tutta Italia.
            </p>
            <div className="d-flex gap-3 fs-5 text-white">
              <i className="bi bi-instagram"></i>
              <i className="bi bi-facebook"></i>
              <i className="bi bi-discord"></i>
            </div>
          </Col>

          {/* Colonna 2: Link Rapidi */}
          <Col md={2} className="offset-md-1">
            <h6 className="text-white fw-bold mb-3">Esplora</h6>
            <Stack gap={2}>
              <Link
                to="/"
                className="text-decoration-none text-secondary small"
              >
                Home
              </Link>
              <Link
                as={Link}
                to="/?category=manga"
                className="text-decoration-none text-secondary small"
              >
                Manga
              </Link>
              <Link
                as={Link}
                to="/?category=figures"
                className="text-decoration-none text-secondary small"
              >
                Figures
              </Link>
              <Link
                as={Link}
                to="/?category=comics"
                className="text-decoration-none text-secondary small"
              >
                Comics
              </Link>
            </Stack>
          </Col>

          {/* Colonna 3: Newsletter */}
          <Col md={5}>
            <h6 className="text-white fw-bold mb-3">
              Iscriviti alla Newsletter 📩
            </h6>
            <p className="small">
              Ricevi in anteprima le nuove uscite e sconti esclusivi.
            </p>
            <Form>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="email"
                  placeholder="La tua email..."
                  className="bg-secondary text-white border-0 shadow-none placeholder-light"
                  style={{ backgroundColor: "#3d4145 !important" }}
                />
                <Button variant="outline-light" className="fw-bold">
                  OK
                </Button>
              </div>
              <Form.Check
                type="checkbox"
                id="privacy"
                label="Accetto di ricevere aggiornamenti e promozioni"
                className="small"
              />
            </Form>
          </Col>
        </Row>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex justify-content-between align-items-center small">
          <span>© 2026 Salvatore Pepe. Progetto Epicode Final.</span>
          <div className="d-none d-sm-block">
            Metodi di pagamento:
            <div className="d-flex align-items-center gap-3 fs-4">
              <i
                className="bi bi-credit-card-2-front text-white"
                title="Visa"
              ></i>

              <i className="bi bi-stripe text-white" title="Mastercard"></i>

              <i className="bi bi-paypal text-primary" title="PayPal"></i>

              <span
                className="fw-bold px-2 rounded"
                style={{
                  backgroundColor: "#ffb3c7",
                  color: "black",
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                }}
              >
                KLARNA
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
