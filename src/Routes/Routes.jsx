import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import NonLifeInsuranceForm from "../Components/NonLifeInsuranceForm";
import AllForms from "../Components/AllForms";
import SingleForm from "../Components/SingleForm";
// import DynamicForm from "../Components/DynamicForm";
import Home from "../Components/Home";
import AllApplications from "../Components/allApplications";
import SingleApplication from "../Components/SingleApplications";
import About from "../Components/About";
// import UpdateApplication from "../Components/UpdateApplication";
// import NonLifeInsuranceForm from "../Components/NonLifeInsuranceForm";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <NonLifeInsuranceForm />,
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "allForms",
        element: <AllForms />,
      },
      {
        // path: "forms/:formId",
        path: "submits/:formId",
        element: <SingleForm />,
        loader: ({ params }) =>
          fetch(
            // `http://localhost:5000/forms/${params.formId}`
            // `http://localhost:5000/forms/${params.formId}`
            `http://localhost:5000/submits/${params.formId}`
          ),
      },
      {
        path: "allApplications",
        element: <AllApplications />,
      },
      {
        path: "applications/:applicationId",
        element: <SingleApplication />,
        loader: ({ params }) =>
          fetch(
            // `http://localhost:5000/forms/${params.formId}`
            `http://localhost:5000/applications/${params.applicationId}`
          ),
      },
      // {
      //   path: "updateApplications/:applicationId",
      //   element: <UpdateApplication />,
      //   loader: ({ params }) =>
      //     fetch(
      //       // `http://localhost:5000/forms/${params.formId}`
      //       `http://localhost:5000/applications/${params.applicationId}`
      //     ),
      // },
      {
        path: "form",
        element: <NonLifeInsuranceForm />,
      },
    ],
  },
]);

export default router;
