# NeuraFlow AI — Full-Stack Landing Page

## Project Overview

NeuraFlow AI is a responsive landing page concept for an AI solutions startup. The project demonstrates frontend development, backend API integration, database management, and a secure admin dashboard.

**Live Website:** https://rahmathunissa.github.io/WebDeveloperProjects/Landing%20Page%20lab/04-ai-startup-flask/frontend/

**Admin Dashboard:** https://rahmathunissa.github.io/WebDeveloperProjects/Landing%20Page%20lab/04-ai-startup-flask/frontend/admin.html

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Python
- Flask
- SQLite for local development
- PostgreSQL for production
- Git and GitHub
- GitHub Pages
- Render

## Key Features

- Responsive startup landing page
- Contact and enquiry form
- Frontend-to-backend API integration
- Enquiry storage in a database
- Admin login with session-based authentication
- Admin dashboard to view and manage enquiries
- Protected admin API endpoints
- Cross-origin request configuration (CORS)
- Separate frontend and backend deployments

## Technical Architecture

**Frontend:** Hosted on GitHub Pages.

**Backend:** Flask REST API hosted on Render.

**Database:** PostgreSQL in production, with SQLite used during local development.

The frontend communicates with the Flask backend through API requests. Enquiries submitted through the contact form are stored in the database and can be viewed through the protected admin dashboard.

## Challenges and Solutions

### 1. Frontend and backend integration
Connected the static frontend to the Flask API using JavaScript fetch requests.

### 2. CORS configuration
Diagnosed and corrected an origin configuration issue that prevented the deployed frontend from communicating with the backend.

### 3. Database deployment
Configured PostgreSQL for production while retaining SQLite for local development.

### 4. Admin authentication
Implemented password verification and session-based authentication to protect admin operations.

### 5. Deployment and debugging
Deployed the frontend and backend separately and verified the live application.

## What I Learned

- Building and integrating REST APIs
- Working with Flask and relational databases
- Managing environment variables
- Deploying frontend and backend applications independently
- Debugging production issues
- Implementing basic authentication and access control
- Using Git and GitHub for version control

## Project Status

The application is deployed and its main functionality has been tested, including enquiry submission, database storage, admin login, enquiry viewing, and logout.

**Developer:** Rahmath Unissa