// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const RomanNumerals = [
//   "i",
//   "ii",
//   "iii",
//   "iV",
//   "V",
//   "Vi",
//   "Vii",
//   "Viii",
//   "iX",
//   "X",
// ];

// const NonLifeInsuranceForm = () => {
//   const [insuranceName, setInsuranceName] = useState("");
//   const [tableData, setTableData] = useState(() => {
//     const storedData = localStorage.getItem("nonLifeInsuranceForm");
//     return storedData
//       ? JSON.parse(storedData)
//       : [
//           {
//             slNo: 1,
//             // particulars: "",
//             elements: [],
//             unauditedColumns: [],
//           },
//         ];
//   });

//   const [editMode, setEditMode] = useState(() => {
//     const storedEditMode = localStorage.getItem("nonLifeInsuranceEditMode");
//     return storedEditMode ? JSON.parse(storedEditMode) : true;
//   });

//   const [headings, setHeadings] = useState([]);

//   const addHeading = () => {
//     const newHeading = prompt("Enter a new heading:");
//     if (newHeading) {
//       setHeadings((prevHeadings) => [...prevHeadings, newHeading]);

//       // Update the table data to include an empty array for the new quarter
//       setTableData((prevData) =>
//         prevData.map((row) => ({
//           ...row,
//           unauditedColumns: [...row.unauditedColumns, ""],
//           elements: row.elements.map((element) => ({
//             ...element,
//             unauditedColumns: [...element.unauditedColumns, ""],
//           })),
//         }))
//       );
//     }
//   };

//   const addElement = (rowIndex) => {
//     setTableData((prevData) => {
//       const newData = [...prevData];
//       const nextRomanNumeral = getNextRomanNumeral(newData[rowIndex].elements);
//       newData[rowIndex].elements.push({
//         romanNumeral: nextRomanNumeral,
//         dataName: "",
//         unauditedColumns: Array(headings.length).fill(""),
//       });

//       return newData;
//     });
//   };

//   const getNextRomanNumeral = (elements) => {
//     const currentNumeralCount = elements.length;
//     return RomanNumerals[currentNumeralCount % RomanNumerals.length];
//   };

//   useEffect(() => {
//     localStorage.setItem("nonLifeInsuranceForm", JSON.stringify(tableData));
//     localStorage.setItem("nonLifeInsuranceEditMode", JSON.stringify(editMode));
//   }, [tableData, editMode]);

//   const addSLRow = () => {
//     setTableData((prevData) => [
//       ...prevData,
//       {
//         slNo: prevData.length + 1,
//         // particulars: "",
//         elements: [],
//         unauditedColumns: Array(headings.length).fill(""),
//       },
//     ]);
//   };

//   const removeSLRow = (index) => {
//     setTableData((prevData) =>
//       prevData
//         .filter((_, i) => i !== index)
//         .map((row, i) => ({ ...row, slNo: i + 1 }))
//     );
//   };

//   const handleUnauditedColumnChange = (
//     rowIndex,
//     elementIndex,
//     columnIndex,
//     newValue
//   ) => {
//     setTableData((prevData) => {
//       const newData = [...prevData];
//       if (elementIndex !== undefined) {
//         newData[rowIndex].elements[elementIndex].unauditedColumns[columnIndex] =
//           newValue;
//       } else {
//         newData[rowIndex].unauditedColumns[columnIndex] = newValue;
//       }
//       return newData;
//     });
//   };

//   const handleElementChange = (index, elementIndex, newDataName) => {
//     setTableData((prevData) => {
//       const newData = [...prevData];
//       if (newDataName === "") {
//         // If newDataName is an empty string, remove the element
//         newData[index].elements.splice(elementIndex, 1);
//       } else {
//         // Otherwise, update the dataName
//         newData[index].elements[elementIndex].dataName = newDataName;
//       }
//       return newData;
//     });
//   };
//   const navigate = useNavigate();

