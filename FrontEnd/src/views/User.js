// src/views/UserTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";
// Certifique-se de que 'react-icons' está instalado: npm install react-icons
import { FaKey, FaUserCog, FaPen, FaTrash } from "react-icons/fa";

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Modal, // Import Modal
  Button, // Import Button
} from "react-bootstrap";

// Importar o componente EditUserModal
// Certifique-se de que 'EditUserModal.js' está na mesma pasta.
import EditUserModal from './EditUser';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for the delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // States for the notification modal (success/error)
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationVariant, setNotificationVariant] = useState("success"); // 'success' or 'danger'

  // New states for the user edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Stores the user selected for editing

  // Function to fetch users
  const fetchUsers = () => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("JWT Token not found in localStorage!");
      setLoading(false);
      // Display a notification to the user if the token is missing
      setNotificationTitle("Authentication Error");
      setNotificationMessage("JWT Token not found. Please log in again.");
      setNotificationVariant("danger");
      setShowNotificationModal(true);
      return;
    }

    axios
      .get("/users?pageNumber=1&pageSize=10", { // Adjusted for full URL clarity
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      .then((response) => {
        console.log("Backend response (Users):", response.data);
        // Ensure the response is treated as an array, if necessary
        const usersData = Array.isArray(response.data) ? response.data : response.data.data || [];
        setUsers(usersData);
      })
      .catch((error) => {
        console.error("Error fetching Users:", error.response ? error.response.data : error.message);
        setNotificationTitle("Error Fetching Users");
        setNotificationMessage("Something went wrong. Please try again.");
        setNotificationVariant("danger");
        setShowNotificationModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers(); // Calls the fetch function on component mount
  }, []);

  // Function to open the delete confirmation modal
  const handleDelete = (user) => {
    setUserToDelete(user); // Stores the user to be deleted
    setShowDeleteConfirmModal(true); // Opens the modal
  };

  // Function to confirm deletion
  const confirmDelete = async () => {
    if (!userToDelete) return; // Ensures there's a user to delete

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        setNotificationTitle("Authentication Error");
        setNotificationMessage("User token not found. Please log in again.");
        setNotificationVariant("danger");
        setShowNotificationModal(true);
        return;
      }

      // Change this URL to the actual user deletion endpoint
      await axios.delete(`/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      
      setNotificationTitle("Success!");
      setNotificationMessage(`User ${userToDelete.username} deleted successfully.`);
      setNotificationVariant("success");
      setShowNotificationModal(true);

    } catch (error) {
      console.error("Error deleting user:", error.response ? error.response.data : error.message);
      setNotificationTitle("Error Deleting User");
      setNotificationMessage("Failed to delete user. Please try again.");
      setNotificationVariant("danger");
      setShowNotificationModal(true);
    } finally {
      // Close the confirmation modal and clear the user for deletion
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
    }
  };

  // Function to cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  // Function to close the notification modal
  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationVariant("success"); // Reset to default
  };

  // Function to open the user edit modal
  const handleEdit = (user) => {
    setSelectedUser(user); // Sets the user to be edited
    setShowEditModal(true); // Opens the edit modal
  };

  // Function to close the user edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null); // Clears the selected user
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">Users</Card.Title>
              <p className="card-category">
                Users List
              </p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Username</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">No users found.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                              <FaKey title="Permissions" style={{ cursor: 'pointer' }} onClick={() => {/* handlePermissions(user) */}} />
                              <FaUserCog title="Assign Technician" style={{ cursor: 'pointer' }} onClick={() => {/*handleAssign(user)*/}} />
                              {/* Call handleEdit when clicking the edit icon */}
                              <FaPen title="Edit" style={{ cursor: 'pointer' }} onClick={() => handleEdit(user)} />
                              <FaTrash title="Delete" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(user)} />
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
          Are you sure you want to delete the user **{userToDelete?.username}**?
          <br />
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notification Modal */}
      <Modal
        show={showNotificationModal}
        onHide={closeNotificationModal}
        centered
      >
        <Modal.Header closeButton className={`bg-${notificationVariant} text-white`}>
          <Modal.Title>{notificationTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notificationMessage}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={closeNotificationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      
      <EditUserModal
        show={showEditModal} 
        onHide={closeEditModal} 
        user={selectedUser} 
        onSave={fetchUsers} 
      />
    </Container>
  );
}

export default UserTable;
