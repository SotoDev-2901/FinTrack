import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/AuthForm";
import { FcGoogle } from "react-icons/fc";

export const RegisterPages = () => {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const { register, singInWithGoogle, authState } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("❌Las contraseñas no coinciden");
      return;
    }
    await register(formData.email, formData.password);
    if (authState.logged) navigate("/");
  };

    // Función para manejar Google
  const handleGoogleSignIn = async () => {
    try {
      await singInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Error con Google:", error);
      // Opcional: mostrar error en UI
    }
  };

  const registerFields = [
    { type: "email" as const, id: "email", name: "email", placeholder: "Correo electrónico" },
    { type: "password" as const, id: "password", name: "password", placeholder: "Contraseña" },
    { type: "password" as const, id: "confirmPassword", name: "confirmPassword", placeholder: "Confirmar Contraseña" },
  ];

  const googleNode = (
    <button
      type="button"
      aria-label="Iniciar sesión con Google"
      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-700 text-white hover:bg-white/5 transition-colors"
      onClick={handleGoogleSignIn}
    >
      <span className="w-6 h-6 flex items-center justify-center">
        <FcGoogle className="w-5 h-5" />
      </span>
      <span className="text-sm font-medium">Regístrate con Google</span>
    </button>
  );

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
      socialNode={googleNode}
    />
  );
};