INSERT INTO public.companies (id, "name", nif, address, email, phone, postal_code, location_reference, "isActive", created_date, modified_date) VALUES
(1, 'TechMech Ltd.', 123456789, '123 Mechanic Way', 'contact@techmech.com', '555-1234', '1000-001', 'Zone A', 1, NOW(), NOW()),
(2, 'Industrias Nova', 987654321, '456 Industrial Blvd', 'info@indnova.com', '555-9876', '2000-002', 'Zone B', 1, NOW(), NOW());


INSERT INTO public.machine_types (id, description, "isActive", created_date, modified_date) VALUES
(1, 'Lathe', 1, NOW(), NOW()),
(2, 'CNC', 1, NOW(), NOW());


INSERT INTO public.machine_mods (id, model, "Machine_type_id", created_date, modified_date) VALUES
(1, 'Model A1', 1, NOW(), NOW()),
(2, 'Model C2', 2, NOW(), NOW());


INSERT INTO public.machines (id, "Company_id", serial_number, number_hours, last_maintenance_date, "isActive", created_date, modified_date, brand, "type", model) VALUES
(1, 1, 'SN123LATHE', 1500, '2025-05-10', 1, NOW(), NOW(), 'MecaBrand', 'Lathe', 'Model A1'),
(2, 2, 'SN456CNC', 2000, '2025-04-28', 1, NOW(), NOW(), 'AutoTech', 'CNC', 'Model C2');


INSERT INTO public.parts (id, "name", description) VALUES
(1, 'Bearing', 'High-load bearing component'),
(2, 'Belt', 'Drive belt for motor');


INSERT INTO public.status (id, description, created_date, modified_date) VALUES
(1, 'Scheduled', NOW(), NOW()),
(2, 'In Progress', NOW(), NOW()),
(3, 'Completed', NOW(), NOW());


INSERT INTO public.appointments (id, title, client_id, machine_id, status_id, date_appointment, date_conclusion, created_date, modified_date) VALUES
(1, 'Lathe Checkup', 1, 1, 1, '2025-06-15', NULL, NOW(), NOW()),
(2, 'CNC Emergency', 2, 2, 2, '2025-06-10', NULL, NOW(), NOW());


INSERT INTO public.services (id, company_id, worker_id, parts_id, date_started, date_finished, motive_rescheduled, client_signature, created_date, modified_date, status_id, priority, category, machine_id, description) VALUES
(1, 1, 1, 1, '2025-06-15', NULL, NULL, NULL, NOW(), NOW(), 1, 'High', 'Maintenance', 1, 'Routine Lathe checkup'),
(2, 2, 2, 2, '2025-06-10', NULL, 'Urgent failure reported', NULL, NOW(), NOW(), 2, 'Urgent', 'Repair', 2, 'Emergency CNC service');
(19, 1, 1, 1, '2025-06-15', NULL, 'Urgent failure reported', NULL, NOW(), NOW(), 2, 'Urgent', 'Repair', 2, 'Routine Lathe checkup'),

-- Generated Services over the last 5 months

-- January 2025 (5 months ago) - 2 services
INSERT INTO public.services (id, company_id, worker_id, parts_id, date_started, date_finished, created_date, modified_date, status_id, priority, category, machine_id, description)
VALUES
(3, 1, NULL, 1, '2025-01-10', '2025-01-12', NOW(), NOW(), 3, 'Medium', 'Maintenance', 1, 'Quarterly inspection'),
(4, 2, NULL, 2, '2025-01-20', '2025-01-23', NOW(), NOW(), 3, 'High', 'Repair', 2, 'Belt replacement');

-- February 2025 - 3 services
INSERT INTO public.services (id, company_id, worker_id, parts_id, date_started, date_finished, created_date, modified_date, status_id, priority, category, machine_id, description)
VALUES
(5, 1, NULL, 1, '2025-02-05', '2025-02-07', NOW(), NOW(), 3, 'Low', 'Checkup', 1, 'Post-holiday check'),
(6, 2, NULL, 2, '2025-02-12', '2025-03-13', NOW(), NOW(), 3, 'Medium', 'Repair', 2, 'Sensor realignment'),
(7, 1, NULL, 1, '2025-02-22', '2025-03-24', NOW(), NOW(), 3, 'High', 'Emergency', 1, 'Lathe overheating issue');

-- March 2025 - 4 services
INSERT INTO public.services (id, company_id, worker_id, parts_id, date_started, date_finished, created_date, modified_date, status_id, priority, category, machine_id, description)
VALUES
(8, 2, NULL, 2, '2025-03-01', '2025-03-03', NOW(), NOW(), 3, 'Medium', 'Maintenance', 2, 'Routine CNC maintenance'),
(9, 1, NULL, 1, '2025-03-08', '2025-03-09', NOW(), NOW(), 3, 'Low', 'Checkup', 1, 'Oil and lubrication'),
(10, 1, NULL, 1, '2025-03-15', '2025-03-17', NOW(), NOW(), 3, 'High', 'Repair', 1, 'Gearbox issue'),
(11, 2, NULL, 2, '2025-03-20', '2025-03-22', NOW(), NOW(), 3, 'Medium', 'Maintenance', 2, 'Cooling system cleaning');

-- April 2025 - 2 services
INSERT INTO public.services (id, company_id, worker_id, parts_id, date_started, date_finished, created_date, modified_date, status_id, priority, category, machine_id, description)
VALUES
(12, 1, NULL, 1, '2025-04-05', '2025-04-06', NOW(), NOW(), 3, 'Low', 'Checkup', 1, 'Light tune-up'),
(13, 2, NULL, 2, '2025-04-15', '2025-04-18', NOW(), NOW(), 3, 'High', 'Repair', 2, 'Motor replacement');

-- May 2025 - 5 services
INSERT INTO public.services (id, company_id, worker_id, parts_id, date_started, date_finished, created_date, modified_date, status_id, priority, category, machine_id, description)
VALUES
(14, 1, NULL, 1, '2025-05-01', '2025-05-03', NOW(), NOW(), 3, 'High', 'Repair', 1, 'Lathe shaft issue'),
(15, 2, NULL, 2, '2025-05-06', '2025-06-08', NOW(), NOW(), 3, 'Medium', 'Maintenance', 2, 'CNC head inspection'),
(16, 1, NULL, 1, '2025-05-12', '2025-05-13', NOW(), NOW(), 3, 'Low', 'Checkup', 1, 'Preventive diagnostics'),
(17, 2, NULL, 2, '2025-05-20', '2025-05-21', NOW(), NOW(), 3, 'Medium', 'Maintenance', 2, 'Software calibration'),
(18, 1, NULL, 1, '2025-05-25', '2025-05-26', NOW(), NOW(), 3, 'High', 'Emergency', 1, 'Unexpected vibration');



INSERT INTO public.reviews (id, service_id, client_id, review_text, review_star, created_date, modified_date) VALUES
(1, 1, 1, 'Very professional and on time.', 5, NOW(), NOW()),
(2, 2, 2, 'Fast response but parts took time.', 4, NOW(), NOW());