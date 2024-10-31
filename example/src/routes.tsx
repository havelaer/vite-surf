import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";

export default (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route
      path="/about"
      element={
        <div>
          About <Link to="/">home</Link>
        </div>
      }
    />
  </Routes>
);
