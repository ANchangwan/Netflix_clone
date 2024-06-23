import React from "react";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/TV";
import Search from "./Routes/Search";
import Header from "./components/Header";

const router = createBrowserRouter([
  {
    path: "",
    element: <Header />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "movies/:movieId",
            element: <Home />,
          },
        ],
      },
      {
        path: "tvs",
        element: <Tv />,
        children: [
          {
            path: "/tvs/:tvId",
            element: <Tv />,
          },
        ],
      },
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
