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

function ServiceTable() {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

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
      axios.get(`/service?pageNumber=${currentPage}&pageSize=${pageSize}&excludeStatusId=3`, config),
      axios.get("/users?pageNumber=1&pageSize=100", config),
      axios.get("/company?pageNumber=1&pageSize=100", config),
      axios.get("/machine?pageNumber=1&pageSize=100", config),
      axios.get("/status?pageNumber=1&pageSize=100", config)
    ])
      .then(([servicesResponse, usersResponse, clientsResponse, machinesResponse, statusesResponse]) => {
        const servicesData = Array.isArray(servicesResponse.data.data)
          ? servicesResponse.data.data
          : [];

        setTotalPages(servicesResponse.data.totalPages || 1);

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
        setUsers(usersResponse.data.items || []);
        setClients(clientsResponse.data.items || []);
        setMachines(machinesResponse.data.items || []);
        setStatuses(statusesResponse.data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

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
    if (!service || !service.id) return;
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

      setServices(prev => prev.filter(s => s.id !== serviceToDelete.id));
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
                <>
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
                            <td>{service.machine?.type || 'N/A'}</td>
                            <td>{getUsernameById(service.workerId)}</td>
                            <td>{service.status}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <FaKey title="Permissions" style={{ cursor: 'pointer' }} onClick={() => handlePermission(service)} />
                                <FaUserCog title="Assign Technician" style={{ cursor: 'pointer' }} onClick={() => handleAssign(service)} />
                                <FaPen title="Edit" style={{ cursor: 'pointer' }} onClick={() => handleEdit(service)} />
                                <FaTrash title="Delete" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(service)} />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>

                  <div className="d-flex justify-content-between align-items-center px-3 pb-3">
                    <Button
                      variant="outline-primary"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline-primary"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

export default ServiceTable;