import NonLifeInsuranceForm from "./NonLifeInsuranceForm";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-500 text-white py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 animate__animated animate__lightSpeedInLeft">
            Build Your Custom Forms with Ease!
          </h1>
          <p className="text-lg animate__animated animate__lightSpeedInRight">
            Create personalized forms effortlessly using our dynamic form
            builder.
          </p>
          <Link
            to="/"
            className="mt-4 bg-white text-blue-500 hover:bg-blue-100 py-2 px-4 rounded-full inline-block transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto mt-8">
        <NonLifeInsuranceForm />
      </div>
    </div>
  );
};

export default Home;
