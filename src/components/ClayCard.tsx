import React from 'react';

interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const ClayCard: React.FC<ClayCardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-gray-50 rounded-[32px] p-6 clay-shadow-lg ${className}`}>
      {title && (
        <h3 className="text-xl font-black text-gray-700 mb-4 text-center tracking-wide">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default ClayCard;
