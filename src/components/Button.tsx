// CheckBoxTreeButton.tsx
import React, { ButtonHTMLAttributes } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode; // Contenido que se renderizará dentro del botón
    title?: string; // Título para la accesibilidad y tooltip
}

function Button({ children, title, ...props }: ButtonProps) {
    return (
        <button
            aria-label={title}
            title={title}
            type="button"
            {...props} // Propaga cualquier otra prop estándar de un botón HTML
        >
            {children}
        </button>
    );
}

export default Button;