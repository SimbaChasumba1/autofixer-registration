import React from "react";

import { Link } from "react-router-dom";



export default function NotFound(){

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="text-center">

        <h1 className="text-3xl font-bold mb-2">404</h1>

        <p className="mb-4">Page not found</p>

        <Link to="/" className="text-blue-600 hover:underline">Return home</Link>

      </div>

    </div>

  );

}





