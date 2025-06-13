import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
// import '../assets/css/app.css'; // Assumindo que o seu CSS está aqui e é utilizado

function AddServiceForm() {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    clientId: "",     // Mapeia para o ID da empresa (company_id)
    priority: "",     // Prioridade do serviço
    category: "",     // Categoria do serviço (manutenção preventiva/corretiva)
    machine: "",      // Mapeia para o ID da peça/máquina (parts_id)
    workerId: "",     // Mapeia para o ID do técnico responsável (worker_id)
    observation: "",  // Observações do serviço
  });

  // Estados para armazenar os dados das dropdowns
  const [users, setUsers] = useState([]); // Adicionado: Estado para utilizadores/técnicos
  const [clients, setClients] = useState([]);
  const priorities = ["Urgent", "Medium", "Low"]; // Opções de prioridade fixas
  const categories = ["Manutenção Preventiva", "Manutenção Corretiva"]; // Opções de categoria fixas
  const [machines, setMachines] = useState([]);

  // Estados para controlo da UI (carregamento e status de submissão)
  const [loading, setLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', null

  // Efeito para buscar os dados iniciais das dropdowns ao carregar o componente
  useEffect(() => {
    const userToken = localStorage.getItem("userToken"); // Obter o token JWT do localStorage

    if (!userToken) {
      console.error("Token JWT não encontrado no localStorage! Por favor, faça login.");
      setLoading(false); // Parar o carregamento
      setSubmissionStatus('error'); // Usar submissionStatus para erro de autenticação
      return; // Sair da função se não houver token
    }

    // Configuração dos cabeçalhos de autorização para todas as requisições
    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    // Definição das chamadas da API para buscar os dados das dropdowns
    // Utilizadores: Aponta para http://localhost:3000/api/users (o que funciona para si)
    const fetchUsers = axios.get("/users?pageNumber=1&pageSize=10", config);
    // Clientes: Aponta para http://localhost:3000/api/company (o que funciona para si)
    const fetchClients = axios.get("/company?pageNumber=1&pageSize=10", config);
    // Máquinas: Aponta para http://localhost:3000/api/machine (usando o endpoint de máquinas)
    const fetchMachines = axios.get("/machine?pageNumber=1&pageSize=10", config);


    // Executar todas as chamadas API em paralelo
    Promise.all([fetchUsers, fetchClients, fetchMachines])
      .then(([usersResponse, clientsResponse, machinesResponse]) => {
        // --- LOGS PARA DEPURAR OS DADOS RECEBIDOS (manter para depuração inicial) ---
        console.log("Dados de Utilizadores recebidos:", usersResponse.data);
        console.log("Dados de Clientes (Company) recebidos:", clientsResponse.data);
        console.log("Dados de Máquinas (Machine) recebidos:", machinesResponse.data);

        // Atribuir os dados aos estados conforme a sua estrutura de resposta JSON
        setUsers(usersResponse.data || []); // Utilizadores: array direto
        setClients(clientsResponse.data.data || []); // Clientes: aninhado em .data.data
        setMachines(machinesResponse.data.data || []); // Máquinas: aninhado em .data.data
      })
      .catch((error) => {
        // Lidar com erros durante a busca de dados
        console.error("Erro ao buscar dados do formulário:", error.response ? error.response.data : error.message);
        setSubmissionStatus('error'); // Definir status de erro para exibição ao utilizador
      })
      .finally(() => {
        setLoading(false); // Parar o estado de carregamento, independentemente do sucesso ou falha
      });
  }, []); // O array de dependências vazio significa que este efeito corre apenas uma vez ao montar o componente

  // Função para lidar com a mudança nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Atualiza o valor do campo correspondente
    }));
  };

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir o comportamento padrão de recarregar a página
    setSubmissionStatus(null); // Resetar o status da submissão

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      console.error("Token JWT não encontrado!");
      setSubmissionStatus('error');
      return;
    }

    try {
      // Mapear os dados do formulário para o formato da payload que o backend espera
      const servicePayload = {
        companyId: formData.clientId === "" ? null : parseInt(formData.clientId),
        priority: formData.priority,
        category: formData.category,
        PartsId: null,
        workerId: formData.workerId === "" ? null : parseInt(formData.workerId),
        machineId: formData.machine === "" ? null : parseInt(formData.machine),
        date_started: new Date().toISOString().split('T')[0],
        statusId: 1,
        description: formData.observation,
      };

      console.log("Payload a ser submetido:", servicePayload);

      // Enviar a requisição POST para criar o serviço para o API Gateway
      // CORREÇÃO: Alterado o endpoint para http://localhost:8088/api/service
      const response = await axios.post(
        "/service", // Endpoint correto para o API Gateway
        servicePayload,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      console.log("Serviço criado com sucesso:", response.data);
      setSubmissionStatus('success'); // Definir status de sucesso
      // Resetar o formulário após a submissão bem-sucedida
      setFormData({
        clientId: "",
        priority: "",
        category: "",
        machine: "",
        workerId: "",
        observation: "",
      });
      // Pode adicionar lógica aqui para atualizar uma lista de serviços, navegar, etc.

    } catch (error) {
      // Lidar com erros durante a submissão do formulário
      console.error("Erro ao criar serviço:", error.response ? error.response.data : error.message);
      setSubmissionStatus('error'); // Definir status de erro
    }
  };

  // Exibir mensagem de carregamento enquanto os dados das dropdowns são buscados
  if (loading) {
    return <p>A carregar formulário...</p>;
  }

  // Renderizar o formulário
  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">New Service</Card.Title>
              <p className="card-category">Add a new service</p>
            </Card.Header>
            <Card.Body>
              {/* Exibir mensagem de sucesso ou erro na submissão */}
              {submissionStatus === 'success' && (
                <div className="alert alert-success">Service added successfully</div>
              )}
              {submissionStatus === 'error' && (
                <div className="alert alert-danger">Error adding service</div>
              )}
              <Form onSubmit={handleSubmit}>
                <Row> {/* Primeira linha para duas colunas */}
                  <Col md="6">
                    {/* Dropdown de Clientes */}
                    <Form.Group className="mb-3">
                      <label>Client</label>
                      <Form.Control
                        as="select"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a client</option>
                        {clients.length > 0 ? (
                          clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name} {/* Exibe o nome da empresa */}
                            </option>
                          ))
                        ) : (
                          <option disabled>No clients found</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    {/* Dropdown de Prioridade */}
                    <Form.Group className="mb-3">
                      <label>Priority</label>
                      <Form.Control
                        as="select"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {priorities.map((p, index) => (
                          <option key={index} value={p}>
                            {p}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3"> {/* Segunda linha para mais colunas */}
                  <Col md="6">
                    {/* Dropdown de Categoria */}
                    <Form.Group className="mb-3">
                      <label>Category</label>
                      <Form.Control
                        as="select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    {/* Dropdown de Máquinas */}
                    <Form.Group className="mb-3">
                      <label>Machine</label>
                      <Form.Control
                        as="select"
                        name="machine"
                        value={formData.machine}
                        onChange={handleChange}
                      >
                        <option value="">Select a machine</option>
                        {machines.length > 0 ? (
                          machines.map((machine) => (
                            <option key={machine.id} value={machine.id}>
                              {machine.type}
                            </option>
                          ))
                        ) : (
                          <option disabled>No machines found</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3"> {/* Terceira linha para a coluna de técnicos */}
                  <Col md="6">
                    {/* Dropdown de Técnicos Responsáveis */}
                    <Form.Group className="mb-3">
                      <label>Responsable Technician</label>
                      <Form.Control
                        as="select"
                        name="workerId"
                        value={formData.workerId}
                        onChange={handleChange}
                      >
                        <option value="">Select a technician</option>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.username}
                            </option>
                          ))
                        ) : (
                          <option disabled>No technicians found</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3"> {/* Linha para observação */}
                  <Col md="12">
                    <Form.Group className="mb-3">
                      <label>Description</label>
                      <Form.Control
                        as="textarea"
                        name="observation"
                        rows="4"
                        value={formData.observation}
                        onChange={handleChange}
                      ></Form.Control>
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
    </Container>
  );
}

export default AddServiceForm;
