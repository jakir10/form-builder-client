// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// const UpdateApplication = () => {
//   const { applicationId } = useParams();
//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormData = async () => {
//       try {
//         const response = await axios.get(
//           `https://form-builder-server-ten.vercel.app/applications/${applicationId}`
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
//   }, [applicationId]);

//   const handleInputChange = (
//     rowIndex,
//     elementIndex,
//     colIndex,
//     value,
//     isElement
//   ) => {
//     setFormData((prevData) => {
//       const updatedTableData = [...prevData.formData.tableData];
//       if (isElement) {
//         updatedTableData[rowIndex].elements[elementIndex].unauditedColumns[
//           colIndex
//         ] = value;
//       } else {
//         updatedTableData[rowIndex].unauditedColumns[colIndex] = value;
//       }
//       return {
//         ...prevData,
//         formData: { ...prevData.formData, tableData: updatedTableData },
//       };
//     });
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       console.log("Submitting form data:", formData.formData); // Log the data being sent to the backend

//       const response = await axios.put(
//         `https://form-builder-server-ten.vercel.app/application/${applicationId}`,
//         {
//           formData: formData.formData,
//         }
//       );

//       // Check if the submission was successful
//       if (response.status === 200) {
//         console.log("Form data successfully submitted to the backend.");
//         // You might want to perform additional actions here upon successful submission

//         // Redirect or perform other actions after successful submission
//         navigate(`/applications/${applicationId}`);
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
//     return <p>No form data found for application with ID {applicationId}</p>;
//   }

//   // navigate(
//   //   `http://localhost:5173/updateApplications/applications/${applicationId}`
//   // );

//   return (
//     <div className="container mx-auto mt-8">
//       <h1 className="text-xl text-center uppercase">
//         Update {formData.formData.insuranceName} Insurance
//       </h1>

//       <form onSubmit={handleFormSubmit}>
//         <table className="min-w-full bg-white border border-gray-300 mt-4">
//           <thead>
//             <tr>
//               <th className="py-2">Sl No</th>
//               {formData.formData.headings &&
//                 formData.formData.headings.map((heading, index) => (
//                   <th key={index} className="py-2">
//                     {heading}
//                   </th>
//                 ))}
//             </tr>
//           </thead>
//           <tbody>
//             {formData.formData.tableData.map((row, rowIndex) => (
//               <React.Fragment key={rowIndex}>
//                 <tr>
//                   <td className="py-2 text-center">{row.slNo}</td>
//                   {row.unauditedColumns.map((value, colIndex) => (
//                     <td key={colIndex} className="py-2 text-center">
//                       <input
//                         type="text"
//                         className="border rounded px-1 py-1 text-sm border-blue-500"
//                         defaultValue={value}
//                         onChange={(e) =>
//                           handleInputChange(
//                             rowIndex,
//                             0, // assuming rowIndex for elements is always 0
//                             colIndex,
//                             e.target.value,
//                             false
//                           )
//                         }
//                       />
//                     </td>
//                   ))}
//                 </tr>
//                 {row.elements.map((element, elementIndex) => (
//                   <tr key={`element-${rowIndex}-${elementIndex}`}>
//                     <td className="py-2 text-center">{element.romanNumeral}</td>
//                     {element.unauditedColumns.map((value, colIndex) => (
//                       <td
//                         key={`element-${rowIndex}-${elementIndex}-${colIndex}`}
//                         className="py-2 text-center"
//                       >
//                         <input
//                           type="text"
//                           className="border rounded px-1 py-1 text-sm border-blue-500"
//                           defaultValue={value}
//                           onChange={(e) =>
//                             handleInputChange(
//                               rowIndex,
//                               elementIndex,
//                               colIndex,
//                               e.target.value,
//                               true
//                             )
//                           }
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>

//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">
//           Save
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateApplication;
