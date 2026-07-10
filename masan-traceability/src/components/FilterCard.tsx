import React from "react";

interface FilterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FilterCard: React.FC<FilterCardProps> = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default FilterCard;
