import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/applications`);
        setApplications(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const deleteApplication = (id) => {
    const proceed = window.confirm("Are you sure you want to delete?");
    if (proceed) {
      console.log("delete application", id);
      const url = `http://localhost:5000/applications/${id}`;
      axios
        .delete(url)
        .then((response) => {
          console.log(response.data);
          const remaining = applications.filter((app) => app._id !== id);
          setApplications(remaining);
        })
        .catch((error) => {
          console.error("Error deleting application:", error);
        });
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="container mx-auto mt-8 mb-8">
      <h2 className="text-4xl text-center font-bold mb-6 text-indigo-600">
        All Applications
      </h2>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr className="bg-indigo-500 text-white">
            <th className="border px-2 py-2 text-center">Sl NO</th>
            <th className="border px-4 py-2 text-center">Application Name</th>
            <th className="border px-4 py-2 text-center">Link</th>
            <th className="border px-4 py-2 w-40 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application, index) => (
            <tr
              key={application._id}
              className="hover:bg-gray-100 transition duration-300"
            >
              <td className="border px-4 py-2 text-center text-indigo-700">{index + 1}</td>
              <td className="border px-4 py-2 text-center text-base font-semibold text-indigo-700 transition-transform transform hover:scale-105">
                {application.templateName}
              </td>
              <td className="border px-4 py-2 flex justify-center items-center">
                <Link
                  to={`/applications/${application._id}`}
                  className="text-indigo-500 hover:text-indigo-600 font-bold  transition-transform transform hover:scale-110 "
                >
                  View Details
                </Link>
              </td>
              <td>
                <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => deleteApplication(application._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-700 ml-2 transition-transform transform hover:scale-105"
                >
                  Remove
                </button>
                  
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllApplications;
