import { createBrowserRouter } from "react-router-dom";
// import Main from "../Layout/Main";
import NonLifeInsuranceForm from "../Components/NonLifeInsuranceForm";
// import AllForms from "../Components/AllForms";
// import SingleForm from "../Components/SingleForm";
// // import DynamicForm from "../Components/DynamicForm";
// import Home from "../Components/Home";
// import AllApplications from "../Components/allApplications";
// import NonLifeInsuranceForm from "../Components/NonLifeInsuranceForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NonLifeInsuranceForm />,
    // element: <Main />,
    // children: [
    //   {
    //     path: "/",
    //     element: <Home />,
    //   },
    //   {
    //     path: "/home",
    //     element: <Home />,
    //   },
    //   {
    //     path: "allForms",
    //     element: <AllForms />,
    //   },
    //   {
    //     path: "forms/:formId",
    //     element: <SingleForm />,
    //     loader: ({ params }) =>
    //       fetch(
    //         `https://form-builder-server-ten.vercel.app/forms/${params.formId}`
    //       ),
    //   },
    //   {
    //     path: "allApplications",
    //     element: <AllApplications />,
    //   },
    //   {
    //     path: "form",
    //     element: <NonLifeInsuranceForm />,
    //   },
    // ],
  },
]);

export default router;
