import React, { useEffect, useState } from "react";
import axios from "axios";

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Modal, // Importar Modal
  Button, // Importar Button
} from "react-bootstrap";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Novos estados para o modal de confirmação de exclusão de utilizador
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("Token JWT não encontrado no localStorage!");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/api/users?pageNumber=1&pageSize=10", { // Ajustado para URL completa para clareza
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      .then((response) => {
        console.log("Resposta do backend (Users):", response.data);
        // Garantir que a resposta é tratada como um array, se necessário
        const usersData = Array.isArray(response.data) ? response.data : response.data.data || [];
        setUsers(usersData);
      })
      .catch((error) => {
        console.error("Erro ao buscar Utilizadores:", error.response ? error.response.data : error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Função para abrir o modal de confirmação de exclusão
  const handleDelete = (user) => {
    setUserToDelete(user); // Armazena o utilizador a ser excluído
    setShowDeleteConfirmModal(true); // Abre o modal
  };

  // Função para confirmar a exclusão
  const confirmDelete = async () => {
    if (!userToDelete) return; // Garante que há um utilizador para deletar

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        alert("User token not found. Please log in again.");
        return;
      }

      // Altere esta URL para o endpoint de exclusão de utilizador real
      await axios.delete(`http://localhost:3000/api/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      alert(`Utilizador ID ${userToDelete.id} eliminado com sucesso.`);
    } catch (error) {
      console.error("Erro ao eliminar utilizador:", error.response ? error.response.data : error.message);
      alert("Falha ao eliminar utilizador. Por favor, tente novamente.");
    } finally {
      // Fechar o modal de confirmação e limpar o utilizador para exclusão
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
    }
  };

  // Função para cancelar a exclusão
  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };


  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">Utilizadores</Card.Title>
              <p className="card-category">
                Lista de Utilizadores
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
                      <th className="border-0">Ações</th> {/* Nova coluna para ações */}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">No users found.</td> {/* Ajustado colSpan */}
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <Button
                              variant="danger" // Botão vermelho para deleção
                              size="sm" // Tamanho pequeno
                              onClick={() => handleDelete(user)} // Chama a função handleDelete
                            >
                              Eliminar
                            </Button>
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

      {/* Modal de Confirmação de Exclusão de Utilizador */}
      <Modal
        show={showDeleteConfirmModal}
        onHide={cancelDelete}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão de Utilizador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja apagar o utilizador **ID #{userToDelete?.id} - {userToDelete?.username}**?
          <br />
          Esta ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserTable;