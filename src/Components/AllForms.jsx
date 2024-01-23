import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllForms = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/submits");
        setSubmissions(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching submissions:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleDelete = async (submissionId) => {
    try {
      // Send a DELETE request to your backend to delete the submission
      await axios.delete(`http://localhost:5000/submits/${submissionId}`);
      // Update the state by removing the deleted submission
      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((submission) => submission._id !== submissionId)
      );
    } catch (error) {
      console.error("Error deleting submission:", error.message);
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Loading submissions...</p>;
  }

  if (error) {
    return <p>Error loading submissions: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {submissions.map((submission) => (
        <div
          key={submission._id}
          className="bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 border-2"
        >
          <div className="p-6">
            <h3 className="text-lg text-sky-500 font-semibold mb-2">
              {submission.templateName} Form
            </h3>
            <p className="text-gray-600">{submission.description}</p>
          </div>
          <div className="flex items-center justify-between p-6 bg-gray-100">
            <button
              onClick={() => handleDelete(submission._id)}
              className="btn-sm bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-full focus:outline-none focus:shadow-outline-red"
            >
              Delete
            </button>
            <Link
              to={`/submits/${submission._id}`}
              className="btn-sm bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded-full focus:outline-none focus:shadow-outline-blue"
            >
              View Form
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllForms;
