interface AuthInputProps {
  type: "text" | "email" | "password";
  id: string;
  name: string;
  placeholder: string;
  value: string;
  required?: boolean;
  onChange: (e: any) => void;
  className?: string;
}

export const AuthInput = ({
  type,
  id,
  name,
  placeholder,
  value,
  required,
  onChange,
  className,
}: AuthInputProps) => {
  return (
    <div>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange}
        className={className}
      />
    </div>
  );
};
