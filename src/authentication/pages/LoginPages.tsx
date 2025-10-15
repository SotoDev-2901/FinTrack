import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/AuthForm";

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
    await login(formData.email, formData.password);
    if (authState.logged) navigate("/");
  };

  const loginFields = [
    { type: "email" as const, id: "email", name: "email", placeholder: "Correo electrónico" },
    { type: "password" as const, id: "password", name: "password", placeholder: "Contraseña" },
  ];

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
    />
  );
};