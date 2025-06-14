INSERT INTO public.companies ("name", nif, address, email, phone, postal_code, location_reference, "isActive", created_date, modified_date) VALUES
('TechMech Ltd.', 123456789, '123 Mechanic Way', 'contact@techmech.com', '555-1234', '1000-001', 'Zone A', 1, NOW(), NOW()),
('Industrias Nova', 987654321, '456 Industrial Blvd', 'info@indnova.com', '555-9876', '2000-002', 'Zone B', 1, NOW(), NOW());


INSERT INTO public.machine_types (description, "isActive", created_date, modified_date) VALUES
('Lathe', 1, NOW(), NOW()),
('CNC', 1, NOW(), NOW());


INSERT INTO public.machine_mods (model, "Machine_type_id", created_date, modified_date) VALUES
('Model A1', 1, NOW(), NOW()),
('Model C2', 2, NOW(), NOW());


INSERT INTO public.machines ("Company_id", serial_number, number_hours, last_maintenance_date, "isActive", created_date, modified_date, brand, "type", model) VALUES
(1, 'SN123LATHE', 1500, '2025-05-10', 1, NOW(), NOW(), 'MecaBrand', 'Lathe', 'Model A1'),
(2, 'SN456CNC', 2000, '2025-04-28', 1, NOW(), NOW(), 'AutoTech', 'CNC', 'Model C2');


INSERT INTO public.parts ("name", description) VALUES
('Bearing', 'High-load bearing component'),
('Belt', 'Drive belt for motor');


INSERT INTO public.status (description, created_date, modified_date) VALUES
('Scheduled', NOW(), NOW()),
('In Progress', NOW(), NOW()),
('Completed', NOW(), NOW());


INSERT INTO public.appointments (title, client_id, machine_id, status_id, date_appointment, date_conclusion, created_date, modified_date) VALUES
('Lathe Checkup', 1, 1, 1, '2025-06-15', NULL, NOW(), NOW()),
('CNC Emergency', 2, 2, 2, '2025-06-10', NULL, NOW(), NOW());


--INSERT INTO public.services (company_id, worker_id, parts_id, date_started, date_finished, motive_rescheduled, client_signature, created_date, modified_date, status_id, priority, category, machine_id, description) VALUES
--(1, NULL, 1, '2025-06-15', NULL, NULL, NULL, NOW(), NOW(), 1, 'High', 'Maintenance', 1, 'Routine Lathe checkup'),
--(2, NULL, 2, '2025-06-10', NULL, 'Urgent failure reported', NULL, NOW(), NOW(), 2, 'Urgent', 'Repair', 2, 'Emergency CNC service');


INSERT INTO public.reviews (service_id, client_id, review_text, review_star, created_date, modified_date) VALUES
(1, 1, 'Very professional and on time.', 5, NOW(), NOW()),
(2, 2, 'Fast response but parts took time.', 4, NOW(), NOW());