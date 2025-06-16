-- public.companies definition

-- Drop table

-- DROP TABLE public.companies;

CREATE TABLE public.companies (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	nif int4 NULL,
	address text NULL,
	email varchar(255) NULL,
	phone varchar(20) NULL,
	postal_code varchar(20) NULL,
	location_reference text NULL,
	"isActive" int4 NULL,
	created_date timestamp NULL,
	modified_date timestamp NULL,
	CONSTRAINT companies_pkey PRIMARY KEY (id)
);

-- public.machines definition

-- Drop table

-- DROP TABLE public.machines;

CREATE TABLE public.machines (
	id serial4 NOT NULL,
	"Company_id" int4 NULL,
	serial_number varchar(255) NULL,
	number_hours int4 NULL,
	last_maintenance_date timestamp NULL,
	"isActive" int4 NULL,
	created_date timestamp NULL,
	modified_date timestamp NULL,
	brand varchar NULL,
	"type" varchar NULL,
	model varchar NULL,
	CONSTRAINT machines_pkey PRIMARY KEY (id)
);


-- public.machines foreign keys

ALTER TABLE public.machines ADD CONSTRAINT machines_company_id_fkey FOREIGN KEY ("Company_id") REFERENCES public.companies(id) ON DELETE CASCADE;

-- public.machine_types definition

-- Drop table

-- DROP TABLE public.machine_types;

CREATE TABLE public.machine_types (
	id serial4 NOT NULL,
	description text NULL,
	"isActive" int4 NULL,
	created_date timestamp NULL,
	modified_date timestamp NULL,
	CONSTRAINT machine_types_pkey PRIMARY KEY (id)
);

-- public.machine_mods definition

-- Drop table

-- DROP TABLE public.machine_mods;

CREATE TABLE public.machine_mods (
	id serial4 NOT NULL,
	model varchar(255) NULL,
	"Machine_type_id" int4 NULL,
	created_date timestamp NULL,
	modified_date timestamp NULL,
	CONSTRAINT machine_mods_pkey PRIMARY KEY (id)
);


-- public.machine_mods foreign keys

ALTER TABLE public.machine_mods ADD CONSTRAINT machine_mods_machine_type_id_fkey FOREIGN KEY ("Machine_type_id") REFERENCES public.machine_types(id) ON DELETE CASCADE;


-- public.parts definition

-- Drop table

-- DROP TABLE public.parts;

CREATE TABLE public.parts (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	description text NULL,
	CONSTRAINT parts_pkey PRIMARY KEY (id)
);


-- public.status definition

-- Drop table

-- DROP TABLE public.status;

CREATE TABLE public.status (
	id serial4 NOT NULL,
	description text NULL,
	created_date timestamp NULL,
	modified_date timestamp NULL,
	CONSTRAINT status_pkey PRIMARY KEY (id)
);


-- public.appointments definition

-- Drop table

-- DROP TABLE public.appointments;

CREATE TABLE public.appointments (
	id serial4 NOT NULL,
	title varchar(255) NULL,
	client_id int4 NULL,
	machine_id int4 NULL,
	status_id int4 NULL,
	date_appointment date NULL,
	date_conclusion date NULL,
	created_date timestamp NULL,
	modified_date timestamp NULL,
	CONSTRAINT appointments_pkey PRIMARY KEY (id)
);


-- public.appointments foreign keys

ALTER TABLE public.appointments ADD CONSTRAINT appointments_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(id) ON DELETE CASCADE;
ALTER TABLE public.appointments ADD CONSTRAINT appointments_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id) ON DELETE SET NULL;


-- public.services definition

-- Drop table

-- DROP TABLE public.services;

CREATE TABLE public.services (
	id serial4 NOT NULL,
	company_id int4 NULL,
	worker_id int4 NULL,
	parts_id int4 NULL,
	date_started date NULL,
	date_finished date NULL,
	motive_rescheduled text NULL,
	client_signature text NULL,
	created_date timestamp NULL,
	modified_date timestamp NULL,
	status_id int4 NULL,
	priority varchar NULL,
	category varchar NULL,
	machine_id int4 NULL,
	description varchar NULL,
	CONSTRAINT services_pkey PRIMARY KEY (id)
);


-- public.services foreign keys

ALTER TABLE public.services ADD CONSTRAINT foregi_key FOREIGN KEY (status_id) REFERENCES public.status(id) ON DELETE CASCADE;
ALTER TABLE public.services ADD CONSTRAINT services_appointment_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.services ADD CONSTRAINT services_parts_id_fkey FOREIGN KEY (parts_id) REFERENCES public.parts(id) ON DELETE SET NULL;


-- public.reviews definition

-- Drop table

-- DROP TABLE public.reviews;

CREATE TABLE public.reviews (
	id serial4 NOT NULL,
	service_id int4 NULL,
	client_id int4 NULL,
	review_text varchar(500) NULL,
	review_star int4 NULL,
	created_date timestamp NULL,
	modified_date timestamp NULL,
	CONSTRAINT reviews_pkey PRIMARY KEY (id)
);


-- public.reviews foreign keys

ALTER TABLE public.reviews ADD CONSTRAINT reviews_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;
