import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const SingleForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `https://form-builder-server-ten.vercel.app/forms/${formId}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
        setError("Error fetching form data");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  const handleInputChange = (labelIndex, event) => {
    const updatedLabels = [...formData.labels];
    updatedLabels[labelIndex].name = event.target.value;

    setFormData({
      ...formData,
      labels: updatedLabels,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const labelsData = formData.labels.map((label) => ({ name: label.name }));

      await axios.post(
        "https://form-builder-server-ten.vercel.app/application",
        {
          labels: labelsData,
        }
      );

      console.log(
        "Form submitted successfully to https://form-builder-server-ten.vercel.app/application"
      );

      // Clear form data after successful submission
      setFormData({
        ...formData,
        labels: formData.labels.map((label) => ({ ...label, name: "" })),
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!formData) {
    return <p>No data found for form with ID {formId}</p>;
  }

  return (
    <div className="container mx-auto mt-8 p-8 bg-white shadow-lg rounded-md max-w-md">
      <h2 className="text-2xl font-semibold mb-4">{formData.title}</h2>
      <p className="text-gray-600 mb-4">{formData.description}</p>

      <form>
        {formData.labels.map((label, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Label {index + 1}:
            </label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-md w-full"
              value={label.name}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SingleForm;
