import React, { useRef, useEffect, InputHTMLAttributes } from 'react';

// Define la interfaz de las props para NativeCheckbox
// Extiende InputHTMLAttributes<HTMLInputElement> para incluir todas las props estándar de un input HTML
export interface NativeCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean; // La propiedad específica para el estado indeterminado
}

function NativeCheckbox(props: NativeCheckboxProps) {
  // Desestructura `indeterminate` de las props y recolecta el resto de las props
  const { indeterminate = false, ...rest } = props; // UPDATE: Se añade valor por defecto a indeterminate

  // Crea una ref para acceder directamente al elemento DOM input
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Efecto para actualizar la propiedad `indeterminate` del elemento input nativo
  // Se ejecuta después de cada render donde la prop `indeterminate` pudo haber cambiado.
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]); 

  return (
    <input
      {...rest} // Pasa todas las demás props (como checked, onChange, etc.)
      ref={checkboxRef} // Asigna la ref al elemento input
      type="checkbox"
    /> 
  );
}

export default NativeCheckbox;