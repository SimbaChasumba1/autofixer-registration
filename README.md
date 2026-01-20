<<<<<<< HEAD
AutoFixer Registration Platform





AutoFixer Registration Platform is a full-stack web application built to support the early-stage launch of the AutoFixer startup.



The app guides users through a multi-step flow where they can:



Learn about the AutoFixer platform
Register their personal details
Upload a short promotional video
Complete a small registration payment to support the launch




This project was built as a real-world client-style application and forms part of my professional portfolio.









- Project Overview





AutoFixer aims to connect car owners with trusted, verified mechanics in their local area.

This registration platform was designed to:



Capture early user interest
Collect promotional video content for marketing
Validate demand ahead of the public launch




The application is not a single-page app, but a multi-screen flow with dedicated pages for onboarding, registration, payment, video upload, and confirmation.









- Tech Stack





Frontend



React
Tailwind CSS
Vite




Backend



Node.js
Express




Database & Storage



Supabase (PostgreSQL & file storage)




Payments



Paystack API




Hosting



Frontend: Vercel
Backend: Render










- Key Features





Multi-step user registration flow
Responsive, mobile-first UI across all screens
Form validation with clear success and error states
Secure video upload using Supabase Storage
R20 registration payment via Paystack
Backend API for registration, uploads, and payments
Clean separation of frontend and backend concerns










- Development Timeline (Condensed)







Phase 1 – Setup & Foundation





React frontend initialized with Tailwind CSS
Express backend setup with environment configuration
Frontend and backend connected locally
Basic landing page and form layout






Phase 2 – Registration Flow





Registration form connected to backend API
Input validation and error handling
API routes created for registration and payments
Responsive UI improvements






Phase 3 – Payments & Uploads





Paystack payment initialization and handling
Video upload flow implemented using Supabase Storage
Success and confirmation screens added
Navigation between screens finalized






Phase 4 – Polish & Stability





UI alignment and responsiveness fixes
Improved error handling and logging
Folder structure cleanup
Production-readiness improvements










- Known Limitations





Payment flow requires valid Paystack credentials for live transactions
Admin dashboard is not included in this version
Additional security hardening would be required for large-scale production use










- Running the Project Locally



git clone https://github.com/SimbaChasumba1/autofixer-registration.git

cd autofixer-registration

npm install

Create a .env file with the required environment variables, then:

npm run dev









- Notes





This project was built to simulate real client delivery rather than a tutorial-style demo.

It focuses on clarity, maintainability, and realistic product flows rather than feature overload.