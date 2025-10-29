import React, { useState, useEffect } from "react";

import axios from "axios";



const RegistrationsPage = () => {

  const [registrations, setRegistrations] = useState([]);



  useEffect(() => {

    const fetchRegistrations = async () => {

      try {

        const res = await axios.get("http://localhost:5000/api/registrations");

        setRegistrations(res.data);

      } catch (err) {

        console.error(err);

      }

    };

    fetchRegistrations();

  }, []);



  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">All Registrations</h1>

      <ul>

        {registrations.map((r, i) => (

          <li key={i}>{r.name} - {r.email} - {r.phone}</li>

        ))}

      </ul>

    </div>

  );

};



export default RegistrationsPage;