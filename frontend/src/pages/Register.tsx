import { useState } from "react";
import { useRegister } from "../hooks/user";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/authorization";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const register = useRegister();
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const username = form.get("username")?.toString().trim();
    const password = form.get("password")?.toString();
    const confirmPassword = form.get("confirmPassword")?.toString();

    if (!username || !password || !confirmPassword) {
      Swal.fire("Campos incompletos", "Todos los campos son obligatorios.", "warning");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Contraseña incorrecta", "Las contraseñas no coinciden.", "error");
      setIsLoading(false);
      return;
    }

    try {
      const response = await register.mutateAsync({ username, password });

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: `Usuario ${username} registrado correctamente.`,
        timer: 2500,
        showConfirmButton: false,
      });

      console.log("User registered:", response);

      const data = await response.json();
      authenticate(data.user, data.token);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error al registrar:", error);
      if (error?.errors && Array.isArray(error.errors)) {
        const messages = error.errors.map((e: any) => `• ${e.msg}`).join("<br>");
        Swal.fire({
          icon: "error",
          title: "Errores de validación",
          html: messages,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: error?.message || "No se pudo registrar el usuario.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">Registrarse</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-100">
              Usuario
            </label>
            <div className="mt-2">
              <input id="username" name="username" type="text" required className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500 sm:text-sm" disabled={isLoading} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
              Contraseña
            </label>
            <div className="mt-2">
              <input id="password" name="password" type="password" required className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500 sm:text-sm" disabled={isLoading} />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-100">
              Confirmar contraseña
            </label>
            <div className="mt-2">
              <input id="confirmPassword" name="confirmPassword" type="password" required className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500 sm:text-sm" disabled={isLoading} />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 transition-colors">
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>
        <p className="mt-10 text-center text-sm/6 text-gray-400">
          <a className="font-semibold text-indigo-400 hover:text-indigo-300" onClick={() => navigate("/")}>
            Iniciar Sesión
          </a>
        </p>
      </div>
    </div>
  );
}
