import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { get } from "jquery";

const Dashboard = () => { 

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    Low: 0,
    Medium: 0,
    High: 0,
    Urgent: 0,
  });
  
  const now = new Date();
  const [startedPerMonth, setStartedPerMonth] = useState({});
  const [finishedPerMonth, setFinishedPerMonth] = useState({});

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getLastMonths = (n) => {
    const now = new Date();
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
      return monthNames[d.getMonth()];
      });
  };

  const labels = getLastMonths(6);

  const tasks = [
    "Update dependencies",
    "Refactor dashboard layout",
    "Fix chart legend issue",
    "Deploy new version",
  ];


  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    
    if (!userToken) {
      console.error("JWT token not found in localStorage!");
      setLoading(false);
      return;
    }

    // Function to fetch and count records for each priority
    const fetchCounts = async () => {
      const priorities = ["Low", "Medium", "High", "Urgent"];
      const newCounts = {};
      for (const priority of priorities) {
        try {
          const response = await axios.get(`/service?priority=${priority}`, {
                headers: { Authorization: `Bearer ${userToken}` },
            }
          );
          newCounts[priority] = Array.isArray(response.data)
            ? response.data.length
            : 0;
        } catch (err) {
          newCounts[priority] = 0;
        }
      }
      setCounts(newCounts);
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");  

    if (!userToken) {
      console.error("JWT token not found in localStorage!");
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      const startedCounts = {};
      const finishedCounts = {};
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);

        // Format as YYYY-MM-DDT00:00:00
        const format = (date) => date.toISOString().split(".")[0];
        const startDate = format(start);

        // Fetch started in this month
        try { 
          const response = await axios.get(
            `/service?startDate=${startDate}`,
            { headers: { Authorization: `Bearer ${userToken}` } }
          );
          startedCounts[start.getMonth() + 1] = Array.isArray(response.data)
            ? response.data.length
            : 0;
        } catch (error) {
          startedCounts[start.getMonth() + 1] = 0;
        }

        // Fetch finished in this month
        try { 
          const response = await axios.get(
            `/service?endDate=${startDate}`,
            { headers: { Authorization: `Bearer ${userToken}` } }
          );
          finishedCounts[start.getMonth() + 1] = Array.isArray(response.data)
            ? response.data.length
            : 0;
        } catch (error) {
          finishedCounts[start.getMonth() + 1] = 0;
        }
      }
      setStartedPerMonth(startedCounts);
      setFinishedPerMonth(finishedCounts);
    };
  fetchServices();
  }, []);

  const statsCards = [
    {
      category: "Priority Low",
      footer: "See now",
      color: "DeepSkyBlue",
      data: counts.Low,
    },
    {
      category: "Priority Medium",
      footer: "See now",
      color: "gold",
      data: counts.Medium,
    },
    {
      category: "Priority High",
      footer: "See now",
      color: "orange",
      data: counts.High,
    },
    {
      category: "Priority Urgent",
      footer: "See now",
      color: "red",
      data: counts.Urgent,
    },
  ];

  const nowData = new Date();
  const monthse = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(nowData.getFullYear(), nowData.getMonth() - (5 - i), 1);
    return d.getMonth() + 1;
  });

  const startedSeries = monthse.map(month => startedPerMonth[month] || 0);
  const finishedSeries = monthse.map(month => finishedPerMonth[month] || 0);

  const redirectToServicePriority = (priority) => {
    window.location.href = `/admin/service?priority=${priority}`;
  }

  return (
    <Container fluid>
      <Row>
        {statsCards.map((card, index) => (
          <Col lg="3" sm="6" key={index}>
            <Card className="card-stats">
              <Card.Body>
                <Row className="d-flex justify-content-center">
                  <Col xs="6">
                    <div className="numbers text-center">
                      <p className="card-category" style={{color: card.color}}>{card.category}</p>
                      <Card.Title as="h4">{card.data}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="text-center">
                <hr />
                {/* TODO: meter este onClick a funcionar */}
                <div className="stats" onClick={() => redirectToServicePriority(card.category.replace("Priority ", ""))}> 
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
              <Card.Title as="h4">Number of open tickets</Card.Title>
              <p className="card-category">6 Months performance</p>
            </Card.Header>
            <Card.Body>
              <ChartistGraph
                data={{
                  labels: labels,
                  series: [startedSeries, finishedSeries],
                }}
                type="Line"
                options={{
                  low: 0,
                  high: Math.max(...startedSeries, ...finishedSeries, 10),
                  showArea: false,
                  height: "245px",
                  axisX: { showGrid: false },
                  lineSmooth: true,
                  showLine: true,
                  showPoint: true,
                  fullWidth: true,
                  chartPadding: { right: 50 },
                  axisY: {
                    onlyInteger: true,
                    labelInterpolationFnc: function(value) {
                      return Number.isInteger(value) ? value : null;
                    }
                  }
                }}
                
              />
              <div style={{ display: "flex", gap: "1em", marginTop: "10px" }}>
                <span>
                  <span style={{
                    display: "inline-block",
                    width: 16,
                    height: 4,
                    background: "#28CAF5", // Chartist default first line color
                    marginRight: 6,
                    verticalAlign: "middle"
                  }}></span>
                  Started
                </span>
                <span>
                  <span style={{
                    display: "inline-block",
                    width: 16,
                    height: 4,
                    background: "#D63546", // Chartist default second line color
                    marginRight: 6,
                    verticalAlign: "middle"
                  }}></span>
                  Finished
                </span>
              </div>
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