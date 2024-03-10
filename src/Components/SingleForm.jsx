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
  const [selectedDataType, setSelectedDataType] = useState("text"); // New state for selected data type
  // const [fileUploadError, setFileUploadError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/submits/${formId}`
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

      setInputErrors((prevErrors) => ({
        ...prevErrors,
        [heading]: null, // Clear error message initially
      }));
    }
  };

  const handleInputFocus = (heading, value) => {
    if (!editMode) {
      let errorMessage = null;

      // Retrieve data type for the current heading
      const headingIndex = formData.headings.indexOf(heading);
      const dataType = formData.headingsDataType[headingIndex];

      // Perform data type validation
      if (dataType === "number" && isNaN(Number(value))) {
        errorMessage = `Invalid input. Please enter a number for ${heading}.`;
      } else if (dataType === "text" && !/^[a-zA-Z\s]*$/.test(value.trim())) {
        errorMessage = `Invalid input. ${heading} should contain only alphabetic characters and whitespace.`;
      } else if (dataType === "string" && typeof value !== "string") {
        errorMessage = `Invalid input. ${heading} should be a string.`;
      }

      // Set the error message for the input field
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        [heading]: errorMessage,
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
      // Initialize grouped input values
      const groupedInputValues = {};

      // Initialize flag to track if there are invalid inputs
      let hasInvalidInputs = false;

      // Initialize flag to track if any input field is empty
      let isEmptyInput = false;

      // Iterate through each row index
      for (let i = 0; i < formData.rows.length; i++) {
        // Check if all input fields in this row are filled out
        const isRowComplete = formData.headings.every((heading, index) => {
          const value = inputValues[`${heading}-${i}`];
          if (value.trim() === "") {
            isEmptyInput = true;
          }
          return value.trim() !== ""; // Check if the value is not empty
        });

        if (!isRowComplete) {
          // Show error message and return if any row has empty input
          alert("Please fill out all the input fields.");
          return;
        }

        // Initialize an object to hold input values for the current row
        const rowValues = {};

        // Iterate through each heading to gather input values for the current row
        formData.headings.forEach((heading, index) => {
          const value = inputValues[`${heading}-${i}`];
          const dataType = formData.headingsDataType[index];

          // Validate data type for the column
          if (dataType === "number" && isNaN(Number(value))) {
            setInputErrors((prevErrors) => ({
              ...prevErrors,
              [`${heading}-${i}`]: `Invalid input. Please enter a number for ${heading}.`,
            }));
            hasInvalidInputs = true;
          } else if (dataType === "text" && !/^[a-zA-Z]+$/.test(value.trim())) {
            setInputErrors((prevErrors) => ({
              ...prevErrors,
              [`${heading}-${i}`]: `Invalid input. ${heading} should contain only alphabetic characters.`,
            }));
            hasInvalidInputs = true;
          } else if (dataType === "string" && typeof value !== "string") {
            setInputErrors((prevErrors) => ({
              ...prevErrors,
              [`${heading}-${i}`]: `Invalid input. ${heading} should be a string.`,
            }));
            hasInvalidInputs = true;
          }

          rowValues[heading] = value;
        });

        // Add the current row to grouped input values
        groupedInputValues[i] = rowValues;
      }

      // If there are invalid inputs, show red input boxes with error messages
      if (hasInvalidInputs) {
        // Prevent form submission
        return;
      }

      // Convert grouped input values to an array
      const rows = Object.values(groupedInputValues);

      const response = await axios.post("http://localhost:5000/application", {
        formId,
        templateName: formData.templateName,
        inputValues: {
          headings: formData.headings,
          headingsDataType: formData.headingsDataType, // Include headingsDataType
          rows,
        },
      });

      console.log("Form submitted successfully:", response.data);

      navigate("/allForms");
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const handleDataTypeChange = (e) => {
    setSelectedDataType(e.target.value);
  };

  const addHeading = () => {
    if (newHeading.trim() !== "") {
      const updatedRows = formData.rows.map((row, rowIndex) => {
        const updatedRow = { ...row };
        // Copy data from the previous row if it exists
        const previousRow = formData.rows[rowIndex - 1];
        if (previousRow) {
          updatedRow[newHeading] = previousRow[newHeading] || "";
        } else {
          updatedRow[newHeading] = ""; // If no previous row exists, set it to an empty string
        }
        return updatedRow;
      });

      setFormData((prevData) => ({
        ...prevData,
        headings: [...prevData.headings, newHeading],
        headingsDataType: [...prevData.headingsDataType, selectedDataType], // Add selected data type
        rows: updatedRows, // Update rows with the new heading
      }));
      setNewHeading("");
    }
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
    setFormData((prevData) => {
      const updatedHeadings = [...prevData.headings];
      updatedHeadings.splice(index, 1);

      const updatedHeadingsDataType = [...prevData.headingsDataType];
      updatedHeadingsDataType.splice(index, 1);

      // Remove the column corresponding to the removed heading from each row
      const updatedRows = prevData.rows.map((row) => {
        const updatedRow = { ...row };
        delete updatedRow[prevData.headings[index]];
        return updatedRow;
      });

      return {
        ...prevData,
        headings: updatedHeadings,
        headingsDataType: updatedHeadingsDataType,
        rows: updatedRows,
      };
    });
  };

  const saveTemplate = async () => {
    try {
      const { _id: existingFormId, ...formDataWithoutId } = formData;

      const response = await axios.post(
        "http://localhost:5000/submits",
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
        `http://localhost:5000/submits/${existingFormId}`,
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
                    className="ml-2 text-red-600 hover:font-bold transform hover:scale-125"
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
                    className={`w-full border rounded px-1 py-1 my-1 text-sm ${
                      inputErrors[`${heading}-${rowIndex}`]
                        ? "border-red-500"
                        : "border-blue-500"
                    }`}
                    onChange={(e) =>
                      handleInputChange(
                        `${heading}-${rowIndex}`,
                        e.target.value
                      )
                    }
                    onFocus={() =>
                      handleInputFocus(
                        `${heading}-${rowIndex}`,
                        inputValues[`${heading}-${rowIndex}`] || ""
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
              <select
                value={selectedDataType}
                onChange={handleDataTypeChange}
                className="border rounded px-2 py-1 ml-2 text-sm border-blue-500"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="string">String</option>
              </select>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600 transition-transform transform hover:scale-105"
                onClick={addHeading}
              >
                Add Heading
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600 transition-transform transform hover:scale-105"
                onClick={addRow}
              >
                Add Row
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-600 transition-transform transform hover:scale-105"
                onClick={saveTemplate}
              >
                Save Template
              </button>
              {/* update */}
              <button
                type="button"
                className="bg-yellow-500 text-white px-4 py-2 rounded ml-2 hover:bg-yellow-600 transition-transform transform hover:scale-105"
                onClick={updateTemplate}
              >
                Update Template
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600 transition-transform transform hover:scale-105"
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
            } text-white px-7 py-2  rounded ml-2 hover:bg-yellow-600 font-bold focus:outline-none focus:shadow-outline-blue transition-transform transform hover:scale-105`}
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Cancel Edit" : "Edit"}
          </button>
          {!editMode && (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600 font-bold focus:outline-none focus:shadow-outline-blue hover:bg-blue-600 transition-transform transform hover:scale-105"
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
