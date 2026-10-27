import { createHashRouter, Navigate } from "react-router";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../pages/TasksPage";
import CalculatorPage from "../pages/CalculatorPage";
import SidebarLayout from "../layouts/SidebarLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "../auth/PublicRoute";
import EchoPage from "../pages/EchoPage";

export const router = createHashRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          element: <PublicRoute />,
          children: [
            {
              path: "login",
              element: <LoginPage />,
            },
          ],
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <SidebarLayout />,
              children: [
                {
                  path: "dashboard",
                  element: <DashboardPage />,
                },
                {
                  path: "tasks",
                  element: <TasksPage />,
                },
                {
                  path: "calculator",
                  element: <CalculatorPage />,
                },
                {
                  path: "echo",
                  element: <EchoPage />,
                },
              ],
            },
          ],
        },
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ],
  {
    basename: "/IDICorp-Service-Console",
  },
);
