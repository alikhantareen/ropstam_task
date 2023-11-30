import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  //funciton to sign up the user
  async function signup(email, username) {
    const apiCall = await fetch("http://localhost:5050/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        username: username,
      }),
    });
    const apiRes = await apiCall.json();
    if (apiRes.response) {
      navigate("/login?signup=success");
    } else {
      setError(apiRes.message);
    }
  }

  //defining a form instance
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email required"),
      username: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Username required"),
    }),
    onSubmit: (values) => {
      signup(values.email, values.username);
    },
  });

  //useEffect to check if the user is logged in or not for protected routes
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/?page=1");
    }
  }, []);
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold">SIGNUP</h1>
          <p className="text-sm">Sign up to make an account with us</p>
        </div>
        {error ? <p className="text-red-500">{error}</p> : ""}
        <form onSubmit={formik.handleSubmit} className="form-group">
          <div className="form-field">
            <label className="form-label">Email address</label>
            <input
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Type email  "
              type="email"
              className="input max-w-full"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-field">
            <label className="form-label">Username</label>
            <input
              id="username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              placeholder="Type username  "
              type="text"
              className="input max-w-full"
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="text-red-500">{formik.errors.username}</div>
            ) : null}
          </div>
          {/* <div className="form-field">
            <label className="form-label">Password</label>
            <input
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Type password  "
              type="password"
              className="input max-w-full"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500">{formik.errors.password}</div>
            ) : null}
          </div> */}
          <div className="form-field pt-5">
            <div className="form-control justify-between">
              <button type="submit" className="btn btn-primary w-full">
                Sign in
              </button>
            </div>
          </div>

          <div className="form-field">
            <div className="form-control justify-center">
              <Link
                to={"/login"}
                className="link link-underline-hover link-primary text-sm"
              >
                Already have an account yet? Log in.
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
