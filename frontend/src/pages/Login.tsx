import { useState } from "react";
import { useBackend } from "../hooks/backend";
import { useAuth } from "../hooks/authorization";
import type { Credentials } from "../types";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { post } = useBackend();
  const { authenticate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const username = e.currentTarget.user.value.trim();
    const password = e.currentTarget.password.value.trim();

    const credentials: Credentials = { username, password };
    try {
      const loginResponse = await post("/auth/login", credentials);

      if (!loginResponse.ok) {
        const error = await loginResponse.json();
        Swal.fire({
          icon: "error",
          title: "Error de inicio de sesión",
          text: loginResponse.statusText === "Unauthorized" ? error.message : "Ocurrió un error inesperado",
        });

        return;
      }

      const data = await loginResponse.json();

      authenticate(data.user, data.token);
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: error instanceof Error ? error.message : "Ocurrió un error inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Iniciar Sesión</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="user" className="block text-sm/6 font-medium text-gray-100">
                Usuario
              </label>
              <div className="mt-2">
                <input id="user" name="user" type="text" required autoComplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" disabled={isLoading} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                Contraseña
              </label>
              <div className="mt-2">
                <input id="password" name="password" type="password" required autoComplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" disabled={isLoading} />
              </div>
            </div>

            <div>
              <button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            <a className="font-semibold text-indigo-400 hover:text-indigo-300" onClick={() => navigate("/register")}>
              Registrarse
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
