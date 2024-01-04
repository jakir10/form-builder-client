// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// const SingleForm = () => {
//   const { formId } = useParams();
//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFormData = async () => {
//       try {
//         const response = await axios.get(
//           `https://form-builder-server-ten.vercel.app/forms/${formId}`
//         );
//         setFormData(response.data);
//       } catch (error) {
//         console.error("Error fetching form data:", error);
//         setError("Error fetching form data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFormData();
//   }, [formId]);

//   const handleInputChange = (
//     rowIndex,
//     elementIndex,
//     colIndex,
//     value,
//     isElement
//   ) => {
//     setFormData((prevData) => {
//       const updatedTableData = [...prevData.tableData];
//       if (isElement) {
//         updatedTableData[rowIndex].elements[elementIndex].unauditedColumns[
//           colIndex
//         ] = value;
//       } else {
//         updatedTableData[rowIndex].unauditedColumns[colIndex] = value;
//       }
//       return { ...prevData, tableData: updatedTableData };
//     });
//   };

//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post("https://form-builder-server-ten.vercel.app/application", {
//         formData: formData,
//       });

//       // Check if the submission was successful
//       if (response.status === 200) {
//         console.log("Form data successfully submitted to the backend.");
//         // You might want to perform additional actions here upon successful submission

//         navigate("/allForms");
//       } else {
//         console.error("Failed to submit form data to the backend.");
//       }
//     } catch (error) {
//       console.error("An error occurred while submitting:", error);
//       // Handle error cases, such as displaying an error message to the user
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!formData) {
//     return <p>No data found for form with ID {formId}</p>;
//   }

//   return (
//     <div className="container mx-auto mt-8">
//       <h1 className="text-xl text-center uppercase">
//         Format for {formData.insuranceName} Insurance
//       </h1>

//       <table className="min-w-full bg-white border border-gray-300 mt-4">
//         <thead>
//           <tr>
//             <th className="py-2">Sl No</th>
//             {formData.headings.map((heading, index) => (
//               <th key={index} className="py-2">
//                 {heading}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {formData.tableData.map((row, rowIndex) => (
//             <React.Fragment key={rowIndex}>
//               <tr>
//                 <td className="py-2">{row.slNo}</td>
//                 {row.unauditedColumns.map((value, colIndex) => (
//                   <td key={colIndex} className="py-2">
//                     <input
//                       type="text"
//                       value={value}
//                       placeholder={formData.headings[colIndex]}
//                       onChange={(e) =>
//                         handleInputChange(
//                           rowIndex,
//                           0, // assuming rowIndex for elements is always 0
//                           colIndex,
//                           e.target.value,
//                           false
//                         )
//                       }
//                       className="border rounded px-1 py-1 text-sm border-blue-500"
//                     />
//                   </td>
//                 ))}
//               </tr>
//               {row.elements.map((element, elementIndex) => (
//                 <tr key={`element-${rowIndex}-${elementIndex}`}>
//                   <td className="py-2">{element.romanNumeral}</td>
//                   {element.unauditedColumns.map((value, colIndex) => (
//                     <td
//                       key={`element-${rowIndex}-${elementIndex}-${colIndex}`}
//                       className="py-2"
//                     >
//                       <input
//                         type="text"
//                         value={value}
//                         placeholder={formData.headings[colIndex]}
//                         onChange={(e) =>
//                           handleInputChange(
//                             rowIndex,
//                             elementIndex,
//                             colIndex,
//                             e.target.value,
//                             true
//                           )
//                         }
//                         className="border rounded px-1 py-1 text-sm border-blue-500"
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>

//       <button
//         onClick={handleSubmit}
//         className="mt-2 bg-green-500 text-white px-2 py-1 rounded text-xs"
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default SingleForm;
