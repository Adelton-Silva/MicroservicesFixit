import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaKey, FaUserCog, FaPen, FaTrash, FaSort } from "react-icons/fa";
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Pagination
} from "react-bootstrap";
import EditUserModal from './EditUser';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationVariant, setNotificationVariant] = useState("success");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      setNotificationTitle("Authentication Error");
      setNotificationMessage("JWT Token not found. Please log in again.");
      setNotificationVariant("danger");
      setShowNotificationModal(true);
      setLoading(false);
      return;
    }

    axios.get(`/users?pageNumber=${page}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      }
    })
    .then(response => {
      setUsers(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      setNotificationTitle("Error");
      setNotificationMessage("Failed to fetch users.");
      setNotificationVariant("danger");
      setShowNotificationModal(true);
    })
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, sortField, sortOrder]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      await axios.delete(`/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setNotificationTitle("Deleted");
      setNotificationMessage("User deleted successfully.");
      setNotificationVariant("success");
    } catch (error) {
      setNotificationTitle("Error");
      setNotificationMessage("Failed to delete user.");
      setNotificationVariant("danger");
    } finally {
      setShowDeleteConfirmModal(false);
      setShowNotificationModal(true);
    }
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col md="6">
          <h4>User Management</h4>
        </Col>
        <Col md="6">
          <InputGroup>
            <Form.Control
              placeholder="Search by username or email"
              value={search}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("username")}>
                      Username <FaSort />
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("email")}>
                      Email <FaSort />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="4">No users found.</td></tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <FaKey title="Permissions" style={{ cursor: 'pointer' }} />
                            <FaUserCog title="Assign Technician" style={{ cursor: 'pointer' }} />
                            <FaPen title="Edit" style={{ cursor: 'pointer' }} onClick={() => handleEdit(user)} />
                            <FaTrash title="Delete" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(user)} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Pagination with numbers */}
              <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} />
                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages} />
              </Pagination>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modais */}
      <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user <strong>{userToDelete?.username}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered>
        <Modal.Header closeButton className={`bg-${notificationVariant} text-white`}>
          <Modal.Title>{notificationTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{notificationMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowNotificationModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <EditUserModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={selectedUser}
        onSave={fetchUsers}
      />
    </Container>
  );
}

export default UserTable;
