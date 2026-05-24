import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/AuthForm";
import { isValidEmail } from "../utils/validateEmail";

export const LoginPages = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, authState } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)) {
      toast.error("El correo debe tener un formato válido que cumpla con el formato '@dominio.com'");
      return;
    }
    await login(formData.email, formData.password);
    if (authState.logged) navigate("/");
  };

  {/*const handleGoogleSignIn = async () => {
    try {
      await singInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Error con Google:", error);
    }
  };*/}

  const loginFields = [
    { type: "email" as const, id: "email", name: "email", placeholder: "Correo electrónico" },
    { type: "password" as const, id: "password", name: "password", placeholder: "Contraseña" },
  ];

    {/*const googleNode = (
      <button
        type="button"
        aria-label="Iniciar sesión con Google"
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-700 text-white hover:bg-white/5 transition-colors"
        onClick={handleGoogleSignIn}
      >
        <span className="w-6 h-6 flex items-center justify-center">
          <FcGoogle className="w-5 h-5" />
        </span>
        <span className="text-sm font-medium">Iniciar sesión con Google</span>
      </button>
    );*/}

  return (
    <AuthForm
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para continuar con tu seguimiento financiero."
      fields={loginFields}
      formData={formData}
      errorMessage={authState.errorMessage}
      buttonText="Iniciar Sesión"
      footerText="¿No tienes una cuenta?"
      footerLinkText="Regístrate"
      footerLinkTo="/register"
      onSubmit={handleSubmit}
      onChange={handleChange}
      showForgotPassword
      //socialNode={googleNode}
    />
  );
};