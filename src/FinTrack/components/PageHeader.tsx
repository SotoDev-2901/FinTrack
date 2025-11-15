interface pageHeaderProps {
  title: string;
  description?: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: React.ReactNode;
}

export const PageHeader = ({
  title,
  description,
  buttonText,
  onButtonClick,
  icon,
}: pageHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          {title}
        </h1>
        <button
          onClick={onButtonClick}
          className="bg-secondary hover:bg-sky-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          {icon}
          <span>{buttonText}</span>
        </button>
      </div>
      
      {description && (
        <p className="text-gray-400 text-base sm:text-lg mt-2 font-light tracking-wide">
          {description}
        </p>
      )}
    </div>
  );
};