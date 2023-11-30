import { Routes, Route } from "react-router";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import Addvehicle from "./Components/Addvehicle"
import Categories from "./Components/Categories";
import Editvehicle from "./Components/Editvehicle";
import Addcategory from "./Components/Addcategory";
import Editcategory from "./Components/Editcategory";


//all defined routes of the app - different screen based on the different routes
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addvehicle" element={<Addvehicle />} />
        <Route path="/addcategory" element={<Addcategory />} />
        <Route path="/editvehicle/:id" element={<Editvehicle />} />
        <Route path="/editcategory/:id" element={<Editcategory />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </>
  );
}

export default App;
