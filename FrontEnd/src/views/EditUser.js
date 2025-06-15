import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Modal,
  Form,
  Button,
} from "react-bootstrap";

function EditUserModal({ show, onHide, user, onSave }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackModalTitle, setFeedbackModalTitle] = useState("");
  const [feedbackModalMessage, setFeedbackModalMessage] = useState("");
  const [feedbackModalVariant, setFeedbackModalVariant] = useState("success");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "", // senha não é carregada por segurança
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      setFeedbackModalTitle("Authentication Error");
      setFeedbackModalMessage("User token not found. Please log in again.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userToken}` },
      };

      const payload = {
        username: formData.username,
        email: formData.email,
      };

      // Só adiciona a senha se ela tiver sido alterada
      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const response = await axios.patch(`/users/${user.id}`, payload, config);

      setFeedbackModalTitle("Success");
      setFeedbackModalMessage("User updated successfully!");
      setFeedbackModalVariant("success");
      setShowFeedbackModal(true);

      setTimeout(() => {
        onSave(user.id, response.data);
        onHide();
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      setFeedbackModalTitle("Error");
      setFeedbackModalMessage("Failed to update user. Please try again.");
      setFeedbackModalVariant("danger");
      setShowFeedbackModal(true);
    }
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackModalTitle("");
    setFeedbackModalMessage("");
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Edit User ({user?.username})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <label>Username</label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <label>Email</label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <label>New Password (leave blank to keep current)</label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-fill"
              style={{
                backgroundColor: "#EE964B",
                borderColor: "#EE964B",
                color: "#fff",
              }}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showFeedbackModal} onHide={handleCloseFeedbackModal} centered>
        <Modal.Header
          closeButton
          className={
            feedbackModalVariant === "danger"
              ? "bg-danger text-white"
              : "bg-success text-white"
          }
        >
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

EditUserModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditUserModal;
