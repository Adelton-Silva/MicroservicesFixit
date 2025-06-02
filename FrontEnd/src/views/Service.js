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

function ServiceTable() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      console.error("Token JWT não encontrado no localStorage!");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5002/api/Service?page=1&pageSize=10", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      .then((response) => {
        console.log("Resposta do backend:", response.data);
        setServices(response.data.data); // ou response.data, dependendo do formato retornado
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços:", error);
      })
      .finally(() => {
        setLoading(false); // Sempre finaliza o loading, com sucesso ou erro
      });
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">Serviços</Card.Title>
              <p className="card-category">
                Lista de serviços obtidos da API
              </p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Type</th>
                      <th className="border-0">Technician</th>
                      <th className="border-0">Parts</th>
                      <th className="border-0">Date Started</th>
                      <th className="border-0">Date Finished</th>
                      <th className="border-0">Motive_Rescheduled</th>
                      <th className="border-0">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">Nenhum serviço encontrado.</td>
                      </tr>
                    ) : (
                      services.map((service) => (
                        <tr key={service.id}>
                          <td>{service.id}</td>
                          <td>{service.appointment?.title || service.appointment_id}</td>
                          <td>{service.worker_id}</td>
                          <td>{service.parts?.name || service.parts_id}</td>
                          <td>{service.date_started}</td>
                          <td>{service.date_finished}</td>
                          <td>{service.motive_rescheduled}</td>
                          <td>{service.status?.description || service.status_id}</td>
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
