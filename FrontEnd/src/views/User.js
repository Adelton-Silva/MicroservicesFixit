import React, { useEffect, useState } from "react";
import axios from "axios";

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("Token JWT não encontrado no localStorage!");
      setLoading(false);
      return;
    }

    axios
      .get("/api/users?pageNumber=1&pageSize=10", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      .then((response) => {
        console.log("Resposta do backend:", response.data);
        setUsers(response.data); 
      })
      .catch((error) => {
        console.error("Erro ao buscar Users:", error);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

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
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">No users found found.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
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

export default UserTable;
