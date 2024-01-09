import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const SingleApplications = () => {
  const { applicationId } = useParams();
  const [applicationData, setApplicationData] = useState({
    inputValues: {
      headings: [],
      rows: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRow, setNewRow] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/applications/${applicationId}`
        );
        setApplicationData(response.data);
      } catch (error) {
        console.error("Error fetching application data:", error);
        setError("Error fetching application data");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [applicationId]);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (heading, value) => {
    setNewRow((prevRow) => ({ ...prevRow, [heading]: value }));
  };

  const handleAddRowClick = () => {
    setApplicationData((prevData) => ({
      ...prevData,
      inputValues: {
        ...prevData.inputValues,
        rows: [...prevData.inputValues.rows, newRow],
      },
    }));

    setNewRow({});
  };

  const handleRemoveRowClick = (rowIndexToRemove) => {
    setApplicationData((prevData) => {
      const updatedRows = prevData.inputValues.rows.filter(
        (_, index) => index !== rowIndexToRemove
      );

      return {
        ...prevData,
        inputValues: {
          ...prevData.inputValues,
          rows: updatedRows,
        },
      };
    });
  };

  const handleSaveClick = async () => {
    try {
      // Send a request to save the data using the PATCH method
      await axios.patch(`http://localhost:5000/applications/${applicationId}`, {
        inputValues: {
          rows: applicationData.inputValues.rows,
        },
      });

      // Notify the user that data has been saved (you may want to show a success message)
      alert("Data saved successfully!");

      // Reload the page to exit the edit mode and see the saved data
      window.location.reload();
    } catch (error) {
      console.error("Error saving data:", error.message);
      // Notify the user that an error occurred during saving
      alert("Error saving data. Please try again.");
    }
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming there is only one sheet in the Excel file
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert Excel sheet data to JSON
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Validate heading names
        const excelHeadings = excelData[0];
        if (
          excelHeadings.length !==
            applicationData.inputValues.headings.length ||
          !applicationData.inputValues.headings.every((heading) =>
            excelHeadings.includes(heading)
          )
        ) {
          alert(
            "Excel file heading names do not match. Please check and try again."
          );
          return;
        }

        // Create a new array with matched data
        const matchedRows = excelData.slice(1).map((row) => {
          const newRow = {};
          excelHeadings.forEach((heading, index) => {
            newRow[heading] = row[index];
          });
          return newRow;
        });

        // Update application data
        setApplicationData((prevData) => ({
          ...prevData,
          inputValues: {
            ...prevData.inputValues,
            rows: [...prevData.inputValues.rows, ...matchedRows],
          },
        }));

        alert("Excel data imported successfully!");
      };

      reader.readAsArrayBuffer(file);
    }
  };

  if (loading) {
    return <p className="text-center mt-8 text-blue-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  if (!applicationData) {
    return (
      <p className="text-center mt-8 text-yellow-500">
        No data found for application with ID {applicationId}
      </p>
    );
  }

  const { headings, rows } = applicationData.inputValues;

  return (
    <div className="container mx-auto mt-8 bg-gray-100 p-8 rounded-lg">
      <h1 className="text-4xl text-center font-bold mb-6 text-indigo-600">
        {applicationData.templateName} Form
      </h1>
      <table className="table-auto w-full border-collapse border border-gray-800 bg-white shadow-md">
        <thead>
          <tr className="bg-indigo-500 text-white">
            <th className="border px-4 py-2 w-20">Sl No</th>
            {headings &&
              headings.map((heading, index) => (
                <th
                  key={index}
                  className="border px-4 py-2 text-left capitalize text-center"
                >
                  {heading}
                </th>
              ))}
            {isEditing && (
              <th className="border px-4 py-2 text-center">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <td className="border px-4 py-2 text-center">{rowIndex + 1}</td>
              {headings.map((heading, headingIndex) => (
                <td key={headingIndex} className="border px-4 py-2 text-center">
                  {row[heading]}
                </td>
              ))}
              {isEditing && (
                <td className="border px-4 py-2 text-center">
                  <button
                    className="text-red-600"
                    onClick={() => handleRemoveRowClick(rowIndex)}
                  >
                    &#10005; Remove Row
                  </button>
                </td>
              )}
            </tr>
          ))}
          {isEditing && (
            <tr
              className={`${
                rows.length % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <td className="border px-4 py-2 text-center">
                {rows.length + 1}
              </td>
              {headings.map((heading, headingIndex) => (
                <td key={headingIndex} className="border px-4 py-2 text-center">
                  <input
                    type="text"
                    value={newRow[heading] || ""}
                    placeholder={heading}
                    className="w-full border rounded px-1 py-1 my-1 text-sm border-blue-500"
                    onChange={(e) => handleInputChange(heading, e.target.value)}
                  />
                </td>
              ))}
              <td className="border px-4 py-2 text-center">
                <button
                  className="text-red-600"
                  onClick={() => handleRemoveRowClick(rows.length)}
                >
                  &#10005; Remove Row
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        {isEditing ? (
          <>
            <button
              className="px-4 py-2 mr-2 bg-red-600 hover:bg-red-600 text-white"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-sm text-white"
              onClick={handleAddRowClick}
            >
              Add Row
            </button>
            <button
              className="px-6 py-2 ml-2 bg-blue-600 hover:bg-blue-500 text-white"
              onClick={handleSaveClick}
            >
              Save
            </button>
            <label className="px-4 py-2 ml-2 bg-green-700 hover:bg-green-600 text-white cursor-pointer">
              Import Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleImportExcel}
              />
            </label>
          </>
        ) : (
          <button
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
            onClick={handleUpdateClick}
          >
            Add More
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleApplications;
