# <p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?size=45&duration=3000&pause=800&color=00F7FF&center=true&vCenter=true&width=700&lines=&nbsp;&nbsp;&nbsp;&nbsp;✉️+Web-Based+Mail+System;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;♾️MailTwist" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-SpringBoot-success" />
  <img src="https://img.shields.io/badge/Frontend-Angular-red" />
  <img src="https://img.shields.io/badge/API-REST-orange" />
</p>


<h2 align="center">🚀 Project Preview</h2>

<p align="center">
  <img src="https://github.com/salmoza/MailServer/blob/main/Screenshot%202026-02-06%20173420.png?raw=true" width="800"/>
</p>



A modern full-stack web-based mail application built using **Spring Boot** and **Angular**, designed to simulate real-world email platforms while applying advanced software engineering principles and design patterns.

---

## 📌 Overview

The Web-Based Mail System is a full-stack email management platform that allows users to send, receive, organize, and manage emails efficiently. The system focuses on scalability, clean architecture, and maintainable code.

The application includes advanced capabilities such as filtering, sorting strategies, draft snapshots, attachment management, and customizable folders.

---

## 🚀 Features

- User authentication (Sign up / Sign in)
- Compose and send emails
- A draft system that supports versioned snapshots with history and retrieval
- AI-generated email body
- Folder organization (Inbox, Sent, Drafts, Trash + Custom folders)
- Advanced search and filtering
- Directing specific mails to a custom folders using advanced filtering 
- Auto deletion 
- Multiple sorting strategies
- Attachment upload and download
- Contacts management
- Pagination for performance optimization

---

## 🎯 Objectives

- Apply software engineering design patterns in a real-world project.
- Build scalable REST APIs using Spring Boot.
- Develop a responsive frontend using Angular.
- Maintain clean architecture with separation of concerns.
- Implement flexible filtering and sorting mechanisms.
- Practice full-stack development workflow.

---

## 🛠️ Technologies Used

### Backend

- Java
- Spring Boot
- Spring Data JPA
- H2 Database
- Lombok

### Frontend

- Angular
- TypeScript
- HTML
- CSS

### Architecture

- RESTful API
- Layered Architecture
- Design Pattern Driven Development

---

## ⚙️ How To Run The Project

### 🔹 Backend (Spring Boot)

#### Requirements

- Java 17+
- Maven

#### Run

```bash
git clone <repo-url>
cd MailServer/backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080/
```

---

### 🔹 Frontend (Angular)

#### Requirements

- Node.js 18+
- Angular CLI

#### Run

```bash
cd MailServer_frontend
npm install
ng serve
```

Frontend runs on:

```
http://localhost:4200/
```

---

## 🧩 Design Patterns Used

### 🏭 Factory Pattern
Used to centralize object creation and simplify request handling.

### 🎯 Strategy Pattern
Implements multiple sorting algorithms (date, priority, sender, subject).

### 🔗 Chain of Responsibility
Handles authentication validation through chained handlers.

### 🔎 Filter / Criteria Pattern
Supports advanced search and automatic email filtering.

### 🏗️ Builder Pattern
Simplifies creation of complex objects like MailDTO and Snapshots.

### 📸 Memento Pattern
Stores draft snapshots allowing restoration of previous states.

### 🧱 Facade Pattern
Service layer hides complex subsystem interactions from controllers.

### 🧍 Singleton Pattern
Ensures single instances for services, controllers, and repositories.
