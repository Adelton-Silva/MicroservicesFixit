// src/views/AddUserForm.js
import React, { useState } from "react";
import axios from "axios";

// react-bootstrap components
import {
    Card,
    Form, // Import Form
    Button, // Import Button
    Container,
    Row,
    Col,
    Modal, // Import Modal for notification
} from "react-bootstrap";

function AddUserForm() {
    // States for form fields
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // States for notification modal
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationVariant, setNotificationVariant] = useState("success"); // 'success' or 'danger'

    // Function to close the notification modal
    const closeNotificationModal = () => {
        setShowNotificationModal(false);
        setNotificationTitle("");
        setNotificationMessage("");
        setNotificationVariant("success"); // Reset to default
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true);

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            setNotificationTitle("Validation Error");
            setNotificationMessage("Please fill in all fields.");
            setNotificationVariant("danger");
            setShowNotificationModal(true);
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setNotificationTitle("Validation Error");
            setNotificationMessage("The passwords do not match.");
            setNotificationVariant("danger");
            setShowNotificationModal(true);
            setLoading(false);
            return;
        }

        const userToken = localStorage.getItem("userToken");

        if (!userToken) {
            setNotificationTitle("Authentication Error");
            setNotificationMessage("JWT Token not found. Please log in again.");
            setNotificationVariant("danger");
            setShowNotificationModal(true);
            setLoading(false);
            return;
        }

        try {

            const response = await axios.post(
                "/users",
                {
                    username,
                    email,
                    password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("User added successfully:", response.data);
            setNotificationTitle("Success!");
            setNotificationMessage("User registered successfully!");
            setNotificationVariant("success");
            setShowNotificationModal(true);

            // Clear form fields after success
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Error adding user:", error.response ? error.response.data : error.message);
            setNotificationTitle("Error Adding User");
            setNotificationMessage(
                error.response && error.response.data && error.response.data.message
                    ? error.response.data.message // Display backend error message if available
                    : "Failed to register user. Please try again."
            );
            setNotificationVariant("danger");
            setShowNotificationModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md="12">
                    <Card>
                        <Card.Header>
                            <Card.Title as="h4">Add New User</Card.Title>
                            <p className="card-category">Fill in the details for the new user</p>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Username" // Corrected placeholder without extra braces/comments
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="email@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
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

            {/* Notification Modal (similar to UserTable) */}
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
        </Container>
    );
}


export default AddUserForm;
