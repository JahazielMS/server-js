import { ProductsModule } from "./Product";
import Navbar from "../components/NavBar";
import { useAuth } from "../hooks/authorization";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  if (user === null) {
    return null;
  }
  return (
    <div className="fixed inset-0 min-h-screen w-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col w-full overflow-auto">
        <div className="flex-1 px-2 py-4 sm:px-4 lg:px-8 w-full">
          <div className="w-full max-w-7xl mx-auto">
            <div>
              <ProductsModule />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
