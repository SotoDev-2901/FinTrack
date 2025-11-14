import { Link } from "react-router-dom";
import { AuthInput } from "./AuthInput";

interface AuthFormField {
  type: "text" | "email" | "password";
  id: string;
  name: string;
  placeholder: string;
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: AuthFormField[];
  formData: Record<string, string>;
  errorMessage?: string | null;
  buttonText: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
  onSubmit: (e: any) => void;
  onChange: (e: any) => void;
  showForgotPassword?: boolean;
  socialNode?: React.ReactNode;
}

export const AuthForm = ({ 
  title,
  subtitle,
  fields,
  formData,
  errorMessage,
  buttonText,
  footerText,
  footerLinkText,
  footerLinkTo,
  onSubmit,
  onChange,
  showForgotPassword = false,
  socialNode,
}: AuthFormProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg bg-background shadow-2xl rounded-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">{subtitle}</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-xl">
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          {fields.map((field) => (
            <AuthInput
              key={field.id}
              type={field.type}
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              required
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-400 text-gray-400 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
            />
          ))}

          {showForgotPassword && (
            <div className="text-right">
              <Link to="#" className="text-secondary text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-secondary hover:bg-sky-600 text-white font-semibold py-3 rounded-xl shadow transition-all"
          >
            {buttonText}
          </button>
        </form>

        
          {socialNode && (
          <div className="mt-6">
            <div className="flex items-center gap-4 my-4">
              <hr className="flex-1 border-t border-gray-700/40" />
              <span className="text-gray-500 text-sm">O continúa con</span>
              <hr className="flex-1 border-t border-gray-700/40" />
            </div>

            {socialNode}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {footerText}{" "}
            <Link to={footerLinkTo} className="text-secondary font-medium hover:underline">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
