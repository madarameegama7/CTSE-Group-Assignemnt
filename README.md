# 🏥 Online Medical Appointment Booking System  
### Microservice Architecture using Spring Boot & AWS ECS

---

## 📌 Project Overview

The **Online Medical Appointment Booking System** is a cloud-based microservice application that allows:

- 👤 Patients to book and manage doctor appointments
- 👨‍⚕️ Doctors to manage availability and view appointments
- 👨‍💼 Admins to manage doctors and system users

The system is built using **Spring Boot microservices**, containerized with **Docker**, and deployed on **AWS ECS Fargate** with CI/CD automation.

---

## 🏗️ Architecture Overview

The system follows a **Microservice Architecture** deployed on AWS.

### 🔹 Core Components

- API Gateway & AWS ALB (Routing & HTTPS)
- 4 Spring Boot Microservices
- Separate Databases for each service
- Docker Containers
- CI/CD using GitHub Actions
- AWS ECS Fargate Deployment

---

## 🧩 Microservices

### 1️⃣ Authentication Service
Handles:
- User Registration
- Login
- JWT Token Generation
- Role-Based Access Control (RBAC)

**Roles:**
- PATIENT
- DOCTOR
- ADMIN

---

### 2️⃣ Doctor Service
Handles:
- Add / View Doctors
- Manage Availability Slots
- Check Slot Availability

---

### 3️⃣ Appointment Service
Core business logic:
- Book Appointment
- Cancel Appointment
- View Patient Appointments
- Update Appointment Status

Integrates with:
- Auth Service (Token validation)
- Doctor Service (Slot verification)
- Notification Service (Send confirmation)

---

### 4️⃣ Notification Service
Handles:
- Appointment Confirmation Notifications
- Cancellation Notifications
- Reminder Alerts

---

## 🔄 Service Communication

Services communicate using **REST APIs (OpenFeign)**.

Example Flow (Booking Appointment):

1. Patient sends booking request
2. Appointment Service validates JWT via Auth Service
3. Appointment Service checks slot via Doctor Service
4. Appointment saved in database
5. Notification Service sends confirmation

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| Backend | Spring Boot 3 |
| Security | Spring Security + JWT |
| Communication | REST + OpenFeign |
| Database | MongoDB / PostgreSQL (per service) |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| SAST | SonarCloud |
| Deployment | AWS ECS Fargate |
| Cloud | AWS |

---

## 🔐 Security Implementation

- JWT Authentication
- Role-Based Authorization
- IAM Least Privilege Policies
- AWS Security Groups
- Secrets stored in GitHub Secrets & AWS Environment Variables
- HTTPS enabled via AWS ALB

---

## 🐳 Docker Setup

Each microservice contains:

- Dockerfile
- application.yml
- Environment configuration

Build locally:

```bash
docker build -t service-name .
docker run -p 8080:8080 service-name
```

---

## 🚀 CI/CD Pipeline

Implemented using **GitHub Actions**.

Pipeline Steps:

1. Build Project
2. Run Unit Tests
3. SonarCloud SAST Scan
4. Build Docker Image
5. Push Image to Docker Hub
6. Deploy to AWS ECS Fargate

---

## ☁️ AWS Deployment

Deployment Architecture:

- AWS ECS Fargate (Container hosting)
- Application Load Balancer
- IAM Roles
- Private networking for databases

All services are publicly accessible via HTTPS endpoints.

---

## 📂 Project Structure (Monorepo Example)

```
medical-appointment-system/
│
├── auth-service/
├── doctor-service/
├── appointment-service/
├── notification-service/
└── README.md
```

---

## 👨‍💻 Team Contribution

Each team member is responsible for:

- Designing one microservice
- Database design
- API implementation
- Dockerization
- CI/CD configuration
- Cloud deployment
- Security implementation

---

## 🎯 Key Features

✔ Microservice architecture  
✔ Independent databases  
✔ Secure authentication  
✔ Inter-service communication  
✔ DevSecOps integration  
✔ Cloud-native deployment  
✔ Scalable containerized infrastructure  

---

## 📌 Future Improvements

- Payment Integration
- SMS Gateway Integration
- Kubernetes Migration
- Centralized Logging (ELK Stack)
- Monitoring with AWS CloudWatch

---

## 📜 License

This project is developed for academic purposes.

---

## 🙌 Acknowledgment

Developed as part of a Cloud & DevOps assignment using:

- Spring Boot
- AWS ECS
- Docker
- GitHub Actions
- SonarCloud

---

⭐ If you found this project useful, feel free to star the repository!
