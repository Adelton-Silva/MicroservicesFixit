import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaKey, FaUserCog, FaPen, FaTrash } from "react-icons/fa";
import '../assets/css/app.css';
//import EditServiceModal from "./EditServiceModal";

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
} from "react-bootstrap";

function ServiceTable() {
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  // NEW STATE: To hold the message for the delete confirmation modal
  const [deleteMessage, setDeleteMessage] = useState("");

  console.log("selectedService no render:", selectedService);
  console.log("showEditModal:", showEditModal);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("Token JWT não encontrado no localStorage!");
      setLoading(false);
      return;
    }

    const fetchServices = axios.get("/service?pageNumber=1&pageSize=10", {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const fetchUsers = axios.get("/users?pageNumber=1&pageSize=10", {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    Promise.all([fetchServices, fetchUsers])
      .then(([servicesResponse, usersResponse]) => {
        const servicesData = Array.isArray(servicesResponse.data)
          ? servicesResponse.data
          : servicesResponse.data.data || [];

        const mappedServices = servicesData.map(service => ({
          id: service.id,
          priority: service.priority,
          category: service.category,
          companyName: service.companyName,
          machine: service.machine,
          workerId: service.workerId,
          status: service.status,
          description: service.description || "",
        }));

        setServices(mappedServices);

        const usersData = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data.data || [];

        setUsers(usersData);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error.response ? error.response.data : error.message);
        // Display a general error message if fetching fails
        setDeleteMessage("Failed to load services. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getUsernameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown Technician';
  };

  const handlePermission = (service) => {
    console.log("Permissões para:", service);
  };

  const handleAssign = (service) => {
    console.log("Atribuir técnico a:", service);
  };

  const handleEdit = (service) => {
    console.log("Editar serviço:", service);
    if (!service) {
      console.error("Service inválido no handleEdit", service);
      return;
    }
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDelete = (service) => {
    setServiceToDelete(service); // Store the service to be deleted
    setDeleteMessage(""); // Clear any previous messages
    setShowDeleteConfirmModal(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        setDeleteMessage("User token not found. Please log in again.");
        return;
      }

      await axios.delete(`/service/${serviceToDelete.id}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      setServices(prevServices => prevServices.filter(s => s.id !== serviceToDelete.id));
      // Set the success message to display in the modal
      setDeleteMessage(`Service ID ${serviceToDelete.id} deleted successfully.`);
      // Optionally, you might want to close the modal after a short delay
      // Or make the "Eliminar" button disappear and show a "Fechar" button
      // For now, it will remain open with the message until user closes it
    } catch (error) {
      console.error("Error deleting service:", error.response ? error.response.data : error.message);
      // Set the error message to display in the modal
      setDeleteMessage(`Failed to delete service ID ${serviceToDelete.id}. Please try again.`);
    }
    // No finally block to keep the message visible until manually closed
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setServiceToDelete(null);
    setDeleteMessage(""); // Clear message when modal is closed
  };

  const handleSaveEdit = (id, updatedData) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, ...updatedData } : service
      )
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">Services</Card.Title>
              <p className="card-category">Services List</p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Priority</th>
                      <th>Category</th>
                      <th>Client</th>
                      <th>Machine</th>
                      <th>Technician</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">No services found.</td>
                      </tr>
                    ) : (
                      services.map((service) => (
                        <tr key={service.id}>
                          <td>{service.id}</td>
                          <td>{service.priority}</td>
                          <td>{service.category}</td>
                          <td>{service.companyName}</td>
                          <td>{service.machine?.type}</td>
                          <td>{getUsernameById(service.workerId)}</td>
                          <td>{service.status}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                              <FaKey title="Permissões" style={{ cursor: 'pointer' }} onClick={() => handlePermission(service)} />
                              <FaUserCog title="Atribuir Técnico" style={{ cursor: 'pointer' }} onClick={() => handleAssign(service)} />
                              <FaPen title="Editar" style={{ cursor: 'pointer' }} onClick={() => handleEdit(service)} />
                              <FaTrash title="Apagar" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(service)} />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmModal}
        onHide={cancelDelete}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteMessage ? ( // Display message if it exists
            <p>{deleteMessage}</p>
          ) : ( // Otherwise, show the initial confirmation
            <>
              Are you sure you want to delete the  **{serviceToDelete?.companyName}** service?
              <br />
              This action cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {deleteMessage ? ( // If there's a message, only show a close button
            <Button variant="secondary" onClick={cancelDelete}>
              Close
            </Button>
          ) : ( // Otherwise, show confirm/cancel buttons
            <>
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ServiceTable;