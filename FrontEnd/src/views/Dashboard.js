import React from "react";
import ChartistGraph from "react-chartist";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Table,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

const Dashboard = () => {
  const statsCards = [
    {
      icon: "nc-icon nc-chart text-warning",
      category: "Storage",
      title: "150GB",
      footer: "Update Now",
      footerIcon: "fas fa-redo",
    },
    {
      icon: "nc-icon nc-light-3 text-success",
      category: "Revenue",
      title: "$1,345",
      footer: "Last day",
      footerIcon: "far fa-calendar-alt",
    },
    {
      icon: "nc-icon nc-vector text-danger",
      category: "Errors",
      title: "23",
      footer: "In the last hour",
      footerIcon: "far fa-clock",
    },
    {
      icon: "nc-icon nc-favourite-28 text-primary",
      category: "Followers",
      title: "+45K",
      footer: "Update now",
      footerIcon: "fas fa-redo",
    },
  ];

  const tasks = [
    "Update dependencies",
    "Refactor dashboard layout",
    "Fix chart legend issue",
    "Deploy new version",
  ];

  return (
    <Container fluid>
      <Row>
        {statsCards.map((card, index) => (
          <Col lg="3" sm="6" key={index}>
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center">
                      <i className={card.icon}></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">{card.category}</p>
                      <Card.Title as="h4">{card.title}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr />
                <div className="stats">
                  <i className={`${card.footerIcon} mr-1`}></i>
                  {card.footer}
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md="8">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Users Behavior</Card.Title>
              <p className="card-category">24 Hours performance</p>
            </Card.Header>
            <Card.Body>
              <ChartistGraph
                data={{
                  labels: ["9AM", "12PM", "3PM", "6PM", "9PM", "12AM"],
                  series: [
                    [287, 385, 490, 492, 554, 586],
                    [67, 152, 143, 240, 287, 335],
                    [23, 113, 67, 108, 190, 239],
                  ],
                }}
                type="Line"
                options={{
                  low: 0,
                  high: 800,
                  showArea: false,
                  height: "245px",
                  axisX: { showGrid: false },
                  lineSmooth: true,
                  showLine: true,
                  showPoint: true,
                  fullWidth: true,
                  chartPadding: { right: 50 },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Email Statistics</Card.Title>
              <p className="card-category">Last Campaign Performance</p>
            </Card.Header>
            <Card.Body>
              <ChartistGraph
                data={{ labels: ["40%", "20%", "40%"], series: [40, 20, 40] }}
                type="Pie"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Monthly Sales</Card.Title>
              <p className="card-category">All products</p>
            </Card.Header>
            <Card.Body>
              <ChartistGraph
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  series: [
                    [542, 443, 320, 780, 553, 453],
                    [412, 243, 280, 580, 453, 353],
                  ],
                }}
                type="Bar"
                options={{
                  seriesBarDistance: 10,
                  axisX: { showGrid: false },
                  height: "245px",
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md="6">
          <Card className="card-tasks">
            <Card.Header>
              <Card.Title as="h4">Tasks</Card.Title>
              <p className="card-category">Sprint backlog</p>
            </Card.Header>
            <Card.Body>
              <Table>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Check>
                          <Form.Check.Input type="checkbox" />
                          <Form.Check.Label>
                            <span className="form-check-sign"></span>
                          </Form.Check.Label>
                        </Form.Check>
                      </td>
                      <td>{task}</td>
                      <td className="td-actions text-right">
                        <OverlayTrigger
                          overlay={<Tooltip>Edit</Tooltip>}
                        >
                          <Button
                            className="btn-simple btn-link"
                            variant="info"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          overlay={<Tooltip>Remove</Tooltip>}
                        >
                          <Button
                            className="btn-simple btn-link"
                            variant="danger"
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;