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
# Auto-Fixer Registration

One-page web app for the Auto-Fixer startup that allows users to:

- Register with their email  

- Upload a short promotional video via Google Drive API  

- Pay a small registration fee (R20) to support the app launch  



Built with **React**, **Node.js**, and **Tailwind CSS**.


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


**Day 5**

- Responsive landing page with a **Register** button

- Fully functional registration form with fields:

  - Name

  - Email

  - Phone

  - Amount

  - Optional message

- Form validation before submission (checks for empty fields, valid email & phone)

- Shows success ✅ / error ❌ messages

- `/api/register` endpoint to store registration data

- `/api/pay` endpoint simulating payment processing

- Error handling on the backend (returns JSON errors instead of crashing)
- Basic Jest + Supertest tests for `/api/register`
- Tests verify correct status codes for valid & invalid submissions

**Day 6**
Added Features:
- Video upload (mock)
- Mock R20 payment flow

**Day 7**
Additions:
- Modern, responsive landing page with animated gradient and step-by-step UI  

- Registration form (Name, Email, Phone)  

- Video upload (mock placeholder — real Google Drive upload coming next)  

- Mock R20 payment confirmation  

- Dynamic success screen  

- Clean UI and mobile-friendly design  


**Day 8**

- Fixed all UI alignment and responsiveness issues across all pages (Landing, Register, Payment, Upload Video, Success)

- Improved the overall look — modern blue theme, centered text, clean spacing, and mobile-friendly design

- Added navigation buttons to return to the Landing Page from all other pages

- Added an “About AutoFixer” section so users can actually learn about the platform
Explained how AutoFixer connects car owners with top local mechanics

- Fixed payment and success page redirect flow (no more “Network Error”)

- Ensured all forms, buttons, and text elements are responsive and consistent
SS
- Cleaned up folder structure and code for production readiness

Fix: Implemented registration and Paystack payment flow

- Set up the backend API for handling user registration, file upload, and Paystack payment initialization.
- Added frontend components for registering user details and uploading a video.
- Integrated Paystack transaction creation in backend with error handling and response logging.
- Improved error handling on frontend with form validation.
- Debugging implemented on both backend and frontend to log API responses and identify issues.
- Currently investigating "Failed to Fetch" error with Paystack API.

Known issue:
- The Paystack payment flow 