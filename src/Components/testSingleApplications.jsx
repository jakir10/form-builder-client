// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// const SingleApplication = () => {
//   const { applicationId } = useParams();
//   const [applicationData, setApplicationData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchApplicationData = async () => {
//       try {
//         const response = await axios.get(
//           `https://form-builder-server-ten.vercel.app/applications/${applicationId}`
//         );
//         setApplicationData(response.data);
//       } catch (error) {
//         console.error("Error fetching application data:", error);
//         setError("Error fetching application data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplicationData();
//   }, [applicationId]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!applicationData) {
//     return <p>No data found for application with ID {applicationId}</p>;
//   }

//   const handleEdit = () => {
//     // Redirect to the form page with the dynamic application ID
//     navigate(`/updateApplications/${applicationId}`);
//   };

//   return (
//     <div className="container mx-auto mt-8">
//       <h1 className="text-xl text-center uppercase">
//         Format for {applicationData.formData.insuranceName} Insurance
//       </h1>
//       <button
//         onClick={handleEdit}
//         className="bg-blue-500 text-white px-4 py-2 mt-4"
//       >
//         Edit
//       </button>

//       <table className="min-w-full bg-white border border-gray-300 mt-4">
//         <thead>
//           <tr>
//             <th className="py-2">Sl No</th>
//             {applicationData.formData.headings.map((heading, index) => (
//               <th key={index} className="py-2">
//                 {heading}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {applicationData.formData.tableData.map((row, rowIndex) => (
//             <React.Fragment key={rowIndex}>
//               <tr>
//                 <td className="py-2 text-center">{row.slNo}</td>
//                 {row.unauditedColumns.map((value, colIndex) => (
//                   <td key={colIndex} className="py-2 text-center">
//                     {value}
//                   </td>
//                 ))}
//               </tr>
//               {row.elements.map((element, elementIndex) => (
//                 <tr key={`element-${rowIndex}-${elementIndex}`}>
//                   <td className="py-2 text-center">{element.romanNumeral}</td>
//                   {element.unauditedColumns.map((value, colIndex) => (
//                     <td
//                       key={`element-${rowIndex}-${elementIndex}-${colIndex}`}
//                       className="py-2 text-center"
//                     >
//                       {value}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SingleApplication;
