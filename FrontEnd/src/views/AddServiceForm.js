import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal
} from "react-bootstrap";

function AddServiceForm() {
  const [formData, setFormData] = useState({
    clientId: "",
    priority: "",
    category: "",
    machine: "",
    workerId: "",
    observation: "",
    dateStarted: "",
    dateFinished: "",
  });

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const priorities = ["Urgent", "Medium", "Low", "High"];
  const categories = ["Preventive maintenance", "Corrective maintenance"];
  const [machines, setMachines] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackModalTitle, setFeedbackModalTitle] = useState("");
  const [feedbackModalMessage, setFeedbackModalMessage] = useState("");
  const [feedbackModalVariant, setFeedbackModalVariant] = useState("success");

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("JWT token not found in localStorage! Please log in.");
      setLoading(false);
      setFeedbackModalTitle("Authentication Error");
      setFeedbackModalMessage("User token not found. Please log in again.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    const fetchUsers = axios.get("/users?pageNumber=1&pageSize=10", config);
    const fetchClients = axios.get("/company?pageNumber=1&pageSize=10", config);
    const fetchMachines = axios.get("/machine?pageNumber=1&pageSize=10", config);

    Promise.all([fetchUsers, fetchClients, fetchMachines])
      .then(([usersResponse, clientsResponse, machinesResponse]) => {
        console.log("Users data received:", usersResponse.data);
        console.log("Clients (Company) data received:", clientsResponse.data);
        console.log("Machines (Machine) data received:", machinesResponse.data);

        setUsers(usersResponse.data.items || []);
        setClients(clientsResponse.data || []);
        setMachines(machinesResponse.data || []);
      })
      .catch((error) => {
        console.error("Error fetching form data:", error.response ? error.response.data : error.message);
        setFeedbackModalTitle("Loading Error");
        setFeedbackModalMessage("Failed to load form data. Please try again later.");
        setFeedbackModalVariant("danger");
        setShowFeedbackModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowFeedbackModal(false);
    setFeedbackModalTitle("");
    setFeedbackModalMessage("");
    setFeedbackModalVariant("success");

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      console.error("JWT token not found!");
      setFeedbackModalTitle("Authentication Error");
      setFeedbackModalMessage("User token not found. Please log in again.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
      return;
    }

    // Validação de datas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = formData.dateStarted ? new Date(formData.dateStarted) : null;
    const endDate = formData.dateFinished ? new Date(formData.dateFinished) : null;

    if (startDate && startDate < today) {
      setFeedbackModalTitle("Validation Error");
      setFeedbackModalMessage("Start date must be today or in the future.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      setFeedbackModalTitle("Validation Error");
      setFeedbackModalMessage("End date must be the same or later than the start date.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
      return;
    }

    try {
      const servicePayload = {
        company_id: formData.clientId === "" ? null : parseInt(formData.clientId),
        priority: formData.priority,
        category: formData.category,
        PartsId: null,
        worker_id: formData.workerId === "" ? null : parseInt(formData.workerId),
        machine_id: formData.machine === "" ? null : parseInt(formData.machine),
        status_id: 1,
        description: formData.observation,
        date_started: formData.dateStarted ? new Date(formData.dateStarted).toISOString() : null,
        date_finished: formData.dateFinished ? new Date(formData.dateFinished).toISOString() : null,
      };

      console.log("Payload to be submitted:", servicePayload);

      const response = await axios.post(
        "/service",
        servicePayload,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      console.log("Service created successfully:", response.data);
      setFeedbackModalTitle("Success");
      setFeedbackModalMessage("Service added successfully!");
      setFeedbackModalVariant("success");
      setShowFeedbackModal(true);

      setFormData({
        clientId: "",
        priority: "",
        category: "",
        machine: "",
        workerId: "",
        observation: "",
        dateStarted: "",
        dateFinished: "",
      });

    } catch (error) {
      console.error("Error creating service:", error.response ? error.response.data : error.message);
      setFeedbackModalTitle("Error");
      setFeedbackModalMessage("Failed to add service. Please try again.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
    }
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackModalTitle("");
    setFeedbackModalMessage("");
  };

  if (loading) {
    return <p>Loading form...</p>;
  }

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">New Service</Card.Title>
              <p className="card-category">Add a new service</p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <label>Client</label>
                      <Form.Control
                        as="select"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a client</option>
                        {clients.length > 0 ? (
                          clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No clients found</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <label>Priority</label>
                      <Form.Control
                        as="select"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {priorities.map((p, index) => (
                          <option key={index} value={p}>
                            {p}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <label>Category</label>
                      <Form.Control
                        as="select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <label>Machine</label>
                      <Form.Control
                        as="select"
                        name="machine"
                        value={formData.machine}
                        onChange={handleChange}
                      >
                        <option value="">Select a machine</option>
                        {machines.length > 0 ? (
                          machines.map((machine) => (
                            <option key={machine.id} value={machine.id}>
                              {machine.type}
                            </option>
                          ))
                        ) : (
                          <option disabled>No machines found</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <label>Responsible Technician</label>
                      <Form.Control
                        as="select"
                        name="workerId"
                        value={formData.workerId}
                        onChange={handleChange}
                      >
                        <option value="">Select a technician</option>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.username}
                            </option>
                          ))
                        ) : (
                          <option disabled>No technicians found</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <label>Date Started</label>
                      <Form.Control
                        type="date"
                        name="dateStarted"
                        value={formData.dateStarted}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]} // Data mínima = hoje
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <label>Date Finished</label>
                      <Form.Control
                        type="date"
                        name="dateFinished"
                        value={formData.dateFinished}
                        onChange={handleChange}
                        min={formData.dateStarted || new Date().toISOString().split("T")[0]} // >= dateStarted ou hoje
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md="12">
                    <Form.Group className="mb-3">
                      <label>Description</label>
                      <Form.Control
                        as="textarea"
                        name="observation"
                        rows="4"
                        value={formData.observation}
                        onChange={handleChange}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  className="btn-fill pull-right mt-4"
                  type="submit"
                  style={{ backgroundColor: "#EE964B", borderColor: "#EE964B", color: "#fff" }}
                >
                  Save
                </Button>
                <div className="clearfix"></div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showFeedbackModal} onHide={handleCloseFeedbackModal} centered>
        <Modal.Header closeButton className={feedbackModalVariant === "danger" ? "bg-danger text-white" : "bg-success text-white"}>
          <Modal.Title>{feedbackModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{feedbackModalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={handleCloseFeedbackModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AddServiceForm;
