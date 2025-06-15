import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaKey, FaUserCog, FaPen, FaTrash } from "react-icons/fa";
import '../assets/css/app.css';
import EditServiceModal from "./EditServiceModal";
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
} from "react-bootstrap";

function ServiceHistory() {
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [machines, setMachines] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("JWT token not found in localStorage! Please log in.");
      setLoading(false);
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    Promise.all([
      axios.get("/service?pageNumber=1&pageSize=10", config),
      axios.get("/users?pageNumber=1&pageSize=10", config),
      axios.get("/company?pageNumber=1&pageSize=10", config),
      axios.get("/machine?pageNumber=1&pageSize=10", config),
      axios.get("/status?pageNumber=1&pageSize=10", config)
    ])
      .then(([servicesResponse, usersResponse, clientsResponse, machinesResponse, statusesResponse]) => {
        const servicesData = Array.isArray(servicesResponse.data)
          ? servicesResponse.data
          : servicesResponse.data.data || [];

        const mappedServices = servicesData.map(service => ({
          id: service.id,
          priority: service.priority,
          category: service.category,
          companyId: service.companyId,
          companyName: service.companyName,
          machineId: service.machine?.id,
          machine: service.machine,
          workerId: service.workerId,
          statusId: service.statusId,
          status: typeof service.status === 'string' ? service.status : service.status?.description || 'No Status',
          description: service.description || "",
        }));

        setServices(mappedServices);
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.data || []);
        setClients(clientsResponse.data || []);
        setMachines(machinesResponse.data || []);
        setStatuses(statusesResponse.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
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
    console.log("Permissions for:", service);
  };

  const handleAssign = (service) => {
    console.log("Assign technician to:", service);
  };

  const handleEdit = (service) => {
    if (!service || !service.id) {
      console.error("Cannot edit: Invalid service object or missing ID.", service);
      return;
    }
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDelete = (service) => {
    setServiceToDelete(service);
    setDeleteMessage("");
    setShowDeleteConfirmModal(true);
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
      setDeleteMessage(`Service for company "${serviceToDelete.companyName}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting service:", error.response ? error.response.data : error.message);
      setDeleteMessage(`Failed to delete service for company "${serviceToDelete.companyName}". Please try again.`);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setServiceToDelete(null);
    setDeleteMessage("");
  };

  const handleSaveEdit = (id, updatedData) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id
          ? {
            ...service,
            ...updatedData,
            companyName: clients.find(c => c.id === updatedData.companyId)?.name || service.companyName,
            machine: machines.find(m => m.id === updatedData.machineId) || service.machine,
            status: statuses.find(s => s.id === parseInt(updatedData.statusId))?.description || 'No Status',
            statusId: parseInt(updatedData.statusId) || null,
            workerId: updatedData.workerId,
            description: updatedData.description
          }
          : service
      )
    );
    setShowEditModal(false);
    setSelectedService(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedService(null);
  };

  const filteredServices = services.filter(service => parseInt(service.statusId) == 2);

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
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">No services found.</td>
                      </tr>
                    ) : (
                      filteredServices.map((service) => (
                        <tr key={service.id}>
                          <td>{service.id}</td>
                          <td>{service.priority}</td>
                          <td>{service.category}</td>
                          <td>{service.companyName}</td>
                          <td>{service.machine?.type || 'N/A'}</td>
                          <td>{getUsernameById(service.workerId)}</td>
                          <td>{service.status}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                              <FaPen title="Edit" style={{ cursor: 'pointer' }} onClick={() => handleEdit(service)} />
                              <FaTrash title="Delete" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(service)} />
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
          {deleteMessage ? (
            <p>{deleteMessage}</p>
          ) : (
            <>
              Are you sure you want to delete the service for company <strong>{serviceToDelete?.companyName}</strong>?
              <br />
              This action cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer className={deleteMessage ? "justify-content-center" : ""}>
          {deleteMessage ? (
            <Button variant="secondary" onClick={cancelDelete}>
              Close
            </Button>
          ) : (
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

      {/* Edit Service Modal */}
      {selectedService && (
        <EditServiceModal
          show={showEditModal}
          onHide={handleCloseEditModal}
          service={selectedService}
          onSave={handleSaveEdit}
        />
      )}
    </Container>
  );
}

export default ServiceHistory;
