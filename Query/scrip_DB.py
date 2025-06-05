from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, MetaData, Table
from faker import Faker
import logging
from datetime import date
import random
import time

# Configuração de logging
logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)

# Configurações do banco de dados
DATABASE_URL = "postgresql+psycopg2://postgres:1992@localhost:5432/postgres"

# Configuração do SQLAlchemy
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Definição da tabela 'company'
company_table = Table(
    "company",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(100)),
    Column("nif", String(100)),
    Column("address", String(100)),
    Column("email", String(100)),
    Column("phone", String(100)),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
    Column("location_reference", String(100)),
    Column("postal_code", String(100)),
)

# Definição da tabela 'role'
role_table = Table(
    "role",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("permissions", String(50), unique=True),
    Column("description", String(200)),
)

# Definição da tabela 'cliente'
cliente_table = Table(
    "client",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(100)),
    Column("role_id", Integer, ForeignKey("role.id")),
    Column("company_id", Integer, ForeignKey("company.id")),
    Column("verified", Integer),
    Column("active", Integer),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)

# Definição da tabela 'machine_type'
machine_type_table = Table(
    "machine_type",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("description", String(100)),
    Column("active", Integer),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)


# Definição da tabela 'machine_model
machine_model_table = Table(
    "machine_model",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("model", String(100)),
    Column("machine_type_id", Integer, ForeignKey("machine_type.id")),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)

# Definição da tabela 'machine'
machine_table = Table(
    "machine",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("serial_number", String(100)),
    Column("machine_model_id", Integer, ForeignKey("machine_model.id")),
    Column("company_id", Integer, ForeignKey("company.id")),
    Column("active", Integer),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)

# Definição da tabela 'status'
status_table = Table(
    "status",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("description", String(100)),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)

# Definição da taela 'appointment'
appointment_table = Table(
    "appointment",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("client_id", Integer, ForeignKey("client.id")),
    Column("machine_id", Integer, ForeignKey("machine.id")),
    Column("status_id", Integer, ForeignKey("status.id")),
    Column("date_appointment", String(100)),
    Column("date_conclusion", String(100)),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)

# Definição da tabela worker
worker_table = Table(
    "worker",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("role_id", Integer, ForeignKey("role.id")),
    Column("name", String(100)),
    Column("admission_date", String(100)),
    Column("verified", Integer),
    Column("active", Integer),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)

# Definição da tabela 'parts' 
part_table = Table(
    "parts",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(100)),
    Column("description", String(100)),
)

# Definição da tabela 'services'
service_table = Table(
    "service",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("appointment_id", Integer, ForeignKey("appointment.id")),
    Column("worker_id", Integer, ForeignKey("worker.id")),
    Column("part_id", Integer, ForeignKey("parts.id")),
    Column("date_begin", String(100)),
    Column("date_conclusion", String(100)),
    Column("motive_reschedule", String(100)),
    Column("client_signature", String(100)),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)   

# Definição da tabela 'review'
review_table = Table(
    "review",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("service_id", Integer, ForeignKey("service.id")),
    Column("client_id", Integer, ForeignKey("client.id")),
    Column("review_star", Integer),
    Column("comment", String(100)),
    Column("created_date", String(100)),
    Column("modified_date", String(100)),
)

start_time = time.time()  # Início da medição do tempo

# Criação das tabelas (caso ainda não existam)
metadata.create_all(engine)

# Gerar dados fictícios com Faker
faker = Faker()

# Inserção de registros
quantidade_companies = 1000  # Número de registros na tabela 'company'
quantidade_clientes = 3000  # Número de registros na tabela 'cliente'
quantidade_roles = 3  # Número de registros na tabela 'role'
quantidade_machines_types = 100  # Número de registros na tabela 'machine_type'
quantidade_machines_models = 200  # Número de registros na tabela 'machine_model'
quantidade_machines = 20000 # Número de registros na tabela 'machine'
quantidade_status = 5  # Número de registros na tabela 'status'
quantidade_appointments = 200000 # Número de registros na tabela 'appointment'
quantidade_workers = 1000  # Número de registros na tabela 'worker'
quantidade_parts = 100  # Número de registros na tabela 'parts'
quantidade_services = 150000  # Número de registros na tabela 'service'
quantidade_reviews = 10000  # Número de registros na tabela 'review'

