import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logoImage from "../assets/logo.png"; // Import the logo image

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
  const [newHeading, setNewHeading] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dataTypeSelection, setDataTypeSelection] = useState({});
  const [invalidInputs, setInvalidInputs] = useState({});
  // const getUserInformation = () => {
  //   const userName = prompt("Enter your name:");
  //   const userDate = prompt("Enter the report date:");
  //   return { userName, userDate };
  // };
  // New state variables for modal
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    companyName: "",
    userName: "",
    userAddress: "",
    userDescription: "",
    userPhone: "",
    userEmail: "",
  });
  const [errors, setErrors] = useState({
    companyName: "",
    userName: "",
    userAddress: "",
    userDescription: "",
    userPhone: "",
    userEmail: "",
  });

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

  const handleDataTypeChange = (heading, dataType) => {
    setDataTypeSelection((prevSelection) => ({
      ...prevSelection,
      [heading]: dataType,
    }));
  };

  const handleAddRowClick = () => {
    // Validate each heading based on the data type
    const invalidInputsCopy = {};
    let isDataValid = true; // Initialize isDataValid as true

    Object.keys(newRow).forEach((heading) => {
      const dataType = dataTypeSelection[heading] || "text";
      const value = newRow[heading];

      if (dataType === "text" && !/^[A-Za-z]+$/.test(value)) {
        // Set invalid input for text data type (alphabet only)
        invalidInputsCopy[heading] =
          "Invalid input. Please enter alphabet characters only.";
        isDataValid = false;
      } else if (dataType === "number" && !/^\d+$/.test(value)) {
        // Set invalid input for number data type (numbers only)
        invalidInputsCopy[heading] =
          "Invalid input. Please enter numbers only.";
        isDataValid = false;
      } else {
        // If the input is valid, remove the invalid flag
        invalidInputsCopy[heading] = "";
      }
    });

    // Check if the data type matches the selection for each heading
    Object.keys(dataTypeSelection).forEach((heading) => {
      const dataType = dataTypeSelection[heading] || "text";
      const value = newRow[heading];

      if (dataType === "text" && !/^[A-Za-z]+$/.test(value)) {
        // Set invalid input for text data type (alphabet only)
        invalidInputsCopy[heading] =
          "Data type does not match selection. Please select 'Text' for alphabet characters.";
        isDataValid = false;
      } else if (dataType === "number" && !/^\d+$/.test(value)) {
        // Set invalid input for number data type (numbers only)
        invalidInputsCopy[heading] =
          "Data type does not match selection. Please select 'Number' for numeric values.";
        isDataValid = false;
      }
    });

    // Update state to highlight only invalid inputs
    setInvalidInputs(invalidInputsCopy);

    // Check valid data, & add the row
    if (isDataValid) {
      setApplicationData((prevData) => ({
        ...prevData,
        inputValues: {
          ...prevData.inputValues,
          rows: [...prevData.inputValues.rows, newRow],
        },
      }));

      setNewRow({});
      setDataTypeSelection({});
      setInvalidInputs({});
    }
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

  const handleImportExcel = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const excelHeadings = excelData[1];
        const templateHeadings = applicationData.inputValues.headings;

        if (
          excelHeadings.length !== templateHeadings.length ||
          !templateHeadings.every((heading) => excelHeadings.includes(heading))
        ) {
          alert(
            "Excel file heading names do not match the template. Please check and try again."
          );
          return;
        }

        const existingRows = applicationData.inputValues.rows;

        const matchedRows = excelData
          .slice(2)
          .map((row) => {
            const newRow = {};
            templateHeadings.forEach((heading, index) => {
              newRow[heading] = row[index];
            });
            return newRow;
          })
          .filter((newRow) => {
            return !existingRows.some((existingRow) => {
              return templateHeadings.every(
                (heading) => existingRow[heading] === newRow[heading]
              );
            });
          });

        if (matchedRows.length > 0) {
          setApplicationData((prevData) => ({
            ...prevData,
            inputValues: {
              ...prevData.inputValues,
              rows: [...prevData.inputValues.rows, ...matchedRows],
            },
          }));
          alert("Excel data imported successfully!");
        } else {
          alert("No new data found in the Excel file.");
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportExcel = () => {
    const templateName = applicationData.templateName;

    const exportHeadings = applicationData.inputValues.headings.filter(
      (heading) => heading !== "Sl No"
    );

    const exportRows = applicationData.inputValues.rows.map((row) => {
      const newRow = {};
      exportHeadings.forEach((heading) => {
        newRow[heading] = row[heading];
      });
      return newRow;
    });

    const firstRow = [`${templateName}\n Form`];

    const exportRowsWithTemplateName = exportRows.map((row) => {
      const newRow = [];
      exportHeadings.forEach((heading) => {
        newRow.push(row[heading]);
      });
      return newRow;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      firstRow,
      exportHeadings,
      ...exportRowsWithTemplateName,
    ]);

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: exportHeadings.length - 1 } },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `exported_data_${applicationId}.xlsx`);
  };

  const handleAddHeadingClick = () => {
    if (newHeading.trim() === "") {
      alert("Heading name cannot be empty");
      return;
    }

    setApplicationData((prevData) => {
      const updatedHeadings = [...prevData.inputValues.headings, newHeading];
      const updatedRows = prevData.inputValues.rows.map((row) => {
        return {
          ...row,
          [newHeading]: "",
        };
      });

      return {
        ...prevData,
        inputValues: {
          ...prevData.inputValues,
          headings: updatedHeadings,
          rows: updatedRows,
        },
      };
    });

    setNewHeading("");
  };

  const handleRemoveHeadingClick = (headingIndexToRemove) => {
    setApplicationData((prevData) => {
      const updatedHeadings = prevData.inputValues.headings.filter(
        (_, index) => index !== headingIndexToRemove
      );

      const updatedRows = prevData.inputValues.rows.map((row) => {
        const newRow = { ...row };
        delete newRow[prevData.inputValues.headings[headingIndexToRemove]];
        return newRow;
      });

      return {
        ...prevData,
        inputValues: {
          ...prevData.inputValues,
          headings: updatedHeadings,
          rows: updatedRows,
        },
      };
    });
  };

  const handleSaveClick = async () => {
    try {
      await axios.patch(`http://localhost:5000/applications/${applicationId}`, {
        inputValues: applicationData.inputValues,
      });

      alert("Data saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error.message);
      alert("Error saving data. Please try again.");
    }
  };

  // import logoImage from "../assets/logo.png";

  const handleExportPdf = () => {
    // Open modal for user information input
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    // Validate input fields
    const newErrors = {};

    if (!userInfo.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
    }

    if (!userInfo.userName.trim()) {
      newErrors.userName = "User Name is required";
    }

    if (!userInfo.userAddress.trim()) {
      newErrors.userAddress = "User Address is required";
    }

    if (!userInfo.userDescription.trim()) {
      newErrors.userDescription = "User Description is required";
    }

    if (!/^\d{11}$/.test(userInfo.userPhone)) {
      newErrors.userPhone = "Invalid phone number";
    }

    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        userInfo.userEmail
      )
    ) {
      newErrors.userEmail = "Invalid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear input fields
    setUserInfo({
      companyName: "",
      userName: "",
      userAddress: "",
      userDescription: "",
      userPhone: "",
      userEmail: "",
    });
    // Close modal
    setShowModal(false);

    // Get user information from state
    const {
      companyName,
      userName,
      userAddress,
      userDescription,
      userPhone,
      userEmail,
    } = userInfo;

    try {
      // Get template name, headings, and rows
      const templateName = applicationData.templateName;
      const headings = applicationData.inputValues.headings;
      const rows = applicationData.inputValues.rows;

      const pdf = new jsPDF();

      // Set background color
      pdf.setFillColor(255, 255, 204);
      pdf.rect(
        0,
        0,
        pdf.internal.pageSize.width,
        pdf.internal.pageSize.height,
        "F"
      );

      // Place smaller logo in the top-left corner
      pdf.addImage(logoImage, "PNG", 10, 10, 20, 20);

      // User information box
      pdf.setDrawColor(0, 150, 255);
      pdf.setFillColor(200, 230, 255);
      pdf.roundedRect(30, 50, 150, 60, 3, 3, "FD"); // Draw rounded rectangle

      // Set font style to bold and smaller text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);

      // Display "User Information" heading at the center of the box, outside the top
      pdf.text("User Information", pdf.internal.pageSize.width / 2, 42, {
        align: "center",
      });

      // Display user information with adjusted indentation
      pdf.text(`Company       :     ${companyName}`, 40, 55, { maxWidth: 130 });
      pdf.text(`Name               :     ${userName}`, 40, 65, {
        maxWidth: 130,
      });
      pdf.text(`Address         :     ${userAddress}`, 40, 75, {
        maxWidth: 130,
      });
      pdf.text(`Description  :     ${userDescription}`, 40, 85, {
        maxWidth: 130,
      });
      pdf.text(`Phone            :     ${userPhone}`, 40, 95, {
        maxWidth: 130,
      });
      pdf.text(`Email             :     ${userEmail}`, 40, 105, {
        maxWidth: 130,
      });

      // template name
      pdf.setTextColor(0, 150, 255);
      pdf.setFontSize(12);
      pdf.text(
        `Report for ${templateName} Form`,
        pdf.internal.pageSize.width / 2,
        160,
        { align: "center" }
      );

      // Data table
      const tableStartY = 180; // Adjust the startY value based on user information box height
      const tableHeaders = ["Sl No", ...headings];
      const tableData = rows.map((row, index) => [
        index + 1,
        ...headings.map((heading) => row[heading]),
      ]);

      pdf.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: tableStartY,
      });

      // Add current date and time
      const currentDate = new Date().toLocaleString();
      pdf.setTextColor(255, 0, 0);
      pdf.setFontSize(8);
      pdf.text(
        `Download date: ${currentDate}`,
        pdf.internal.pageSize.width - 10,
        10,
        { align: "right" }
      );

      // Add a styled footer at the bottom of the PDF
      pdf.setFillColor(0, 150, 255);
      pdf.rect(
        0,
        pdf.internal.pageSize.height - 20,
        pdf.internal.pageSize.width,
        20,
        "F"
      ); // Draw rectangle covering the full width of the page
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "normal"); // Set font style back to normal
      pdf.setFontSize(10);
      pdf.text(
        "Thank you for using our Dynamic Form system. For inquiries, contact support@example.com.",
        pdf.internal.pageSize.width / 2,
        pdf.internal.pageSize.height - 10,
        { align: "center", baseline: "middle" }
      );

      pdf.save(`exported_data_${applicationId}_${currentDate}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error exporting PDF. Please check the console for details.");
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
                  className="border px-4 py-2 capitalize text-center"
                >
                  {heading}
                  {isEditing && (
                    <button
                      className="text-red-600 hover:text-red-500 ml-1 transform hover:scale-125"
                      onClick={() => handleRemoveHeadingClick(index)}
                    >
                      &#10005; Remove
                    </button>
                  )}
                </th>
              ))}
            {isEditing && (
              <th className="border px-4 py-2 text-center">
                <input
                  type="text"
                  value={newHeading}
                  placeholder="New Heading"
                  className="w-full border rounded px-1 py-1 my-1 text-sm border-blue-500 text-gray-700"
                  onChange={(e) => setNewHeading(e.target.value)}
                />
                <button
                  className="text-white hover:text-green-400 ml-1 transform hover:scale-105"
                  onClick={handleAddHeadingClick}
                >
                  + Add
                </button>
              </th>
            )}
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
                    className="text-red-600 transform hover:scale-105"
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
                  <div className="flex items-center">
                    <input
                      type={dataTypeSelection[heading] || "text"}
                      value={newRow[heading] || ""}
                      placeholder={heading}
                      className={`w-full border rounded px-1 py-1 my-1 text-sm border-blue-500 ${
                        invalidInputs[heading] ? "border-red-500" : ""
                      }`}
                      onChange={(e) =>
                        handleInputChange(heading, e.target.value)
                      }
                    />
                    {invalidInputs[heading] && (
                      <p className="text-red-500 text-xs mt-1 ml-2">
                        Invalid input. Please enter{" "}
                        {dataTypeSelection[heading] === "text"
                          ? "alphabet characters"
                          : dataTypeSelection[heading] === "number"
                          ? "numbers"
                          : "alphabet characters"}{" "}
                        only.
                      </p>
                    )}

                    <select
                      value={dataTypeSelection[heading] || "text"}
                      onChange={(e) =>
                        handleDataTypeChange(heading, e.target.value)
                      }
                      className="ml-2 p-1 border border-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      {/* Add more data types as needed */}
                    </select>
                  </div>
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
        {!isEditing && (
          <button
            className="px-4 py-2 mr-2 bg-red-700 hover:bg-red-600 text-white transition-transform transform hover:scale-105"
            onClick={handleExportPdf}
          >
            Export PDF
          </button>
        )}
        {!isEditing && (
          <button
            className="px-4 py-2 mr-2 bg-green-700 hover:bg-green-600 text-white transition-transform transform hover:scale-105"
            onClick={handleExportExcel}
          >
            Export Excel
          </button>
        )}
        {isEditing ? (
          <>
            <button
              className="px-4 py-2 mr-2 bg-red-700 hover:bg-red-500 text-white transition-transform transform hover:scale-105"
              onClick={() => {
                setIsEditing(false);
                window.location.reload();
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-sm text-white transition-transform transform hover:scale-105"
              onClick={handleAddRowClick}
            >
              Add Row
            </button>
            <button
              className="px-6 py-2 ml-2 bg-blue-600 hover:bg-blue-500 text-white transition-transform transform hover:scale-105"
              onClick={handleSaveClick}
            >
              Save
            </button>
            <label className="px-4 py-2 ml-2 bg-green-700 hover:bg-green-600 text-white cursor-pointer transition-transform transform hover:scale-105">
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
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white transition-transform transform hover:scale-105"
            onClick={handleUpdateClick}
          >
            Add More
          </button>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
          <div className="bg-white p-4 rounded shadow-md z-10 w-1/2 relative">
            <button
              className="absolute top-0 right-0 m-4 text-xl cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              &#10005; {/* Close icon */}
            </button>
            <h2 className="text-lg font-bold mb-4 text-indigo-600">
              Enter User Information
            </h2>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Company Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userInfo.companyName}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, companyName: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm">{errors.companyName}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                User Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userInfo.userName}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, userName: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              {errors.userName && (
                <p className="text-red-500 text-sm">{errors.userName}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                User Address<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userInfo.userAddress}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, userAddress: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              {errors.userAddress && (
                <p className="text-red-500 text-sm">{errors.userAddress}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                User Description<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userInfo.userDescription}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, userDescription: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              {errors.userDescription && (
                <p className="text-red-500 text-sm">{errors.userDescription}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                User Phone<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userInfo.userPhone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, userPhone: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              {errors.userPhone && (
                <p className="text-red-500 text-sm">{errors.userPhone}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                User Email<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userInfo.userEmail}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, userEmail: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              {errors.userEmail && (
                <p className="text-red-500 text-sm">{errors.userEmail}</p>
              )}
            </div>
            <button
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white transition-transform transform hover:scale-105"
              onClick={handleModalSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}      
    </div>
  );
};

export default SingleApplications;
