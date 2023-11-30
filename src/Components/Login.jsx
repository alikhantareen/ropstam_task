import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams({"signup": ""});
  const success = searchParams.get("signup");
  async function login(email, password) {
    const apiCall = await fetch("http://localhost:5050/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const apiRes = await apiCall.json();
    if (apiRes.response) {
      localStorage.setItem("token", apiRes.token);
      localStorage.setItem("user", apiRes.user.email);
      localStorage.setItem("user_id", apiRes.user._id);
      navigate(`/?page=1`);
    } else {
      setError(apiRes.message);
    }
  }
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email required"),
      password: Yup.string()
        .min(8, "Must be 8 characters or more")
        .required("Password required"),
    }),
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/?page=1");
    }
  }, []);
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold">LOGIN</h1>
          <p className="text-sm">Log in to access your account</p>
        </div>
        {error ? <p className="text-red-500">{error}</p> : ""}
        {success ? (
          <p className="text-green-500">
            Please check your email to complete signup. ✨
          </p>
        ) : (
          ""
        )}
        <form onSubmit={formik.handleSubmit} className="form-group">
          <div className="form-field">
            <label className="form-label">Email address</label>
            <input
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Type here"
              type="email"
              className="input max-w-full"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Type here"
              type="password"
              className="input max-w-full"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="form-field pt-5">
            <div className="form-control justify-between">
              <button type="submit" className="btn btn-primary w-full">
                Log in
              </button>
            </div>
          </div>

          <div className="form-field">
            <div className="form-control justify-center">
              <Link
                to={"/signup"}
                className="link link-underline-hover link-primary text-sm"
              >
                Don't have an account yet? Sign up.
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