with engine.connect() as conn:
    # Inserir registros em 'company'
    company_ids = []
    for _ in range(quantidade_companies):
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_company = {
            "name": faker.company(),
            "nif": faker.random_number(digits=9, fix_len=True),
            "address": faker.address(),
            "email": faker.email(),
            "phone": faker.phone_number(),
            "created_date": created_date,
            "modified_date": modified_date,
            "location_reference": faker.address(),
            "postal_code": faker.postcode(),
        }
        result = conn.execute(company_table.insert().values(novo_company))
        company_ids.append(result.inserted_primary_key[0])  # Coletar IDs inseridos

    # Inserir registros em 'role'
    role_ids = []
    for _ in range(3):
        role_permissions = faker.word()
        role_description = faker.sentence()
        result = conn.execute(role_table.insert().values(permissions=role_permissions, description=role_description))
        role_ids.append(result.inserted_primary_key[0])

    # Inserir registros em 'cliente'
    client_ids = []
    for _ in range(quantidade_clientes):
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_cliente = {
            "name": faker.name(),
            "role_id": random.choice(role_ids),  # Associar à role 'client'
            "company_id": random.choice(company_ids),  # Associar a uma 'company' existente
            "verified": random.randint(0, 1),
            "active": random.randint(0, 1),
            "created_date": created_date,
            "modified_date": modified_date,
        }
        result = conn.execute(cliente_table.insert().values(novo_cliente))
        client_ids.append(result.inserted_primary_key[0])
        
    # Inserir registros em 'machine_type'
    machine_type_ids = []
    for _ in range(quantidade_machines_types):
        description = faker.sentence()
        active = random.randint(0, 1)
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_machine_type = {
            "description": description,
            "active": active,
            "created_date": created_date,
            "modified_date": modified_date,
        }
        result = conn.execute(machine_type_table.insert().values(novo_machine_type))
        machine_type_ids.append(result.inserted_primary_key[0])

    # Inserir registros em 'machine_model'
    machine_model_ids = []  # IDs dos modelos de máquinas inseridos anteriormente
    for _ in range(quantidade_machines_models):
        model = faker.word()
        machine_type_id = random.choice(machine_type_ids)
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_machine_model = {
            "model": model,
            "machine_type_id": machine_type_id,
            "created_date": created_date,
            "modified_date": modified_date,
        }
        result = conn.execute(machine_model_table.insert().values(novo_machine_model))
        machine_model_ids.append(result.inserted_primary_key[0])

    # Inserir registros em 'machine'
    machine_ids = []
    for _ in range(quantidade_machines):
        serial_number = faker.random_number(digits=9, fix_len=True)
        machine_model_id = random.choice(machine_model_ids)
        company_id = random.choice(company_ids)
        active = random.randint(0, 1)
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_machine = {
            "serial_number": serial_number,
            "machine_model_id": machine_model_id,   
            "company_id": company_id,
            "active": random.randint(0, 1),
            "created_date": created_date,
            "modified_date": modified_date,
        }
        result = conn.execute(machine_table.insert().values(novo_machine))
        machine_ids.append(result.inserted_primary_key[0])

    # Inserir registros em 'status'
    status_ids = []
    for _ in range(quantidade_status):
        description = random.choice(["Em andamento", "Concluído", "Cancelado", "Aberto", "Adiado"])
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_status = {
            "description": description,
            "created_date": created_date,
            "modified_date": modified_date,
        }
        result = conn.execute(status_table.insert().values(novo_status))
        status_ids.append(result.inserted_primary_key[0])

    # Inserir registros em 'appointment'
    appointments_ids = []
    for _ in range(quantidade_appointments):
        client_id = random.choice(client_ids)
        machine_id = random.choice(machine_ids)
        status_id = random.choice(status_ids)
        date_appointment = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        date_conclusion = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_appointment = {
            "client_id": client_id,
            "machine_id": machine_id,
            "status_id": status_id,
            "date_appointment": date_appointment,
            "date_conclusion": date_conclusion,
            "created_date": created_date,
            "modified_date": modified_date,
        }
        result = conn.execute(appointment_table.insert().values(novo_appointment))
        appointments_ids.append(result.inserted_primary_key[0])
        
    # Inserir registros em 'worker'
    worker_ids = []
    for _ in range(quantidade_workers):
        name = faker.name()
        role_id = random.choice(role_ids)
        admission_date = faker.date_between_dates(
            date_start=date(2008, 1, 1), date_end=date(2023, 12, 31)
        )
        verifed = random.randint(0, 1)
        active = random.randint(0, 1)
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_worker = {
            "name": name,
            "role_id": role_id,
            "admission_date": admission_date,
            "verified": verifed,
            "active": active,
            "created_date": created_date,
            "modified_date": modified_date,
        }
        result = conn.execute(worker_table.insert().values(novo_worker))
        worker_ids.append(result.inserted_primary_key[0])
    
    # Inserir registros em 'part'
    part_ids = []
    for _ in range(quantidade_parts):
        name = faker.name()
        description = faker.sentence()
        novo_part = {
            "name": name,       
            "description": description
        } 
        result = conn.execute(part_table.insert().values(novo_part))
        part_ids.append(result.inserted_primary_key[0])
        
        
    # Inserir registros em 'service'
    servece_ids = []
    for _ in range(quantidade_services):
        appointment_id = random.choice(appointments_ids)
        worker_id = random.choice(worker_ids)
        part_id = random.choice(part_ids)
        date_begin = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        date_conclusion = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        motive_reschedule = faker.word()
        client_signature = faker.name()
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_service = {
            "appointment_id": appointment_id,
            "worker_id": worker_id,
            "part_id": part_id,
            "date_begin": date_begin,
            "date_conclusion": date_conclusion,
            "motive_reschedule": motive_reschedule,
            "client_signature": client_signature,
            "created_date": created_date,
            "modified_date": modified_date
        }
        result = conn.execute(service_table.insert().values(novo_service))
        servece_ids.append(result.inserted_primary_key[0])    
        
    # Inserir registros em 'review'
    for _ in range(quantidade_reviews):
        service_id = random.choice(servece_ids)
        client_id = random.choice(client_ids)
        review_star = random.randint(1, 5)
        comment = faker.word()
        created_date = faker.date_between_dates(
            date_start=date(2010, 1, 1), date_end=date(2023, 12, 31)
        )
        modified_date = faker.date_between_dates(
            date_start=created_date, date_end=date(2023, 12, 31)
        )
        novo_review = {
            "service_id": service_id,
            "client_id": client_id,
            "review_star": review_star,
            "comment": comment,
            "created_date": created_date,
            "modified_date": modified_date
        }   
        result = conn.execute(review_table.insert().values(novo_review))

    conn.commit()
    
    
end_time = time.time()  # Fim da medição do tempo
execution_time = end_time - start_time  # Calcula o tempo de execução
print(f"Tempo de execução do script original: {execution_time:.2f} segundos")    

print(f"{quantidade_companies} registros inseridos na tabela 'company'.")
print(f"{quantidade_clientes} registros inseridos na tabela 'cliente'.")
print(f"{quantidade_roles} registros inseridos na tabela 'role'." )
print(f"{quantidade_machines_types} registros inseridos na tabela 'machine_type'.")
print(f"{quantidade_machines_models} registros inseridos na tabela 'machine_model'.")

print(f"{quantidade_machines} registros inseridos na tabela'machine'.")
print(f"{quantidade_status} registros inseridos na tabela 'status'.")
print(f"{quantidade_appointments} registros inseridos na tabela 'appointment'.")
print(f"{quantidade_workers} registros inseridos na tabela 'worker'.")
print(f"{quantidade_parts} registros inseridos na tabela'." )

print(f"{quantidade_services} registros inseridos na tabela'service'.")

print(f"{quantidade_reviews} registros inseridos na tabela'review'.")