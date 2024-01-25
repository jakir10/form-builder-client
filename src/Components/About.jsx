// import DynamicForm from "../assets/DynamicForm.svg"

import { Link } from "react-router-dom";

const About = () => {
    return (
        <div>
           <div className="hero min-h-screen bg-base-200">
  <div className="hero-content flex-col lg:flex-row-reverse">
    {/* <img src={DynamicForm} className="max-w-sm rounded-lg shadow-2xl" /> */}
    <img className="w-1/2" src="https://cdnimages.myclassboard.com/Website-2022/Erp/DynamicForms/Dynamic-Form-768x655.svg" alt="" />
    <div>
      <h1 className="text-5xl text-blue-500 font-bold">About Us</h1>
      <p className="py-6">Design your form and application with easy form-making and filling <br/>
        Create & customize your own form and submit edit update as per your need.</p>
      <Link to="/home"><button className="btn text-white bg-sky-700  hover:bg-sky-500 transition-transform transform hover:scale-105">Get Started</button></Link>
    </div>
  </div>
</div>
            
        </div>
    );
};

export default About;