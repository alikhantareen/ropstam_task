import React, { useState } from "react";
import Navbar from "./Navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

const Editcategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [cat, setCat] = useState({});

  const { isPending, isError, data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getSpecificCat(id),
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });

  async function getSpecificCat(id) {
    const apiRes = await fetch(`http://localhost:5050/getsinglecategory/${id}`);
    const res = await apiRes.json();
    if (res.response) {
        console.log(res);
      setCat({ ...res.data });
    } else {
      console.warn(res);
    }
  }

  async function updateCategory(val) {
    const { category } = val;
    const apiCall = await fetch(`http://localhost:5050/editcategory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: category,
        user: localStorage.getItem("user_id"),
        token: localStorage.getItem("token"),
      }),
    });
    const apiRes = await apiCall.json();
    if (apiRes.response) {
      navigate("/?page=1");
    } else {
      setError(apiRes.message);
    }
  }

  const edit_form = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: cat.name,
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Category name required"),
    }),
    onSubmit: (values) => {
      updateCategory(values);
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
                <a>Edit category</a>
              </li>
            </ul>
          </nav>
        </section>
        <section className="p-4">
          <div className="flex flex-col justify-center items-center gap-10 w-full p-4 overflow-x-auto">
            <p className="text-2xl underline text-slate-600">
              Edit Category Form
            </p>
            <form
              onSubmit={edit_form.handleSubmit}
              className="w-[20rem] flex flex-col gap-4"
            >
              {edit_form.touched.category && edit_form.errors.category ? (
                <div className="text-red-500">{edit_form.errors.category}</div>
              ) : null}
              <input
                id="category"
                name="category"
                onChange={edit_form.handleChange}
                onBlur={edit_form.handleBlur}
                value={edit_form.values.category}
                className="input"
                placeholder="Category name"
              />
              <button type="submit" className="btn btn-solid-primary btn-block">
                Update
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Editcategory;
