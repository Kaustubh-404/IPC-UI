import React from 'react';
import { Button , buttonVariants } from "./ui/button";
import { Link } from 'react-router-dom';
import "../globals.css"

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

        <h1 className="">Welcome To IPC-UI</h1>

       <Link className={buttonVariants({ variant: "outline" })} to="/a">
          Get Started
        </Link>

    </div>
  );
}

export default HomePage;
