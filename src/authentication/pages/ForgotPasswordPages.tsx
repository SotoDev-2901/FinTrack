import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/AuthForm";

export const ForgotPasswordPages = () => {
  const [formData, setFormData] = useState({ email: "" });
  const { resetPassword, authState, clearResetPasswordSuccess } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearResetPasswordSuccess();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await resetPassword(formData.email);
  };

  // Auto-redirigir a login después de éxito
  useEffect(() => {
    if (authState.resetPasswordSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000); // 5 segundos

      return () => clearTimeout(timer);
    }
  }, [authState.resetPasswordSuccess, navigate]);

  const forgotPasswordFields = [
    {
      type: "email" as const,
      id: "email",
      name: "email",
      placeholder: "Correo electrónico"
    },
  ];

  return (
    <AuthForm
      title="Recuperar contraseña"
      subtitle="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
      fields={forgotPasswordFields}
      formData={formData}
      errorMessage={authState.errorMessage}
      successMessage={
        authState.resetPasswordSuccess
          ? "¡Correo enviado! Revisa tu bandeja de entrada y sigue las instrucciones. Serás redirigido al login en 5 segundos..."
          : undefined
      }
      buttonText="Enviar enlace de recuperación"
      footerText="¿Recordaste tu contraseña?"
      footerLinkText="Inicia Sesión"
      footerLinkTo="/login"
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};
