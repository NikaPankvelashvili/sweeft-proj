import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Root from "./Root";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index={true} element={<Home />} />
        <Route path={"history"} element={<History />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
