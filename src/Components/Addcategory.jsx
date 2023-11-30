import React, { useState } from "react";
import Navbar from "./Navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";

const Addcategory = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  //functoin to add category
  async function addCategory(cat) {
    const apiCall = await fetch(`http://localhost:5050/addcategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: cat,
        token: localStorage.getItem("token"),
        user: localStorage.getItem("user_id"),
      }),
    });
    const apiRes = await apiCall.json();
    if (apiRes.response) {
      navigate("/categories");
    } else {
      setError(apiRes.message);
    }
  }

  //defining form instance
  const formik = useFormik({
    initialValues: {
      category: "",
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Category name required"),
    }),
    onSubmit: (values) => {
      addCategory(values.category);
    },
  });

  return (
    <div className="h-screen flex">
      <Navbar />
      <main className="w-full p-2 md:p-8">
        <section className="flex justify-between items-center p-4">
          <nav className="breadcrumbs text-lg">
            <ul>
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a>Categories</a>
              </li>
              <li>
                <a>Add category</a>
              </li>
            </ul>
          </nav>
        </section>
        <section className="p-4">
          <div className="flex flex-col justify-center items-center gap-10 w-full p-4 overflow-x-auto">
            <p className="text-2xl underline text-slate-600">
              Add Category Form
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="w-[20rem] flex flex-col gap-4"
            >
              {formik.touched.category && formik.errors.category ? (
                <div className="text-red-500">{formik.errors.category}</div>
              ) : null}
              <input
                id="category"
                name="category"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
                className="input"
                placeholder="Category name"
              />
              <button type="submit" className="btn btn-solid-primary btn-block">
                Add
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Addcategory;
