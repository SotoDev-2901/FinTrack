interface pageHeaderProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  icon,
}: pageHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">{title}</h1>
        <button
          onClick={onButtonClick}
          className="bg-secondary hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
        >
          {icon}
          <span>{buttonText}</span>
        </button>
      </div>
      
      {subtitle && (
        <p className="text-gray-400 text-lg mt-2 font-light tracking-wide">{subtitle}</p>
      )}
    </div>
  );
};
