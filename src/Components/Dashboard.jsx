import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();
  const [numberOfPages, setNumberOfPages] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({"page": ""});
  const pageNumber = searchParams.get("page");
  
  //useQuery for fetching the data and storing in cache for faster access
  const { isPending, isError, data, refetch } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles(pageNumber),
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });

  async function getVehicles(pg_no = 1) {
    const apiRes = await fetch(
      `http://localhost:5050/${localStorage.getItem("user_id")}/?page=${pg_no}`
    );
    const res = await apiRes.json();
    const buttonArray = Array.from(
      { length: res.totalPages },
      (_, index) => index + 1
    );
    setNumberOfPages([...buttonArray]);
    return res;
  }

  //function for deleting a car
  async function deleteCar(id) {
    const apiRes = await fetch(`http://localhost:5050/dashboard/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    });
    const res = await apiRes.json();
    if (res.response) {
      refetch();
      return navigate("/?page=1");
    }
  }

  //componnet life cycle for refetching the data on the re-render
  useEffect(() => {
    refetch();
  }, [searchParams])

  return (
    <div className="h-screen flex">
      <Navbar />
      <main className="w-full p-2 md:p-8">
        <section className="flex flex-col gap-4 md:flex-row justify-between items-center p-4">
          <nav className="breadcrumbs text-lg">
            <ul>
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a>Vehicles</a>
              </li>
            </ul>
          </nav>
          <Link className="w-full md:w-fit" to={"/addvehicle"}>
            <button className="btn btn-solid-primary w-full">
              Add vehicle
            </button>
          </Link>
        </section>
        <section className="">
          <div className="flex flex-col gap-4 w-full overflow-x-auto">
            <table className="table-compact table">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Model</th>
                  <th>Make</th>
                  <th>Registration #</th>
                  <th>Color</th>
                  <th>Category</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <p>Loading...</p>
                ) : isError ? (
                  <p>Something went wrong.</p>
                ) : data.data.length === 0 ? (
                  <p className="text-slate-600">No record to show.</p>
                ) : (
                  data.data.map((elem, index) => {
                    return (
                      <tr>
                        <th>{index + 1}</th>
                        <td>{elem.model}</td>
                        <td>{elem.make}</td>
                        <td>{elem.registration}</td>
                        <td>{elem.color}</td>
                        <td>{elem.category}</td>
                        <td>
                          <Link
                            to={`editvehicle/${elem._id}`}
                            className="btn btn-solid-primary mr-2"
                          >
                            Edit
                          </Link>
                          <Link
                            onClick={() => deleteCar(elem._id)}
                            className="btn btn-solid-warning"
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="pagination">
              {!numberOfPages
                ? ""
                : numberOfPages.map((elem, index) => {
                    return (
                      <Link to={`/?page=${elem}`} onClick={() => getVehicles(elem)}>
                        <input type="radio" name={index} id={index + 1} />
                        <label htmlFor={index + 1} className="btn">
                          {elem}
                        </label>
                      </Link>
                    );
                  })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
