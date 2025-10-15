import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/AuthForm";

export const RegisterPages = () => {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const { register, authState } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      // Manejar error de contraseñas no coincidentes
      return;
    }
    await register(formData.email, formData.password);
    if (authState.logged) navigate("/");
  };

  const registerFields = [
    { type: "email" as const, id: "email", name: "email", placeholder: "Correo electrónico" },
    { type: "password" as const, id: "password", name: "password", placeholder: "Contraseña" },
    { type: "password" as const, id: "confirmPassword", name: "confirmPassword", placeholder: "Confirmar Contraseña" },
  ];

  return (
    <AuthForm
      title="Crea tu cuenta"
      subtitle="Únete a FinTrack y toma el control de tus finanzas."
      fields={registerFields}
      formData={formData}
      errorMessage={authState.errorMessage}
      buttonText="Crear Cuenta"
      footerText="¿Ya tienes una cuenta?"
      footerLinkText="Inicia Sesión"
      footerLinkTo="/login"
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};