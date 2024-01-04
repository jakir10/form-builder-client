// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const AllForms = () => {
//   const [forms, setForms] = useState([]);

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const response = await axios.get(
//           // "https://form-builder-server-ten.vercel.app/forms"
//           "https://form-builder-server-ten.vercel.app/forms"
//         );
//         setForms(response.data);
//       } catch (error) {
//         console.error("Error fetching forms:", error.message);
//         if (error.response) {
//           console.error("Error response data:", error.response.data);
//         }
//       }
//     };

//     fetchForms();
//   }, []);

//   return (
//     <div className="flex flex-wrap -mx-4">
//       {forms.map((form) => (
//         <Link
//           key={form._id}
//           to={`/forms/${form._id}`}
//           className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-4 mb-4"
//         >
//           <div className="bg-white rounded-lg p-6 shadow-md">
//             <h3 className="text-lg font-semibold mb-2">{form.title}</h3>
//             <h3 className="text-lg font-semibold mb-2">
//               {form.insuranceName} Insurance
//             </h3>
//             <p className="text-gray-600">{form.description}</p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default AllForms;

// const handleFileUploadAndUpdateForm = (file) => {
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });

//         const sheetName = workbook.SheetNames[0];
//         const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         const excelHeadings = Object.keys(sheetData[0]);

//         setFormData((prevData) => ({
//           ...prevData,
//           headings: excelHeadings,
//           rows: sheetData,
//         }));

//         const initialInputValues = {};
//         sheetData.forEach((row, rowIndex) => {
//           excelHeadings.forEach((heading) => {
//             initialInputValues[`${heading}-${rowIndex}`] = row[heading] || "";
//           });
//         });
//         setInputValues(initialInputValues);

//         setFileUploadError(null);
//       } catch (error) {
//         console.error("Error processing Excel file:", error.message);
//         setFileUploadError("Error processing Excel file. Please try again.");
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];

//     if (!file) {
//       return;
//     }

//     handleFileUploadAndUpdateForm(file);
//   };

//   if (loading) {
//     return <p>Loading form...</p>;
//   }

//   if (error) {
//     return <p>Error loading form: {error}</p>;
//   }

//   const { headings, rows } = formData;
