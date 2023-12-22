import React, { useState, useEffect } from "react";
import axios from "axios";
const RomanNumerals = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

const Quarters = [
  "Previous Year 2022",
  "(Jan-Mar 2023 1st Q)",
  "(April-June 2023 2nd Q)",
  "(July-Sept 2023 3rd Q)",
  "(Oct-Dec 2023 4th Q)",
];

const NonLifeInsuranceForm = () => {
  const [insuranceName, setInsuranceName] = useState("");
  const [tableData, setTableData] = useState(() => {
    const storedData = localStorage.getItem("nonLifeInsuranceForm");
    return storedData
      ? JSON.parse(storedData)
      : [
          {
            slNo: 1,
            particulars: "",
            elements: [],
            unauditedColumns: Array(5).fill(""),
          },
        ];
  });

  const [editMode, setEditMode] = useState(() => {
    const storedEditMode = localStorage.getItem("nonLifeInsuranceEditMode");
    return storedEditMode ? JSON.parse(storedEditMode) : true;
  });

  useEffect(() => {
    localStorage.setItem("nonLifeInsuranceForm", JSON.stringify(tableData));
    localStorage.setItem("nonLifeInsuranceEditMode", JSON.stringify(editMode));
  }, [tableData, editMode]);

  const addSLRow = () => {
    setTableData((prevData) => [
      ...prevData,
      {
        slNo: prevData.length + 1,
        particulars: "",
        elements: [],
        unauditedColumns: Array(5).fill(""),
      },
    ]);
  };

  const removeSLRow = (index) => {
    setTableData((prevData) =>
      prevData
        .filter((_, i) => i !== index)
        .map((row, i) => ({ ...row, slNo: i + 1 }))
    );
  };

  const addRomanElement = (index) => {
    setTableData((prevData) => {
      const newData = [...prevData];

      if (newData[index].elements.length < RomanNumerals.length) {
        newData[index].elements.push({
          romanNumeral: RomanNumerals[newData[index].elements.length],
          dataName: "",
          unauditedColumns: Array(5).fill(""),
        });
      }

      return newData;
    });
  };

  const removeElement = (rowIndex, elementIndex) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex].elements = newData[rowIndex].elements.filter(
        (_, i) => i !== elementIndex
      );
      return newData;
    });
  };

  const handleNameChange = (index, newName) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[index].particulars = newName;
      return newData;
    });
  };

  const handleElementChange = (index, elementIndex, newDataName) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[index].elements[elementIndex].dataName = newDataName;
      return newData;
    });
  };

  const handleUnauditedColumnChange = (
    rowIndex,
    elementIndex,
    columnIndex,
    newValue
  ) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      if (elementIndex !== undefined) {
        newData[rowIndex].elements[elementIndex].unauditedColumns[columnIndex] =
          newValue;
      } else {
        newData[rowIndex].unauditedColumns[columnIndex] = newValue;
      }
      return newData;
    });
  };

  const handleInsuranceNameChange = (e) => {
    setInsuranceName(e.target.value);
  };

  const handleSaveForm = () => {
    setEditMode(false);
  };

  const handleEditForm = () => {
    setEditMode(true);
  };

  const handleSubmitForm = async () => {
    try {
      // Handle form submission logic here
      console.log("Form Submitted:", { insuranceName, tableData });

      // Your backend endpoint
      // const endpoint = "http://localhost:5000/form-submit";

      // Prepare the data to be sent
      const formData = {
        insuranceName,
        tableData,
      };

      // Make the HTTP POST request
      const response = await axios.post(
        // "http://localhost:5000/submits",
        "https://form-builder-server-ten.vercel.app/submits",
        formData
      );

      // Reset the state variables if the request was successful
      if (response.status === 200) {
        setInsuranceName("");

        setTableData((prevData) =>
          prevData.map((row) => ({
            ...row,
            particulars: "",
            elements: row.elements.map((element) => ({
              ...element,
              dataName: "",
              unauditedColumns: Array(5).fill(""),
            })),
            unauditedColumns: Array(5).fill(""),
          }))
        );

        // Set edit mode to true after submitting
        setEditMode(true);

        console.log("Form data successfully submitted to the backend.");
      } else {
        // Handle error scenario
        console.error("Failed to submit form data to the backend.");
      }
    } catch (error) {
      // Handle exception
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-xl text-center uppercase">
        Format for non-life insurance
      </h1>
      <div className="text-center">
        {editMode ? (
          <>
            Name of Insurance :{" "}
            <input
              value={insuranceName}
              onChange={handleInsuranceNameChange}
              className="border rounded px-1 py-1 text-sm border-blue-500"
              type="text"
              placeholder="Insurance Name"
              readOnly={!editMode}
            />
          </>
        ) : (
          <p>
            Insurance Name: <strong>{insuranceName}</strong>
          </p>
        )}
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2">Sl No</th>
            <th className="py-2">Particulars</th>
            {Quarters.map((quarter, index) => (
              <th key={index} className="py-2">
                {quarter}
              </th>
            ))}
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className="py-2">{row.slNo}</td>
                <td className="py-2">
                  <div>
                    <input
                      type="text"
                      value={row.particulars}
                      placeholder="add particulars"
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="border rounded px-1 py-1 text-sm border-blue-500"
                      readOnly={editMode}
                    />
                  </div>
                </td>
                {row.unauditedColumns.map((value, columnIndex) => (
                  <td key={columnIndex} className="py-2 mt-0">
                    <input
                      type="text"
                      value={value}
                      placeholder={Quarters[columnIndex]}
                      onChange={(e) =>
                        handleUnauditedColumnChange(
                          index,
                          undefined,
                          columnIndex,
                          e.target.value
                        )
                      }
                      className="border rounded px-1 py-1 text-sm border-blue-500"
                      readOnly={editMode}
                    />
                  </td>
                ))}
                <td className="py-2">
                  <button
                    onClick={() => addRomanElement(index)}
                    className={`mt-1 bg-blue-500 text-white px-2 py-1 rounded text-xs ${
                      editMode ? "" : "hidden"
                    }`}
                  >
                    Add Element
                  </button>
                  <button
                    onClick={() => removeSLRow(index)}
                    className={`mt-1 bg-red-500 text-white px-2 py-1 rounded text-xs ${
                      editMode ? "" : "hidden"
                    }`}
                  >
                    Remove Row
                  </button>
                </td>
              </tr>
              {row.elements.map((element, elemIndex) => (
                <tr key={`${index}-${elemIndex}`}>
                  <td className="py-2"></td>
                  <td className="py-2">
                    <div className="mb-2 mt-8" style={{ marginLeft: "10px" }}>
                      {element.romanNumeral}:&nbsp;
                      <input
                        type="text"
                        value={element.dataName}
                        placeholder="add sub particulars"
                        onChange={(e) =>
                          handleElementChange(index, elemIndex, e.target.value)
                        }
                        className="border rounded px-1 py-1 text-sm border-blue-500"
                        readOnly={editMode}
                      />
                      <button
                        onClick={() => removeElement(index, elemIndex)}
                        className={`ml-1 bg-red-500 text-white px-1 py-1 rounded text-xs ${
                          editMode ? "" : "hidden"
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                  {element.unauditedColumns.map((value, columnIndex) => (
                    <td key={columnIndex} className="py-2">
                      <input
                        type="text"
                        value={value}
                        placeholder={Quarters[columnIndex]}
                        onChange={(e) =>
                          handleUnauditedColumnChange(
                            index,
                            elemIndex,
                            columnIndex,
                            e.target.value
                          )
                        }
                        className="border rounded px-1 py-1 text-sm border-blue-500"
                        readOnly={editMode}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button
        onClick={addSLRow}
        className={`mt-2 bg-green-500 text-white px-2 py-1 rounded text-xs ${
          editMode ? "" : "hidden"
        }`}
      >
        Add Row
      </button>
      <button
        onClick={handleSaveForm}
        className={`mt-2 ml-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs ${
          editMode ? "" : "hidden"
        }`}
      >
        Save Form
      </button>
      <button
        onClick={handleEditForm}
        className={`mt-2 ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs ${
          !editMode ? "" : "hidden"
        }`}
      >
        Edit Form
      </button>
      <button
        onClick={handleSubmitForm}
        className={`mt-2 ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs ${
          !editMode ? "" : "hidden"
        }`}
      >
        Submit Form
      </button>
    </div>
  );
};

export default NonLifeInsuranceForm;
