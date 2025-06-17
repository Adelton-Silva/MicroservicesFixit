import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
import {
  Card,
  Container,
  Row,
  Col,
  Spinner
} from "react-bootstrap";
import axios from "axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    Low: 0,
    Medium: 0,
    High: 0,
    Urgent: 0,
  });
  const [startedPerMonth, setStartedPerMonth] = useState({});
  const [finishedPerMonth, setFinishedPerMonth] = useState({});
  const [priorityThisMonth, setPriorityThisMonth] = useState({});
  const [serviceByWorker, setServiceByWorker] = useState({});
  const [workers, setWorkers] = useState([]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const getLastMonths = (n) => {
    const now = new Date();
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - (n - 1 - i), 1));
      return monthNames[d.getMonth()];
    });
  };
  const labels = getLastMonths(6);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      setLoading(false);
      return;
    }

    const fetchCounts = async () => {
      const priorities = ["Low", "Medium", "High", "Urgent"];
      const newCounts = {};
      for (const priority of priorities) {
        try {
          const response = await axios.get(`/service?priority=${priority}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          newCounts[priority] = Array.isArray(response.data.data) ? response.data.data.length : 0;
          console.log("Counts for", priority, ":", newCounts[priority]);
        } catch {
          newCounts[priority] = 0;
        }
      }
      setCounts(newCounts);
      setLoading(false);
    };
    fetchCounts();
  }, []);


  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      const startedCounts = {};
      const finishedCounts = {};
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const start = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
        const format = (date) => date.toISOString().split(".")[0];
        const startDate = format(start);

        try {
          const res = await axios.get(`/service?startDate=${startDate}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          startedCounts[start.getMonth() + 1] = Array.isArray(res.data.data) ? res.data.data.length : 0;
        } catch {
          startedCounts[start.getMonth() + 1] = 0;
        }

        try {
          const res = await axios.get(`/service?endDate=${startDate}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          finishedCounts[start.getMonth() + 1] = Array.isArray(res.data.data) ? res.data.data.length : 0;
        } catch {
          finishedCounts[start.getMonth() + 1] = 0;
        }
      }

      setStartedPerMonth(startedCounts);
      setFinishedPerMonth(finishedCounts);
      setLoading(false);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      setLoading(false);
      return;
    }

    const fetchPriorityStats = async () => {
      const now = new Date();
      const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
      const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0));
      const format = (date) => date.toISOString().split(".")[0];
      const startDate = format(start);
      const endDate = format(end);

      try {
        const res = await axios.get(`/service?startDate=${startDate}&endDate=${endDate}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        const total = data.length;

        const counts = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
        data.forEach(service => {
          if (counts[service.priority] !== undefined) {
            counts[service.priority]++;
          }
        });

        const percentages = {};
        Object.keys(counts).forEach(priority => {
          percentages[priority] = total > 0 ? (counts[priority] / total) * 100 : 0;
        });

        setPriorityThisMonth(percentages);
      } catch {
        setPriorityThisMonth({ Low: 0, Medium: 0, High: 0, Urgent: 0 });
      }
      setLoading(false);
    };
    fetchPriorityStats();
  }, []);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      setLoading(false);
      return;
    }

    const fetchServicesByWorker = async () => {
      const ticketByWorker = {};
      const format = (date) => date.toISOString().split(".")[0];
      const now = new Date();
      const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
      const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0));
      const startDate = format(start);
      const endDate = format(end);

      try {
        const userResponse = await axios.get('/users', {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        const userData = Array.isArray(userResponse.data.items) ? userResponse.data.items : [];

        await Promise.all(
          userData.map(async (user) => {
            const res = await axios.get(
              `/service?startDate=${startDate}&endDate=${endDate}&worker_id=${user.id}`,
              { headers: { Authorization: `Bearer ${userToken}` } }
            );
            ticketByWorker[user.id] = Array.isArray(res.data.items) ? res.data.items.length : 0;
          })
        );

        setServiceByWorker(ticketByWorker);
        setWorkers(userData);
      } catch {
        setServiceByWorker({});
      }
      setLoading(false);
    };
    fetchServicesByWorker();
  }, []);

  const statsCards = [
    { category: "Priority Low", footer: "See now", color: "DeepSkyBlue", data: counts.Low },
    { category: "Priority Medium", footer: "See now", color: "gold", data: counts.Medium },
    { category: "Priority High", footer: "See now", color: "orange", data: counts.High },
    { category: "Priority Urgent", footer: "See now", color: "red", data: counts.Urgent },
  ];

  const nowData = new Date();
  const monthse = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(nowData.getFullYear(), nowData.getMonth() - (5 - i), 1);
    return d.getMonth() + 1;
  });

  const startedSeries = monthse.map(month => startedPerMonth[month] || 0);
  const finishedSeries = monthse.map(month => finishedPerMonth[month] || 0);

  const pieData = [
    { label: `${(priorityThisMonth.Low || 0).toFixed(1)}%`, value: Number(priorityThisMonth.Low), name: "Low" },
    { label: `${(priorityThisMonth.Medium || 0).toFixed(1)}%`, value: Number(priorityThisMonth.Medium), name: "Medium" },
    { label: `${(priorityThisMonth.High || 0).toFixed(1)}%`, value: Number(priorityThisMonth.High), name: "High" },
    { label: `${(priorityThisMonth.Urgent || 0).toFixed(1)}%`, value: Number(priorityThisMonth.Urgent), name: "Urgent" }
  ].filter(item => item.value > 0);

  const pieLabels = pieData.map(item => item.label);
  const pieSeries = pieData.map(item => item.value);

  const redirectToServicePriority = (priority) => {
    window.location.href = `/admin/service?priority=${priority}`;
  };

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
                      <p className="card-category" style={{ color: card.color }}>{card.category}</p>
                      {loading ? <Spinner animation="border" size="sm" /> : <Card.Title as="h4">{card.data}</Card.Title>}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="text-center">
                <hr />
                <div
                  className="stats"
                  style={{ cursor: "pointer" }}
                  onClick={() => redirectToServicePriority(card.category.replace("Priority ", ""))}
                > 
                  <i className="nc-icon nc-tap-01" style={{ marginRight: "5px" }}></i>{card.footer}
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
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 245 }}>
                  <Spinner animation="border" />
                </div>
              ) : (
                <ChartistGraph
                  data={{ labels, series: [startedSeries, finishedSeries] }}
                  type="Line"
                  options={{
                    low: 0,
                    high: Math.max(...startedSeries, ...finishedSeries, 10),
                    height: "245px",
                    axisX: { showGrid: false },
                    lineSmooth: true,
                    showLine: true,
                    showPoint: true,
                    fullWidth: true,
                    chartPadding: { right: 50 },
                    axisY: {
                      onlyInteger: true,
                      labelInterpolationFnc: (value) => Number.isInteger(value) ? value : null,
                    },
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md="4">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Service Priority</Card.Title>
              <p className="card-category">This month performance</p>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 245 }}>
                  <Spinner animation="border" />
                </div>
              ) : (
                <ChartistGraph data={{ labels: pieLabels, series: pieSeries }} type="Pie" />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
