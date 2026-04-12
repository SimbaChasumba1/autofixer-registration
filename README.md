# AutoFixer Registration Platform

AutoFixer Registration Platform is a full-stack web application built to support the early-stage launch of the AutoFixer startup.

The application guides users through a structured multi-step flow where they can:

- Learn about the AutoFixer platform  
- Register their personal details  
- Upload a short promotional video  
- Complete a small registration payment to support the launch  

This project was built as a **real-world client-style application** and forms part of my professional portfolio.


# Project Overview

AutoFixer aims to connect car owners with trusted, verified mechanics in their local area.

This registration platform was designed to:

- Capture early user interest  
- Collect promotional video content for marketing  
- Validate demand ahead of the public launch  

The application uses a **multi-screen workflow** with dedicated pages for:

- Onboarding  
- Registration  
- Payment  
- Video upload  
- Confirmation  


# Tech Stack

## Frontend

- React  
- Tailwind CSS  
- Vite  

## Backend

- Node.js  
- Express  

## Database & Storage

- Supabase (video & file storage)

## Payments

- Paystack API  

## Hosting

- Frontend: Vercel  
- Backend: Render  


# Key Features

- Multi-step user registration workflow  
- Responsive, mobile-first UI  
- Form validation with success and error states  
- Secure video uploads using Supabase Storage  
- R20 registration payment integration  
- Backend API for registration, uploads, and payments  
- Clean separation between frontend and backend logic  


# Development Timeline (Condensed)

## Phase 1 – Setup & Foundation

- React frontend initialized with Tailwind CSS  
- Express backend configured with environment variables  
- Frontend and backend connected locally  
- Basic landing page and form layout created  

## Phase 2 – Registration Flow

- Registration form connected to backend API  
- Input validation implemented  
- API routes created for registration and payments  
- Responsive UI improvements added  

## Phase 3 – Payments & Uploads

- Paystack payment integration implemented  
- Video upload system built using Supabase Storage  
- Success and confirmation flows added  
- Navigation between screens finalized  

## Phase 4 – Polish & Stability

- UI alignment and responsiveness fixes  
- Improved error handling and logging  
- Folder structure cleanup  
- Production-readiness improvements  


# Known Limitations

- Payment flow requires valid Paystack credentials for live transactions  
- No admin dashboard included in this version  
- Additional security hardening would be required for large-scale production use

# Running the Project Locally

```bash
git clone https://github.com/SimbaChasumba1/autofixer-registration.git

cd autofixer-registration

npm install