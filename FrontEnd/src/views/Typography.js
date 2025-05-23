import React from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Typography() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Light Bootstrap Dashboard React</Card.Title>
                <p className="card-category">
                  All the 200 React components that we use in this product.
                </p>
              </Card.Header>
              <Card.Body>
                <div className="typography-line">
                  <h1>
                    <span>Headers</span>The Title Goes Here
                  </h1>
                </div>
                <div className="typography-line">
                  <h2>
                    <span>Headers</span>The Title Goes Here
                  </h2>
                </div>
                <div className="typography-line">
                  <h3>
                    <span>Headers</span>The Title Goes Here
                  </h3>
                </div>
                <div className="typography-line">
                  <h4>
                    <span>Headers</span>The Title Goes Here
                  </h4>
                </div>
                <div className="typography-line">
                  <h5>
                    <span>Headers</span>The Title Goes Here
                  </h5>
                </div>
                <div className="typography-line">
                  <h6>
                    <span>Headers</span>The Title Goes Here
                  </h6>
                </div>
                <div className="typography-line">
                  <h2>
                    <span>Paragraph</span>
                    I will be the leader of a company that manages{" "}
                    <b className="text-info">all the traffic</b>, that will
                    redefine what &quot;traffic&quot; means and that will manage
                    500 million vehicles per year in America.
                  </h2>
                </div>
                <div className="typography-line">
                  <span>Quote</span>
                  <blockquote>
                    <p className="blockquote blockquote-primary">
                      &quot;I will be the leader of a company that manages all the
                      traffic, that will redefine what &quot;traffic&quot; means and
                      that will manage 500 million vehicles per year in America.&quot;
                      <br></br>
                      <br></br>
                      <small>- Elon Musk</small>
                    </p>
                  </blockquote>
                </div>
                <div className="typography-line">
                  <span>Muted Text</span>
                  <p className="text-muted">
                    I will be the leader of a company that manages all the
                    traffic.
                  </p>
                </div>
                <div className="typography-line">
                  <span>Primary Text</span>
                  <p className="text-primary">
                    I will be the leader of a company that manages all the
                    traffic.
                  </p>
                </div>
                <div className="typography-line">
                  <span>Info Text</span>
                  <p className="text-info">
                    I will be the leader of a company that manages all the
                    traffic.
                  </p>
                </div>
                <div className="typography-line">
                  <span>Success Text</span>
                  <p className="text-success">
                    I will be the leader of a company that manages all the
                    traffic.
                  </p>
                </div>
                <div className="typography-line">
                  <span>Warning Text</span>
                  <p className="text-warning">
                    I will be the leader of a company that manages all the
                    traffic.
                  </p>
                </div>
                <div className="typography-line">
                  <span>Danger Text</span>
                  <p className="text-danger">
                    I will be the leader of a company that manages all the
                    traffic.
                  </p>
                </div>
                <div className="typography-line">
                  <h2>
                    <span>Small Tag</span>
                    Header with small subtitle <br></br>
                    <small>A beautiful subtitle for this title</small>
                  </h2>
                </div>
                <div className="typography-line">
                  <span>List Group</span>
                  <div className="col-md-10">
                    <ul className="list-group">
                      <li className="list-group-item">Cras justo odio</li>
                      <li className="list-group-item">Dapibus ac facilisis in</li>
                      <li className="list-group-item">Morbi leo risus</li>
                      <li className="list-group-item">Porta ac consectetur ac</li>
                      <li className="list-group-item">Vestibulum at eros</li>
                    </ul>
                  </div>
                </div>
                <div className="typography-line">
                  <span>Unordered List</span>
                  <div className="col-md-10">
                    <ul>
                      <li>Cras justo odio</li>
                      <li>Dapibus ac facilisis in</li>
                      <li>Morbi leo risus</li>
                      <li>Porta ac consectetur ac</li>
                      <li>Vestibulum at eros</li>
                    </ul>
                  </div>
                </div>
                <div className="typography-line">
                  <span>Ordered List</span>
                  <div className="col-md-10">
                    <ol>
                      <li>Cras justo odio</li>
                      <li>Dapibus ac facilisis in</li>
                      <li>Morbi leo risus</li>
                      <li>Porta ac consectetur ac</li>
                      <li>Vestibulum at eros</li>
                    </ol>
                  </div>
                </div>
                <div className="typography-line">
                  <span>Customized List</span>
                  <div className="col-md-10">
                    <ul className="list-unstyled">
                      <li>Cras justo odio</li>
                      <li>Dapibus ac facilisis in</li>
                      <li>Morbi leo risus</li>
                      <li>Porta ac consectetur ac</li>
                      <li>Vestibulum at eros</li>
                    </ul>
                  </div>
                </div>
                <div className="typography-line">
                  <span>Paragraph with dropcap</span>
                  <p className="text-info text-dropcap">
                    T
                  </p>
                  <p>
                    he standard chunk of Lorem Ipsum used since the 1500s is
                    reproduced below for those interested. Sections 1.10.32 and
                    1.10.33 from &quot;de Finibus Bonorum et Malorum&quot; by
                    Cicero are also reproduced in their exact original form,
                    accompanied by English versions from the 1914 translation by
                    H. Rackham.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Typography;