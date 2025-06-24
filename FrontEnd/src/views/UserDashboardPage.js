import React, { useState, useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';

import { useLocation, useHistory } from 'react-router-dom'; 

import UserTable from './User'; 

import AddUserForm from './AddUserForm';

function UserDashboardPage() {
    // useHistory para React Router v5
    const history = useHistory();
    const location = useLocation();

    // Função para obter a aba inicial do parâmetro 'tab' na URL
    const getInitialTab = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tab') || 'users'; // Padrão para 'users'
    };

    // Estado para controlar a aba ativa
    const [activeTab, setActiveTab] = useState(getInitialTab);

    // Efeito para atualizar a URL sempre que a aba ativa mudar
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('tab') !== activeTab) {
            params.set('tab', activeTab);
            // history.push para React Router v5
            history.push({ search: params.toString() });
        }
    }, [activeTab, history, location.search]); // Dependências atualizadas para history

    // Efeito para atualizar a aba ativa quando a URL muda (ex: botão de voltar do navegador)
    useEffect(() => {
        setActiveTab(getInitialTab());
    }, [location.search]);

    // Função para renderizar o conteúdo com base na aba ativa
    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                // Exibe o componente UserTable
                return <UserTable />; 
            case 'newUser':
                // Substitua por seu componente real para adicionar um novo utilizador
                // return <AddUserForm />;
                return <AddUserForm />;
            default:
                // Padrão caso a aba não seja reconhecida
                return <UserTable />; 
        }
    };

    return (
        <Container fluid>
            {/* Navegação por Abas */}
            <Nav
                variant="pills"
                defaultActiveKey={activeTab}
                onSelect={(selectedKey) => setActiveTab(selectedKey)}
                className="d-flex justify-content-between mb-3 p-1 rounded"
                style={{ backgroundColor: '#FAF0CA', borderRadius: '5px', padding: '5px' }}
            >
                <Nav.Item className="flex-fill text-center">
                    <Nav.Link
                        eventKey="users" // Chave do evento para esta aba
                        className={`
                            py-2 px-3
                            ${activeTab === 'users' ? 'text-white' : 'text-primary'}
                            rounded
                            text-decoration-none
                            font-weight-bold
                        `}
                        style={{
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                            backgroundColor: activeTab === 'users' ? '#EE964B' : 'transparent',
                            color: activeTab === 'users' ? 'white' : '#155EA2'
                        }}
                    >
                        Users
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="flex-fill text-center">
                    <Nav.Link
                        eventKey="newUser" // Chave do evento para esta aba
                        className={`
                            py-2 px-3
                            ${activeTab === 'newUser' ? 'text-white' : 'text-primary'}
                            rounded
                            text-decoration-none
                            font-weight-bold
                        `}
                        style={{
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                            backgroundColor: activeTab === 'newUser' ? '#EE964B' : 'transparent',
                            color: activeTab === 'newUser' ? 'white' : '#155EA2'
                        }}
                    >
                        New User
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Renderiza o conteúdo com base na aba ativa */}
            <div className="mt-3">
                {renderContent()}
            </div>
        </Container>
    );
}

export default UserDashboardPage;
