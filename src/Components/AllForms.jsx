import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AllForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(
          "https://form-builder-server-ten.vercel.app/forms"
        );
        setForms(response.data);
      } catch (error) {
        console.error("Error fetching forms:", error.message);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="flex flex-wrap -mx-4">
      {forms.map((form) => (
        <Link
          key={form._id}
          to={`/forms/${form._id}`}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-4 mb-4"
        >
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-2">{form.title}</h3>
            <p className="text-gray-600">{form.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AllForms;