//   const handleSaveForm = async () => {
//     try {
//       // Include the insurance name and other form data
//       const formData = {
//         insuranceName,
//         // labels: tableData.map((row) => row.particulars),
//         inputFields: tableData.reduce((acc, row) => {
//           row.elements.forEach((element) => {
//             acc.push({
//               romanNumeral: element.romanNumeral,
//               dataName: element.dataName,
//             });
//           });
//           return acc;
//         }, []),
//         headings,
//         placeholders: headings,
//         tableData,
//       };

//       // const navigate = useNavigate();
//       // Make the HTTP POST request
//       const response = await axios.post(
//         "https://form-builder-server-ten.vercel.app/forms",
//         formData
//       );

//       // Reset the state variables if the request was successful
//       if (response.status === 200) {
//         setInsuranceName("");
//         // ... (reset other state variables as needed)

//         // Set edit mode to true after saving
//         setEditMode(true);

//         navigate("/allForms");

//         console.log("Form data successfully saved to the backend.");
//       } else {
//         // Handle error scenario
//         console.error("Failed to save form data to the backend.");
//       }
//     } catch (error) {
//       // Handle exception
//       console.error("An error occurred:", error);
//     }
//   };

//   const handleEditForm = () => {
//     setEditMode(true);
//   };

//   const handleSubmitForm = async () => {
//     try {
//       // Handle form submission logic here
//       console.log("Form Submitted:", { insuranceName, tableData });

//       // Your backend endpoint
//       // const endpoint = "https://form-builder-server-ten.vercel.app/form-submit";

//       // Prepare the data to be sent
//       const formData = {
//         insuranceName,
//         tableData,
//       };

//       // Make the HTTP POST request
//       const response = await axios.post(
//         "https://form-builder-server-ten.vercel.app/submits",
//         // "https://form-builder-server-ten.vercel.app/submits",
//         formData
//       );

//       // Reset the state variables if the request was successful
//       if (response.status === 200) {
//         setInsuranceName("");

//         setTableData((prevData) =>
//           prevData.map((row) => ({
//             ...row,
//             // particulars: "",
//             elements: row.elements.map((element) => ({
//               ...element,
//               dataName: "",
//               unauditedColumns: Array(5).fill(""),
//             })),
//             unauditedColumns: Array(5).fill(""),
//           }))
//         );

//         // Set edit mode to true after submitting
//         setEditMode(true);

//         console.log("Form data successfully submitted to the backend.");
//       } else {
//         // Handle error scenario
//         console.error("Failed to submit form data to the backend.");
//       }
//     } catch (error) {
//       // Handle exception
//       console.error("An error occurred:", error);
//     }
//   };

//   const removeColumn = (columnIndex) => {
//     setHeadings((prevHeadings) =>
//       prevHeadings.filter((_, index) => index !== columnIndex)
//     );
//     setTableData((prevData) =>
//       prevData.map((row) => ({
//         ...row,
//         unauditedColumns: row.unauditedColumns.filter(
//           (_, index) => index !== columnIndex
//         ),
//         elements: row.elements.map((element) => ({
//           ...element,
//           unauditedColumns: element.unauditedColumns.filter(
//             (_, index) => index !== columnIndex
//           ),
//         })),
//       }))
//     );
//   };

//   return (
//     <div className="container mx-auto mt-8">
//       <h1 className="text-xl text-center uppercase">
//         Format for non-life insurance
//       </h1>
//       <div className="text-center">
//         {editMode ? (
//           <>
//             Name of Insurance :{" "}
//             <input
//               value={insuranceName}
//               onChange={(e) => setInsuranceName(e.target.value)}
//               className="border rounded px-1 py-1 my-1 text-sm border-blue-500"
//               type="text"
//               placeholder="Insurance Name"
//               readOnly={!editMode}
//             />
//           </>
//         ) : (
//           <p>
//             Insurance Name: <strong>{insuranceName}</strong>
//           </p>
//         )}
//         {editMode && (
//           <button
//             onClick={addHeading}
//             className="bg-blue-500 text-white px-2 ml-2 py-1 rounded text-xs"
//           >
//             Add Heading
//           </button>
//         )}
//       </div>

