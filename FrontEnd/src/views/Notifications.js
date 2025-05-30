import React from "react";
// react-bootstrap components
import {
  Alert,
  Badge,
  Button,
  Card,
  Modal,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Notifications() {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <Container fluid>
        <Card>
          <Card.Header>
            <Card.Title as="h4">Notifications</Card.Title>
            <p className="card-category">
              Handcrafted by our friends from{" "}
              <a target="_blank" rel="noopener noreferrer" href="https://nucleoapp.com/?ref=creativetim">
                NucleoApp
              </a>
            </p>
          </Card.Header>
          <Card.Body>
            <Alert variant="info">
              <span>This is a plain notification</span>
            </Alert>
            <Alert variant="info">
              <button type="button" className="close" data-dismiss="alert">
                ×
              </button>
              <span>This is a notification with close button.</span>
            </Alert>
            <Alert variant="info" className="alert-with-icon">
              <button type="button" className="close" data-dismiss="alert">
                ×
              </button>
              <span data-notify="icon" className="nc-icon nc-bell-55"></span>
              <span data-notify="message">
                This is a notification with close button and icon.
              </span>
            </Alert>
            <Alert variant="info" className="alert-with-icon">
              <button type="button" className="close" data-dismiss="alert">
                ×
              </button>
              <span data-notify="icon" className="nc-icon nc-bell-55"></span>
              <span data-notify="message">
                This is a notification with close button and icon and have many
                lines. You can see that the icon and the close button are
                always vertically aligned. This is a beautiful notification. So
                what do you think?
              </span>
            </Alert>
            <Row>
              <Col md="6">
                <Card className="card-plain">
                  <Card.Header>
                    <Card.Title as="h4">Notification states</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant="info">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span>
                        <b> Info - </b> This is an info notification.
                      </span>
                    </Alert>
                    <Alert variant="success">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span>
                        <b> Success - </b> This is a success notification.
                      </span>
                    </Alert>
                    <Alert variant="warning">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span>
                        <b> Warning - </b> This is a warning notification.
                      </span>
                    </Alert>
                    <Alert variant="danger">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span>
                        <b> Danger - </b> This is a danger notification.
                      </span>
                    </Alert>
                    <Alert variant="primary">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span>
                        <b> Primary - </b> This is a primary notification.
                      </span>
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="6">
                <Card className="card-plain">
                  <Card.Header>
                    <Card.Title as="h4">Notification states with icons</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant="info" className="alert-with-icon">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span
                        data-notify="icon"
                        className="nc-icon nc-bell-55"
                      ></span>
                      <span data-notify="message">
                        <b> Info - </b> This is a regular notification with icon.
                      </span>
                    </Alert>
                    <Alert variant="success" className="alert-with-icon">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span
                        data-notify="icon"
                        className="nc-icon nc-bell-55"
                      ></span>
                      <span data-notify="message">
                        <b> Success - </b> This is a regular notification with icon.
                      </span>
                    </Alert>
                    <Alert variant="warning" className="alert-with-icon">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span
                        data-notify="icon"
                        className="nc-icon nc-bell-55"
                      ></span>
                      <span data-notify="message">
                        <b> Warning - </b> This is a regular notification with icon.
                      </span>
                    </Alert>
                    <Alert variant="danger" className="alert-with-icon">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span
                        data-notify="icon"
                        className="nc-icon nc-bell-55"
                      ></span>
                      <span data-notify="message">
                        <b> Danger - </b> This is a regular notification with icon.
                      </span>
                    </Alert>
                    <Alert variant="primary" className="alert-with-icon">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        ×
                      </button>
                      <span
                        data-notify="icon"
                        className="nc-icon nc-bell-55"
                      ></span>
                      <span data-notify="message">
                        <b> Primary - </b> This is a regular notification with icon.
                      </span>
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="places-buttons">
              <Row>
                <Col md="6" className="ml-auto mr-auto">
                  <Card.Header>
                    <Card.Title as="h4">Notifications Places</Card.Title>
                  </Card.Header>
                </Col>
              </Row>
              <Row>
                <Col lg="8" className="ml-auto mr-auto">
                  <Row>
                    <Col md="4">
                      <Button
                        block
                        variant="default"
                        onClick={() => setShowModal(true)}
                      >
                        Top Left
                      </Button>
                    </Col>
                    <Col md="4">
                      <Button
                        block
                        variant="default"
                        onClick={() => setShowModal(true)}
                      >
                        Top Right
                      </Button>
                    </Col>
                    <Col md="4">
                      <Button
                        block
                        variant="default"
                        onClick={() => setShowModal(true)}
                      >
                        Top Center
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg="8" className="ml-auto mr-auto">
                  <Row>
                    <Col md="4">
                      <Button
                        block
                        variant="default"
                        onClick={() => setShowModal(true)}
                      >
                        Bottom Left
                      </Button>
                    </Col>
                    <Col md="4">
                      <Button
                        block
                        variant="default"
                        onClick={() => setShowModal(true)}
                      >
                        Bottom Right
                      </Button>
                    </Col>
                    <Col md="4">
                      <Button
                        block
                        variant="default"
                        onClick={() => setShowModal(true)}
                      >
                        Bottom Center
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Modal className="modal-mini modal-primary" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-bulb-63"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Always enjoy your stay at our &quot;Paradise&quot; island?</p>
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            className="btn-simple"
            onClick={() => setShowModal(false)}
            variant="link"
          >
            Back
          </Button>
          <Button
            className="btn-simple"
            onClick={() => setShowModal(false)}
            variant="link"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Notifications;