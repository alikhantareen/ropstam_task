import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";

const Editvehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [vehicle, setVehicle] = useState({});

  const { isPending, isError, data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });

  async function getCategories() {
    const apiRes = await fetch(
      `http://localhost:5050/categories/${localStorage.getItem("user_id")}`
    );
    const res = await apiRes.json();
    return res.data;
  }

  async function getSpecificVehicle(id) {
    const apiRes = await fetch(`http://localhost:5050/editvehicle/${id}`);
    const res = await apiRes.json();
    if (res.response) {
      setVehicle({...res.data});
    } else {
      console.log(res);
    }
  }

  async function updateVehicle(val) {
    const { model, make, registration, color, category } = val;
    const apiCall = await fetch(`http://localhost:5050/editvehicle/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        make,
        registration,
        color,
        category,
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

  useEffect(() => {
    getSpecificVehicle(id);
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      model: vehicle.model,
      make: vehicle.make,
      registration: vehicle.registration,
      color: vehicle.color,
      category: vehicle.category,
    },
    validationSchema: Yup.object({
      model: Yup.string().required("Model name required"),
      make: Yup.string().required("Make year required."),
      registration: Yup.string().required("Registration number required."),
      color: Yup.string().required("Color required."),
      category: Yup.string().required("Category required."),
    }),
    onSubmit: (values) => {
      updateVehicle(values);
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
                <a>Vehicles</a>
              </li>
              <li>
                <a>Edit vehicle</a>
              </li>
            </ul>
          </nav>
        </section>
        <section className="p-4">
          <div className="flex flex-col justify-center items-center gap-10 w-full p-4 overflow-x-auto">
            <p className="text-2xl underline text-slate-600">
              Edit Vehicle Form
            </p>
            <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-xl">
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="model">
                    Model
                  </label>
                  <input
                    className="input input-solid"
                    placeholder="Model name"
                    type="text"
                    id="model"
                    name="model"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.model}
                  />
                  {formik.touched.model && formik.errors.model ? (
                    <div className="text-red-500">{formik.errors.model}</div>
                  ) : null}
                </div>

                <div>
                  <label className="sr-only" htmlFor="make">
                    Make
                  </label>
                  <input
                    className="input input-solid"
                    placeholder="Make year"
                    type="text"
                    id="make"
                    name="make"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.make}
                  />
                  {formik.touched.make && formik.errors.make ? (
                    <div className="text-red-500">{formik.errors.make}</div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="registration">
                    Registration
                  </label>
                  <input
                    className="input input-solid"
                    placeholder="Registration number"
                    type="text"
                    id="registration"
                    name="registration"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.registration}
                  />
                  {formik.touched.registration && formik.errors.registration ? (
                    <div className="text-red-500">
                      {formik.errors.registration}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="sr-only" htmlFor="color">
                    Color
                  </label>
                  <input
                    className="input input-solid"
                    placeholder="Color"
                    type="text"
                    id="color"
                    name="color"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.color}
                  />
                  {formik.touched.color && formik.errors.color ? (
                    <div className="text-red-500">{formik.errors.color}</div>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-4 p-4">
                <span>
                  <select
                    id="select"
                    name="category"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="select select-ghost-primary w-[210px]"
                  >
                    <option value="" selected disabled hidden>
                      Choose category
                    </option>
                    {isPending ? (
                      <option>Loading...</option>
                    ) : isError ? (
                      <option>Error</option>
                    ) : (
                      data.map((elem, index) => {
                        return (
                          <>
                            <option value={elem.name} key={index}>
                              {elem.name}
                            </option>
                          </>
                        );
                      })
                    )}
                  </select>
                  {formik.touched.category && formik.errors.category ? (
                    <div className="text-red-500">{formik.errors.category}</div>
                  ) : null}
                </span>
                <button
                  type="submit"
                  className="rounded-lg btn btn-primary btn-block"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Editvehicle;
