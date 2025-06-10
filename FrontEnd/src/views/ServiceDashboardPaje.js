// src/views/DashboardPage.js
import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap'; // Import Nav from react-bootstrap
import TableList from './Service'; // Assuming ServiceTable is in components folder
import AddServiceForm from './AddServiceForm'; // Assuming AddServiceForm is in components folder

function ServiceDashboardPage() {
    const [activeTab, setActiveTab] = useState('dashboard'); // State to manage active tab

    // Function to render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <TableList />; // Renders your existing ServiceTable component
            case 'newTicket':
                return <AddServiceForm />; // Renders the new service form component
            case 'history':
                return (
                    <Container fluid>
                        <p>Service History Content (Coming Soon)</p>
                    </Container>
                );
            default:
                return <TableList />; // Default to dashboard if something goes wrong
        }
    };

    return (
        <Container fluid>
            {/* Tab Navigation */}
            <Nav variant="pills"
                defaultActiveKey="dashboard"
                onSelect={(selectedKey) => setActiveTab(selectedKey)}
                className="d-flex justify-content-between mb-3 p-1 rounded"
                style={{ backgroundColor: '#FAF0CA', borderRadius: '5px', padding: '5px' }}
            >
                <Nav.Item className="flex-fill text-center">
                    <Nav.Link
                     eventKey="dashboard"
                     className={`
                                    py-2 px-3 // Padding vertical e horizontal para os links
                                    ${activeTab === 'dashboard' ? '#155EA2' : '#155EA2 bg-transparent'} 
                                    rounded // Bordas arredondadas para cada botão
                                    text-decoration-none // Remove underline
                                    
                                `}
                                style={{ transition: 'background-color 0.3s ease, color 0.3s ease', backgroundColor: '#FAF0CA' }}
                     >
                        Service</Nav.Link>
                </Nav.Item>
                <Nav.Item className="flex-fill text-center">
                    <Nav.Link eventKey="newTicket"
                    className={`
                                    py-2 px-3 // Padding vertical e horizontal para os links
                                    ${activeTab === 'dashboard' ? '#155EA2' : '#155EA2 bg-transparent'} 
                                    rounded // Bordas arredondadas para cada botão
                                    text-decoration-none // Remove underline
                                  
                                `}
                                style={{ transition: 'background-color 0.3s ease, color 0.3s ease', backgroundColor: '#FAF0CA' }}
                    >
                        New Service</Nav.Link>
                </Nav.Item>
                <Nav.Item className="flex-fill text-center">
                    <Nav.Link eventKey="history"
                    className={`
                                    py-2 px-3 // Padding vertical e horizontal para os links
                                    ${activeTab === 'dashboard' ? '#155EA2' : '#155EA2 bg-transparent'} 
                                    rounded // Bordas arredondadas para cada botão
                                    text-decoration-none // Remove underline
                                   
                                `}
                                style={{ transition: 'background-color 0.3s ease, color 0.3s ease', backgroundColor: '#FAF0CA' }}
                    >
                        Service History</Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Render the content based on the active tab */}
            <div className="mt-3"> {/* Add some margin top for spacing */}
                {renderContent()}
            </div>
        </Container>
    );
}

export default ServiceDashboardPage;