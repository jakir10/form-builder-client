import { useState } from "react";
import axios from "axios";
// import * as XLSX from "xlsx";

const NonLifeInsuranceForm = () => {
  const [form, setForm] = useState({
    templateName: "",
    headings: [],
    headingsDataType: [],
    rows: [],
  });

  const [selectedDataType, setSelectedDataType] = useState("text");
  const [isAddHeadingModalOpen, setIsAddHeadingModalOpen] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [headingsAdded, setHeadingsAdded] = useState(false);
  const [isTemplateCreated, setIsTemplateCreated] = useState(false);

  const openCreateTemplateModal = () => {
    setIsCreateTemplateModalOpen(true);
  };

  const closeCreateTemplateModal = () => {
    setIsCreateTemplateModalOpen(false);
    setNewTemplateName("");
  };

  const openAddHeadingModal = () => {
    setIsAddHeadingModalOpen(true);
  };

  const closeAddHeadingModal = () => {
    setIsAddHeadingModalOpen(false);
    setNewHeading("");
  };

  const addHeading = () => {
    if (newHeading.trim() !== "") {
      setForm((prevForm) => ({
        ...prevForm,
        headings: [...prevForm.headings, newHeading],
        headingsDataType: [...prevForm.headingsDataType, selectedDataType],
      }));
      closeAddHeadingModal();
    }
  };

  const handleDataTypeChange = (e) => {
    setSelectedDataType(e.target.value);
  };

  const createTemplate = () => {
    if (newTemplateName.trim() !== "") {
      setForm((prevForm) => ({
        ...prevForm,
        templateName: newTemplateName,
      }));
      closeCreateTemplateModal();
      setIsTemplateCreated(true);
    }
  };

  const addRow = () => {
    setForm((prevForm) => {
      const newRow = { "Sl No": prevForm.rows.length + 1 };
      prevForm.headings.forEach((heading, index) => {
        newRow[heading] = ""; // Initialize with an empty string
        newRow[`${heading}-type`] = prevForm.headingsDataType[index]; // Set the data type for the column
      });
      return {
        ...prevForm,
        rows: [...prevForm.rows, newRow],
      };
    });
  };

  const removeRow = (index) => {
    setForm((prevForm) => {
      const updatedRows = [...prevForm.rows];
      updatedRows.splice(index, 1);
      return { ...prevForm, rows: updatedRows };
    });
  };

  const removeHeading = (index) => {
    setForm((prevForm) => {
      const updatedHeadings = [...prevForm.headings];
      updatedHeadings.splice(index, 1);

      const updatedHeadingsDataType = [...prevForm.headingsDataType];
      updatedHeadingsDataType.splice(index, 1);

      const updatedRows = prevForm.rows.map((row) => {
        const updatedRow = { ...row };
        delete updatedRow[prevForm.headings[index]];
        return updatedRow;
      });

      return { ...prevForm, headings: updatedHeadings, headingsDataType: updatedHeadingsDataType, rows: updatedRows };
    });
  };

  const handleSubmitForm = async () => {
    try {
      console.log("Form Submitted:", { form });
      const endpoint = "http://localhost:5000/submits";
      const payload = {
        templateName: form.templateName,
        headings: form.headings,
        headingsDataType: form.headingsDataType, // Include headingsDataType in the payload
        rows: form.rows,
      };
      const response = await axios.post(endpoint, payload); // Send payload instead of form directly
      if (response.status === 200) {
        setForm({
          templateName: "",
          headings: [],
          headingsDataType: [],
          rows: [],
        });
        console.log("Form data successfully submitted to the backend.");
      } else {
        console.error("Failed to submit form data to the backend.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  

  // const saveForm = async () => {
  //   try {
  //     // Make a POST request to save the form data
  //     const response = await axios.post("http://localhost:5000/submits", form);
  //     if (response.status === 200) {
  //       console.log("Form data saved successfully.");
  //     } else {
  //       console.error("Failed to save form data.");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while saving form data:", error);
  //   }
  // };

  return (
    <div className="container mx-auto mt-8 p-4">
      {!form.templateName && (
        <div className="flex justify-start mb-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
            onClick={openCreateTemplateModal}
          >
            Create Template
          </button>
          {/* <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
            onClick={saveForm}
          >
            Save Form
          </button> */}
        </div>
      )}

      {form.templateName && (
        <div>
          <h2 className="text-3xl font-bold mb-4 text-center">
            {form.templateName}
          </h2>

          {!headingsAdded && (
            <div className="flex justify-start mb-4">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
                onClick={openAddHeadingModal}
              >
                Add Heading
              </button>
            </div>
          )}

          {headingsAdded && (
            <div className="flex space-x-4 mb-4 items-center">
              <div className="flex items-center space-x-2">
                <span>Sl No</span>
                <button type="button" className="text-red-500">
                  &#10006;
                </button>
              </div>
              {form.headings.map((heading, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>{heading}</span>
                  <button
                    type="button"
                    className="text-red-500 transition-transform transform hover:scale-105"
                    onClick={() => removeHeading(index)}
                  >
                    &#10006;
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
                onClick={openAddHeadingModal}
              >
                Add Heading
              </button>
            </div>
          )}

          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Sl No</th>
                {form.headings.map((heading, index) => (
                  <th key={index} className="border px-4 py-2">
                    {heading}
                  </th>
                ))}
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {form.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.entries(row).map(([key, value], index) => (
                    <td key={index} className="border px-4 py-2">
                      {key === "Sl No" ? (
                        value
                      ) : (
                        <input
                          type="text"
                          value={value}
                          // onChange={(e) =>
                          //   handleInputChange(rowIndex, key, e.target.value)
                          // }
                          placeholder={key}
                          className="w-full"
                          // disabled={onChange}
                        />
                      )}
                    </td>
                  ))}
                  <td className="border px-4 py-2">
                    <button
                      type="button"
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2 transition-transform transform hover:scale-105"
                      onClick={() => removeRow(rowIndex)}
                    >
                      Remove Row
                    </button>
                    {/* {row["Sl No"] && (
                      <button
                        type="button"
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => addSubRow(row["Sl No"])}
                      >
                        Add Sub Row
                      </button>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
              onClick={addRow}
            >
              Add Row
            </button>
          </div>
        </div>
      )}

      {isAddHeadingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <label
              htmlFor="newHeading"
              className="block mb-2 text-lg font-bold"
            >
              New Heading:
            </label>
            <input
              type="text"
              id="newHeading"
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <label htmlFor="dataType" className="block mb-2 text-lg font-bold">
              Data Type:
            </label>
            <select
              id="dataType"
              value={selectedDataType}
              onChange={handleDataTypeChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="string">String</option>
            </select>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition-transform transform hover:scale-105"
                onClick={addHeading}
              >
                Add
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
                onClick={closeAddHeadingModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <label
              htmlFor="newTemplateName"
              className="block mb-2 text-lg font-bold"
            >
              New Template Name:
            </label>
            <input
              type="text"
              id="newTemplateName"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition-transform transform hover:scale-105"
                onClick={createTemplate}
              >
                Create
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
                onClick={closeCreateTemplateModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4">
        {isTemplateCreated && (
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
            onClick={handleSubmitForm}
          >
            Save Template
          </button>
        )}
      </div>
      {/* <div>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {excelData && (
          <table className="w-full border mb-4">
            <thead>
              <tr>
                {excelData[0].slice(2).map((header, index) => (
                  <th key={index} className="border px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border px-4 py-2">{row[0]}</td>
                  <td className="border px-4 py-2">{row[1]}</td>
                  {row.slice(2).map((cell, cellIndex) => (
                    <td key={cellIndex} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> */}
    </div>
  );
};

export default NonLifeInsuranceForm;
