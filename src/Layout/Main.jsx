import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";

const Main = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <NavBar />
      <Outlet></Outlet>
    </div>
  );
};

export default Main;
