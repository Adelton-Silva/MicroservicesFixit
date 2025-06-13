// src/views/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom'; // Para React Router v5

import TableList from './ServiceTable';
import AddServiceForm from './AddServiceForm';

function ServiceDashboardPage() {
    const history = useHistory();
    const location = useLocation();

    const getInitialTab = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tab') || 'dashboard';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('tab') !== activeTab) {
            params.set('tab', activeTab);
            history.push({ search: params.toString() });
        }
    }, [activeTab, history, location.search]);

    useEffect(() => {
        setActiveTab(getInitialTab());
    }, [location.search]);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <TableList />;
            case 'newTicket':
                return <AddServiceForm />;
            case 'history':
                return (
                    <Container fluid>
                        <p>Service History Content (Coming Soon)</p>
                    </Container>
                );
            default:
                return <TableList />;
        }
    };

    return (
        <Container fluid>
            {/* Tab Navigation */}
            <Nav variant="pills"
                defaultActiveKey={activeTab}
                onSelect={(selectedKey) => setActiveTab(selectedKey)}
                className="d-flex justify-content-between mb-3 p-1 rounded"
                style={{ backgroundColor: '#FAF0CA', borderRadius: '5px', padding: '5px' }}
            >
                <Nav.Item className="flex-fill text-center">
                    <Nav.Link
                        eventKey="dashboard"
                        className={`
                            py-2 px-3
                            ${activeTab === 'dashboard' ? 'text-white' : 'text-primary'} // Texto branco para a selecionada, texto primário para a não selecionada
                            rounded
                            text-decoration-none
                            font-weight-bold
                        `}
                        // <--- ALTERAÇÃO PRINCIPAL AQUI!
                        style={{
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                            backgroundColor: activeTab === 'dashboard' ? '#EE964B' : 'transparent', // Cor de fundo laranja para a selecionada
                            color: activeTab === 'dashboard' ? 'white' : '#155EA2' // Cor do texto
                        }}
                    >
                        Service</Nav.Link>
                </Nav.Item>
                <Nav.Item className="flex-fill text-center">
                    <Nav.Link eventKey="newTicket"
                        className={`
                            py-2 px-3
                            ${activeTab === 'newTicket' ? 'text-white' : 'text-primary'}
                            rounded
                            text-decoration-none
                            font-weight-bold
                        `}
                        // <--- ALTERAÇÃO PRINCIPAL AQUI!
                        style={{
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                            backgroundColor: activeTab === 'newTicket' ? '#EE964B' : 'transparent',
                            color: activeTab === 'newTicket' ? 'white' : '#155EA2'
                        }}
                    >
                        New Service</Nav.Link>
                </Nav.Item>
                <Nav.Item className="flex-fill text-center">
                    <Nav.Link eventKey="history"
                        className={`
                            py-2 px-3
                            ${activeTab === 'history' ? 'text-white' : 'text-primary'}
                            rounded
                            text-decoration-none
                            font-weight-bold
                        `}
                        // <--- ALTERAÇÃO PRINCIPAL AQUI!
                        style={{
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                            backgroundColor: activeTab === 'history' ? '#EE964B' : 'transparent',
                            color: activeTab === 'history' ? 'white' : '#155EA2'
                        }}
                    >
                        Service History</Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Render the content based on the active tab */}
            <div className="mt-3">
                {renderContent()}
            </div>
        </Container>
    );
}

export default ServiceDashboardPage;