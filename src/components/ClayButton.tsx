import React from 'react';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

const ClayButton: React.FC<ClayButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 active:scale-95 active:translate-y-0 focus:outline-none";
  
  const variants = {
    primary: "bg-pink-300 text-pink-900 clay-shadow-md hover:shadow-pink-300/50",
    secondary: "bg-teal-200 text-teal-900 clay-shadow-md hover:shadow-teal-200/50",
    danger: "bg-orange-200 text-orange-900 clay-shadow-md hover:shadow-orange-200/50",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default ClayButton;
