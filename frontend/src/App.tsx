import { RouterProvider } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Navbar from "./components/NavBar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { useAuth } from "./hooks/authorization";
import { router } from "./router";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
        </Routes>
      </Router> */}
    </QueryClientProvider>
  );
}

export default App;
