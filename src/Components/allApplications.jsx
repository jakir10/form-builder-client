import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `https://form-builder-server-ten.vercel.app/applications`
        );
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
      const url = `https://form-builder-server-ten.vercel.app/applications/${id}`;
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
    <div className="container mx-auto mt-8">
      <h2 className="text-4xl text-center font-bold mb-6 text-indigo-600">
        All Applications
      </h2>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr className="bg-indigo-500 text-white">
            <th className="border px-4 py-2 text-center">Sl NO</th>
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
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-center">
                {application.templateName}
              </td>
              <td className="border px-4 py-2 flex justify-center items-center">
                <Link
                  to={`/applications/${application._id}`}
                  className="text-indigo-600 hover:underline"
                >
                  View Details
                </Link>
              </td>
              <td>
                <button
                  onClick={() => deleteApplication(application._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 ml-2"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllApplications;
