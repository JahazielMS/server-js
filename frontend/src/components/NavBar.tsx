import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authorization";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const username = user?.username || "Nombre";
  const role = user?.role === "admin" ? "A" : "U";
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div>
        <span className="font-bold text-lg">Inventarios</span>
        <span className="ml-4 font-bold">{username}</span>
        <span className="ml-2">({role})</span>
      </div>
      <div>
        {user ? (
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Cerrar Sesión
          </button>
        ) : (
          <Link to="/" className="bg-green-500 px-3 py-1 rounded">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
