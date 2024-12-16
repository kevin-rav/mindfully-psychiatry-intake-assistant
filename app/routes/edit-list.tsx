import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import "bootstrap/dist/css/bootstrap.min.css";

// Define loader data type
type LoaderData = {
  psychiatrists: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
};

// Loader: Fetch all psychiatrists, ordered by ID
export const loader: LoaderFunction = async () => {
  const psychiatrists = await prisma.psychiatrist.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    orderBy: {
      id: "asc", // Sort psychiatrists by ID in ascending order
    },
  });
  return json<LoaderData>({ psychiatrists });
};

// React Component: Render the list of psychiatrists and allow dynamic routes
export default function Edit() {
  const { psychiatrists } = useLoaderData<LoaderData>();

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <div className="card p-4 w-100" style={{ maxWidth: "800px" }}>
        <ul className="list-group">
          {psychiatrists.map((psychiatrist) => (
            <li
              key={psychiatrist.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {psychiatrist.firstName} {psychiatrist.lastName}
              </span>
              <Link
                to={`/edit/${psychiatrist.id}`}
                className="btn btn-primary btn-sm"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}
