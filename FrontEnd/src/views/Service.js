import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaKey, FaUserCog, FaPen, FaTrash } from "react-icons/fa";
import '../assets/css/app.css';

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function ServiceTable() {
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]); // <--- NEW: State to store users
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("Token JWT não encontrado no localStorage!");
      setLoading(false);
      return;
    }

    const fetchServices = axios.get("http://localhost:3000/api/service?pageNumber=1&pageSize=10", {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    // <--- NEW: Fetch users as well
    const fetchUsers = axios.get("http://localhost:3000/api/users?pageNumber=1&pageSize=10", { 
      headers: { Authorization: `Bearer ${userToken}` },
    });

    Promise.all([fetchServices, fetchUsers]) // Wait for both requests to complete
      .then(([servicesResponse, usersResponse]) => {
        console.log("Resposta de Serviços:", servicesResponse.data);
        console.log("Resposta de Utilizadores:", usersResponse.data);

        // Adjust based on actual API response for services
        setServices(Array.isArray(servicesResponse.data) ? servicesResponse.data : servicesResponse.data.data || []);

        // <--- NEW: Set users. Assuming users API returns a direct array.
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.data || []);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error.response ? error.response.data : error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array means it runs once on mount

  // <--- NEW: Helper function to get username by ID
  const getUsernameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown Technician'; // Fallback if user not found
  };

  const handlePermission = (service) => {
    console.log("Permissões para:", service);
  };

  const handleAssign = (service) => {
    console.log("Atribuir técnico a:", service);
  };

  const handleEdit = (service) => {
    console.log("Editar:", service);
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Are you sure you want to delete the service ID ${service.id}?`)) {
      try {
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
          alert("User token not found. Please log in again.");
          return;
        }

        await axios.delete(`http://localhost:3000/api/service/${service.id}`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });

        // Atualiza a lista removendo o serviço apagado
        setServices(prevServices => prevServices.filter(s => s.id !== service.id));
        alert(`Service ID ${service.id} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting service:", error.response ? error.response.data : error.message);
        alert("Failed to delete service. Please try again.");
      }
    }
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
                      <th className="border-0" >ID</th>
                      <th className="border-0" >Priority</th>
                      <th className="border-0">Category</th>
                      <th className="border-0">Client</th>
                      <th className="border-0">Machine</th>
                      <th className="border-0">Technician Responsable</th>
                      <th className="border-0">Status</th>
                      <th className="border-0" >Actions</th>
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
    </Container>
  );
}

export default ServiceTable;
