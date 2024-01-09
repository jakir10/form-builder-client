import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";

const SingleForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  // const [fileUploadError, setFileUploadError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `https://form-builder-server-ten.vercel.app/submits/${formId}`
        );
        setFormData(response.data);
        initializeInputValues(response.data.headings);
      } catch (error) {
        console.error("Error fetching form data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const initializeInputValues = (headings) => {
    const initialInputValues = {};
    headings.forEach((heading, index) => {
      initialInputValues[`${heading}-${index}`] = "";
    });
    setInputValues(initialInputValues);
  };

  const handleInputChange = (heading, value) => {
    if (!editMode) {
      setInputValues((prevValues) => ({
        ...prevValues,
        [heading]: value,
      }));

      // Check if the value is empty and set an error message
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        [heading]: value.trim() === "" ? "This field is required." : null,
      }));
    }
  };

  const handleTemplateNameChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      templateName: e.target.value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmitForm = async () => {
    try {
      // Check if any input field is empty
      if (Object.values(inputValues).some((value) => value.trim() === "")) {
        // Display popup if there are errors
        setShowPopup(true);
        return;
      }

      // Group input values by Sl No
      const groupedInputValues = {};
      Object.entries(inputValues).forEach(([key, value]) => {
        const [heading, slNo] = key.split("-");
        if (!groupedInputValues[slNo]) {
          groupedInputValues[slNo] = { slNo };
        }
        groupedInputValues[slNo][heading] = value;
      });

      // Convert grouped input values to an array
      const rows = Object.values(groupedInputValues);

      const response = await axios.post(
        "https://form-builder-server-ten.vercel.app/application",
        {
          formId,
          templateName: formData.templateName,
          inputValues: {
            headings: formData.headings,
            rows,
          },
        }
      );

      console.log("Form submitted successfully:", response.data);

      navigate("/allForms");
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const addHeading = () => {
    setFormData((prevData) => ({
      ...prevData,
      headings: [...prevData.headings, newHeading],
    }));
    setNewHeading("");
  };

  const addRow = () => {
    setFormData((prevData) => ({
      ...prevData,
      rows: [...prevData.rows, { "Sl No": prevData.rows.length + 1 }],
    }));
  };

  const removeRow = () => {
    setFormData((prevData) => ({
      ...prevData,
      rows: prevData.rows.slice(0, -1),
    }));
  };

  const removeHeading = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      headings: prevData.headings.filter((_, i) => i !== index),
    }));
  };

  const saveTemplate = async () => {
    try {
      const { _id: existingFormId, ...formDataWithoutId } = formData;

      const response = await axios.post(
        "https://form-builder-server-ten.vercel.app/submits",
        formDataWithoutId
      );

      const newFormId = response.data.newFormId;
      console.log("Template saved successfully with new form ID:", newFormId);

      navigate(`/allForms`);
    } catch (error) {
      console.error("Error saving template:", error.message);
    }
  };

  const updateTemplate = async () => {
    try {
      const { _id: existingFormId, ...formDataWithoutId } = formData;

      const response = await axios.patch(
        `https://form-builder-server-ten.vercel.app/submits/${existingFormId}`,
        formDataWithoutId
      );

      console.log("Template updated successfully:", response.data);

      navigate(`/allForms`);
    } catch (error) {
      console.error("Error updating template:", error.message);
    }
  };

  if (loading) {
    return <p>Loading form...</p>;
  }

  if (error) {
    return <p>Error loading form: {error}</p>;
  }

  const { headings, rows } = formData;

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">
        {editMode ? (
          <input
            type="text"
            value={formData.templateName}
            onChange={handleTemplateNameChange}
            className="border rounded px-1 py-1 text-sm border-blue-500"
          />
        ) : (
          formData.templateName
        )}
      </h2>

      <table className="w-full border mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Sl No</th>
            {headings.map((heading, index) => (
              <th key={index} className="px-4 py-2">
                {heading}
                {editMode && (
                  <button
                    type="button"
                    className="ml-2 text-red-600"
                    onClick={() => removeHeading(index)}
                  >
                    &#10005;
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="px-4 py-2 text-center">{rowIndex + 1}</td>
              {headings.map((heading, index) => (
                <td key={index} className="px-4 py-2">
                  <input
                    type="text"
                    value={inputValues[`${heading}-${rowIndex}`] || ""}
                    placeholder={heading}
                    className="w-full border rounded px-1 py-1 my-1 text-sm border-blue-500"
                    onChange={(e) =>
                      handleInputChange(
                        `${heading}-${rowIndex}`,
                        e.target.value
                      )
                    }
                    readOnly={editMode}
                  />
                  {inputErrors[`${heading}-${rowIndex}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {inputErrors[`${heading}-${rowIndex}`]}
                    </p>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4 flex items-center justify-between">
        {<p className="text-red-500">{}</p>}

        <div className="flex">
          {editMode && (
            <div className="flex">
              <input
                type="text"
                value={newHeading}
                onChange={(e) => setNewHeading(e.target.value)}
                placeholder="New Heading"
                className="border rounded px-2 py-1 text-sm border-blue-500"
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                onClick={addHeading}
              >
                Add Heading
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                onClick={addRow}
              >
                Add Row
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                onClick={saveTemplate}
              >
                Save Template
              </button>
              {/* update */}
              <button
                type="button"
                className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
                onClick={updateTemplate}
              >
                Update Template
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                onClick={removeRow}
              >
                Remove Row
              </button>
            </div>
          )}
          <button
            type="button"
            className={`${
              editMode ? "bg-yellow-500" : "bg-blue-500"
            } text-white px-7 py-2  rounded ml-2 hover:bg-yellow-600 text-white font-bold focus:outline-none focus:shadow-outline-blue`}
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Cancel Edit" : "Edit"}
          </button>
          {!editMode && (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600 text-white font-bold focus:outline-none focus:shadow-outline-blue"
              onClick={handleSubmitForm}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-red-500">Please fill in all required fields.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleForm;
