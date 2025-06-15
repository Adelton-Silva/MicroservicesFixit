import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal // Import Modal
} from "react-bootstrap";
// import '../assets/css/app.css'; // Assuming your CSS is here and being used

function AddServiceForm() {
  // State for form data
  const [formData, setFormData] = useState({
    clientId: "",      // Maps to company ID
    priority: "",      // Service priority
    category: "",      // Service category (preventive/corrective maintenance)
    machine: "",       // Maps to machine ID
    workerId: "",      // Maps to responsible technician ID
    observation: "",   // Service observations (description in payload)
  });

  // States for dropdown data
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const priorities = ["Urgent", "Medium", "Low"];
  const categories = ["Preventive maintenance", "Corrective maintenance"];
  const [machines, setMachines] = useState([]);

  // States for UI control (loading and submission status)
  const [loading, setLoading] = useState(true);
  // Replaced submissionStatus with modal-specific states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackModalTitle, setFeedbackModalTitle] = useState("");
  const [feedbackModalMessage, setFeedbackModalMessage] = useState("");
  const [feedbackModalVariant, setFeedbackModalVariant] = useState("success"); // 'success' or 'danger'

  // Effect to fetch initial dropdown data on component mount
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("JWT token not found in localStorage! Please log in.");
      setLoading(false);
      // Show error in modal if token is missing
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
        // --- LOGS FOR DEBUGGING (can be removed later) ---
        console.log("Users data received:", usersResponse.data);
        console.log("Clients (Company) data received:", clientsResponse.data);
        console.log("Machines (Machine) data received:", machinesResponse.data);

        setUsers(usersResponse.data.items || []);
        setClients(clientsResponse.data || []);
        setMachines(machinesResponse.data || []);
      })
      .catch((error) => {
        console.error("Error fetching form data:", error.response ? error.response.data : error.message);
        // Show error in modal if initial data fetch fails
        setFeedbackModalTitle("Loading Error");
        setFeedbackModalMessage("Failed to load form data. Please try again later.");
        setFeedbackModalVariant("danger");
        setShowFeedbackModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handler for form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset modal states before new submission
    setShowFeedbackModal(false);
    setFeedbackModalTitle("");
    setFeedbackModalMessage("");
    setFeedbackModalVariant("success"); // Default to success

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      console.error("JWT token not found!");
      setFeedbackModalTitle("Authentication Error");
      setFeedbackModalMessage("User token not found. Please log in again.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
      return;
    }

    try {
      const servicePayload = {
        companyId: formData.clientId === "" ? null : parseInt(formData.clientId),
        priority: formData.priority,
        category: formData.category,
        PartsId: null, // As per your existing code
        workerId: formData.workerId === "" ? null : parseInt(formData.workerId),
        machineId: formData.machine === "" ? null : parseInt(formData.machine),
        date_started: new Date().toISOString().split('T')[0],
        statusId: 1, // As per your existing code
        description: formData.observation,
      };

      console.log("Payload to be submitted:", servicePayload);

      const response = await axios.post(
        "/service",
        servicePayload,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      console.log("Service created successfully:", response.data);
      // Set success message for modal
      setFeedbackModalTitle("Success");
      setFeedbackModalMessage("Service added successfully!");
      setFeedbackModalVariant("success");
      setShowFeedbackModal(true);

      // Reset the form after successful submission
      setFormData({
        clientId: "",
        priority: "",
        category: "",
        machine: "",
        workerId: "",
        observation: "",
      });

    } catch (error) {
      console.error("Error creating service:", error.response ? error.response.data : error.message);
      // Set error message for modal
      setFeedbackModalTitle("Error");
      setFeedbackModalMessage("Failed to add service. Please try again.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
    }
  };

  // Handler to close the feedback modal
  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    // Optionally clear message and title here if not done before opening
    setFeedbackModalTitle("");
    setFeedbackModalMessage("");
  };

  // Display loading message while dropdown data is being fetched
  if (loading) {
    return <p>Loading form...</p>;
  }

  // Render the form
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

      {/* Feedback Modal */}
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