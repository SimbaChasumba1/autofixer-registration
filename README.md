<<<<<<< HEAD
# AutoFixer Registration & Launch Support Page

A one-page web app built for the **AutoFixer** startup to allow users to:
- Register with their email
- Upload a short promotional video
- Pay a small registration fee (R20) to support the app’s December launch

This project was created as part of my portfolio and to assist a real startup initiative.


# Tech Stack

**Frontend:** React, Tailwind CSS  
**Backend:** Node.js (Express)  
**Database:** MongoDB (Atlas)  
**Payment Integration:** Paystack API  
**Video Storage / Upload:** Google Drive API  
**Hosting:** Vercel (frontend) & Render (backend)



# Features

- Simple and clean registration interface  
- Secure video upload (via Google Drive API)  
- R20 registration payment using Paystack  
- Admin access to view registered users and videos  
- Responsive, mobile-first UI  



# Project Purpose

AutoFixer aims to connect car owners with verified mechanics in their area.  
This registration site is designed to:
- Build early community interest  
- Allow users to contribute to the project’s launch  
- Collect promotional video content for marketing



# Project Setup

**To run locally:**

```bash
git clone https://github.com/SimbaChasumba1/autofixer-registration.git
cd autofixer-registration
npm install
=======
# autofixer-registration
One-page web app built for Auto-Fixer startup to allow users to register with email, upload a short promotional video via Google Drive API and pay a registration fee of R20 to support the app launch. Built with React, Node.js, Tailwind CSS, and MongoDB.
>>>>>>> d36ca613a3e77a77e59292e17136d8322bf54038


### 🧱 Project Progress Log

**Day 1 Update**  
- Initialized React frontend  
- Installed Tailwind CSS  
- Setup Express backend  
- Connected frontend and backend locally  
- Verified CORS and API test working
- Created GitHub repo and initial structure (`client/` + `server/`)
- Installed dotenv and nodemon
- Configured `.gitignore` and environment variables
- Basic landing page setup with form layout
- Verified backend is running (`npm run dev`)
**Challenges:** Tailwind installation errors on Windows (resolved)
**Next Goal:** Connect form to backend API and save submissions


**Day 2 Update**
- Add `/api/register` POST route to save data locally
- Connect frontend form using `fetch()`
- Display success or error messages
- Commit and push changes to GitHub

**Day 3 Update**
 - Create a responsive landing page for AutoFixer using React and Tailwind CSS.
- Landing page with “About” section and “Register” button  
- Clean, mobile-friendly design  
- Deployed locally with Vite + Tailwind

 **Day 4 Update** 
- Connected the frontend registration form to a backend API.
- Express.js server handling POST `/register`
- Registration form on React frontend
- Connected via Fetch API
- Stores mock data in memory (no DB yet)
- Validation for missing inputs