//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr>
//             <th className="py-2">Sl No</th>
//             {headings.map((heading, index) => (
//               <th key={index} className="py-2">
//                 {heading}
//                 {editMode && (
//                   <button
//                     onClick={() => removeColumn(index)}
//                     className="ml-1 text-red-500"
//                   >
//                     &#x2715;
//                   </button>
//                 )}
//               </th>
//             ))}
//             <th className="py-2"></th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((row, index) => (
//             <React.Fragment key={index}>
//               <tr>
//                 <td className="py-2">{row.slNo}</td>
//                 {row.unauditedColumns.map((value, columnIndex) => (
//                   <td key={columnIndex} className="py-2 mt-0">
//                     <input
//                       type="text"
//                       value={value}
//                       placeholder={headings[columnIndex]}
//                       onChange={(e) =>
//                         handleUnauditedColumnChange(
//                           index,

//                           columnIndex,
//                           e.target.value
//                         )
//                       }
//                       className="border rounded px-1 py-1 text-sm border-blue-500"
//                       readOnly={editMode}
//                     />
//                   </td>
//                 ))}
//                 <td className="py-2">
//                   <button
//                     onClick={() => addElement(index)}
//                     className={`mt-1 bg-blue-500 text-white px-2 py-1 rounded text-xs ${
//                       editMode ? "" : "hidden"
//                     }`}
//                   >
//                     Add Element
//                   </button>
//                   <button
//                     onClick={() => removeSLRow(index)}
//                     className={`mt-1 ml-1 bg-red-500 text-white px-2 py-1 rounded text-xs ${
//                       editMode ? "" : "hidden"
//                     }`}
//                   >
//                     Remove Row
//                   </button>
//                 </td>
//               </tr>
//               {/* Roman numeral rows */}
//               {row.elements.map((element, elemIndex) => (
//                 <tr key={`${index}-${elemIndex}`}>
//                   <td className="py-2">{element.romanNumeral}</td>
//                   {element.unauditedColumns.map((value, columnIndex) => (
//                     <td key={columnIndex} className="py-2">
//                       <input
//                         type="text"
//                         value={value}
//                         placeholder={headings[columnIndex]}
//                         onChange={(e) =>
//                           handleUnauditedColumnChange(
//                             index,
//                             elemIndex,
//                             columnIndex,
//                             e.target.value
//                           )
//                         }
//                         className="border rounded px-1 py-1 text-sm border-blue-500"
//                         readOnly={editMode}
//                       />
//                     </td>
//                   ))}
//                   <td className="py-2">
//                     <button
//                       onClick={() => handleElementChange(index, elemIndex, "")}
//                       className={`mt-1 bg-red-500 text-white px-5 py-1 rounded text-xs ${
//                         editMode ? "" : "hidden"
//                       }`}
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//       <button
//         onClick={addSLRow}
//         className={`mt-2 bg-green-500 text-white px-3 py-1 rounded text-xs ${
//           editMode ? "" : "hidden"
//         }`}
//       >
//         Add Row
//       </button>
//       <button
//         onClick={handleSaveForm}
//         className={`mt-2 ml-1 bg-yellow-500 text-white px-2 py-1 rounded text-xs ${
//           editMode ? "" : "hidden"
//         }`}
//       >
//         Save Form
//       </button>
//       <button
//         onClick={handleEditForm}
//         className={`mt-2 ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs ${
//           !editMode ? "" : "hidden"
//         }`}
//       >
//         Edit Form
//       </button>
//       <button
//         onClick={handleSubmitForm}
//         className={`mt-2 ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs ${
//           !editMode ? "" : "hidden"
//         }`}
//       >
//         Submit Form
//       </button>
//     </div>
//   );
// };
