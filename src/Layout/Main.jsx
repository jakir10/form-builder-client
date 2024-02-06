import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";
// import Footer from "../Components/Footer";

const Main = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <NavBar />
      <Outlet></Outlet>
      {/* <Footer/> */}
    </div>
  );
};

export default Main;
