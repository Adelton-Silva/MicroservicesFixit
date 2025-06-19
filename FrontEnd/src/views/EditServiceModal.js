import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
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
// import '../assets/css/app.css';

function EditServiceModal({ show, onHide, service, onSave }) {
  const [formData, setFormData] = useState({
    clientId: "",
    priority: "",
    category: "",
    machine: "",
    workerId: "",
    statusId: "",
    observation: "",
  });

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const priorities = ["Urgent", "Medium", "Low", "High"];
  const categories = ["Preventive maintenance", "Corrective maintenance"];
  const [machines, setMachines] = useState([]);
  const [statuses, setStatuses] = useState([]);

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

    Promise.all([
      axios.get("/users?pageNumber=1&pageSize=10", config),
      axios.get("/company?pageNumber=1&pageSize=10", config),
      axios.get("/machine?pageNumber=1&pageSize=10", config),
      axios.get("/status?pageNumber=1&pageSize=10", config)
    ])
      .then(([usersResponse, clientsResponse, machinesResponse, statusesResponse]) => {
        setUsers(usersResponse.data.items || []);
        setClients(clientsResponse.data || []);
        setMachines(machinesResponse.data || []);
        setStatuses(statusesResponse.data || []);

          console.log("Loaded statuses for dropdown:", statusesResponse.data);
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

  useEffect(() => {
    if (service) {
      setFormData({
        clientId: service.companyId || "",
        priority: service.priority || "",
        category: service.category || "",
        machine: service.machineId || "",
        workerId: service.workerId ? String(service.workerId) : "",
        statusId: service.statusId !== null && service.statusId !== undefined ? String(service.statusId) : "",
        observation: service.description || "",
      });
    } else {
      setFormData({
        clientId: "",
        priority: "",
        category: "",
        machine: "",
        workerId: "",
        statusId: "",
        observation: "",
      });
    }
  }, [service]);

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

    try {
      const updatedServicePayload = {
        companyId: formData.clientId === "" ? null : parseInt(formData.clientId),
        priority: formData.priority,
        category: formData.category,
        PartsId: null,
        workerId: formData.workerId === "" ? null : parseInt(formData.workerId),
        machineId: formData.machine === "" ? null : parseInt(formData.machine),
        statusId: formData.statusId === "" ? null : parseInt(formData.statusId),
        description: formData.observation,
      };

      console.log("Payload to be updated:", updatedServicePayload);

      const response = await axios.patch(
        `/service/${service.id}`,
        updatedServicePayload,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      console.log("Service updated successfully:", response.data);

      // --- MUDANÇA AQUI: Exibir o modal de sucesso e atrasar o fechamento do modal principal ---
      setFeedbackModalTitle("Success");
      setFeedbackModalMessage("Service updated successfully!");
      setFeedbackModalVariant("success");
      setShowFeedbackModal(true); // Mostrar a modal de feedback

      // Opcional: Você pode querer fechar a modal principal de edição APENAS após o feedback
      // Se onHide fecha a modal de edição principal, vamos atrasar a chamada
      setTimeout(() => {
        const updatedStatusDescription = statuses.find(s => s.id === parseInt(formData.statusId))?.description || service.status;
        onSave(service.id, {
          ...service,
          ...updatedServicePayload,
          companyName: clients.find(c => c.id === parseInt(formData.clientId))?.name || service.companyName,
          machine: machines.find(m => m.id === parseInt(formData.machine)) || service.machine,
          status: updatedStatusDescription
        });
        onHide(); // Fecha a modal de edição APÓS o feedback ser mostrado por um tempo
      }, 1500); // Exibe o feedback por 1.5 segundos antes de fechar a modal de edição
      // ---------------------------------------------------------------------------------------

    } catch (error) {
      console.error("Error updating service:", error.response ? error.response.data : error.message);
      setFeedbackModalTitle("Error");
      setFeedbackModalMessage("Failed to update service. Please try again.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true); // Mostrar a modal de feedback de erro
    }
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackModalTitle("");
    setFeedbackModalMessage("");
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Loading Service Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Loading form data. Please wait...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Service ({service?.companyName})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              <Col md="6">
                <Form.Group className="mb-3">
                  <label>Status</label>
                  <Form.Control
                    as="select"
                    name="statusId"
                    value={formData.statusId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a status</option>
                    {statuses.length > 0 ? (
                      statuses.map((status) => (
                        <option key={status.id} value={String(status.id)}>
                          {status.description}
                        </option>
                      ))
                    ) : (
                      <option disabled>No statuses found</option>
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
              Save Changes
            </Button>
            <div className="clearfix"></div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Feedback Modal for success/error messages */}
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
    </>
  );
}

EditServiceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
    companyId: PropTypes.number,
    priority: PropTypes.string,
    category: PropTypes.string,
    machineId: PropTypes.number,
    workerId: PropTypes.number,
    companyName: PropTypes.string,
    statusId: PropTypes.number,
    status: PropTypes.string, // This is the string description from ServiceTable
    description: PropTypes.string,
    machine: PropTypes.object, // Added machine to propTypes
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditServiceModal;