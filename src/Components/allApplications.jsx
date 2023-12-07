import { useState, useEffect } from "react";
import axios from "axios";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "https://form-builder-server-ten.vercel.app/applications"
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

  if (loading) {
    return <div>Loading...</div>;
  }

  const applicationCount = applications.length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-3xl font-semibold mb-4">All Applications</h2>
        <p className="text-lg mb-8">
          Number of Applications: {applicationCount}
        </p>
      </div>
    </div>
  );
};

export default AllApplications;
