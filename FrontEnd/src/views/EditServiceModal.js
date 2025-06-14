
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditServiceModal({ show, onHide, service, onSave, users }) {
  const [editedService, setEditedService] = useState({ ...service });

  useEffect(() => {
    setEditedService(service || {});
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(editedService.id, editedService); // id e dados atualizados
    onHide(); // Fecha o modal
  };

  if (!service) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Serviço ID #{service.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPriority">
            <Form.Label>Prioridade</Form.Label>
            <Form.Control
              type="text"
              name="priority"
              value={editedService.priority || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formCategory">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={editedService.category || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={editedService.description || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={editedService.status || ""}
              onChange={handleChange}
            >
              <option value="">-- Selecione --</option>
              <option value="Pending">Pendente</option>
              <option value="InProgress">Em Andamento</option>
              <option value="Completed">Concluído</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formWorkerId">
            <Form.Label>Técnico</Form.Label>
            <Form.Control
              as="select"
              name="workerId"
              value={editedService.workerId || ""}
              onChange={handleChange}
            >
              <option value="">-- Selecione --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditServiceModal;
