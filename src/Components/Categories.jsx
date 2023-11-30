import React from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Categories = () => {

  //useQuery for fetching the data and storing in cache for faster access
  const { isPending, isError, data, refetch } = useQuery({
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

  //function for deleting a category
  async function deleteCategory(id) {
    const apiRes = await fetch(`http://localhost:5050/categories/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    });
    const res = await apiRes.json();
    refetch();
    return res.response;
  }

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
                <a>Categories</a>
              </li>
            </ul>
          </nav>
          <Link className="w-full md:w-fit" to={"/addcategory"}>
            <button className="btn btn-solid-primary w-full">Add Category</button>
          </Link>
        </section>
        <section>
          <div className="flex w-full overflow-x-auto">
            <table className="table-compact table">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Category</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <p>Loading...</p>
                ) : isError ? (
                  <p>Something went wrong.</p>
                ) : data.length === 0 ? (
                  <p className="text-slate-600">No record to show.</p>
                ) : (
                  data.map((elem, index) => {
                    return (
                      <tr>
                        <th>{index + 1}</th>
                        <td>{elem.name}</td>
                        <td>
                        <Link
                            to={`/editcategory/${elem._id}`}
                            className="btn btn-solid-primary mr-2"
                          >
                            Edit
                          </Link>
                          <Link
                            onClick={() => deleteCategory(elem._id)}
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default Categories;
