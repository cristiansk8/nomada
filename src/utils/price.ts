/**
 * Calcula el precio ajustado según un porcentaje de aumento.
 * @param original Precio original (string o número)
 * @param percentage Porcentaje de aumento (por defecto 40)
 * @returns Precio ajustado como string con 0 decimales
 */
export function getAjustedPrice(original: string | number, percentage: number = 40): string {
  const value = typeof original === "string" ? parseFloat(original) : original;
  if (isNaN(value)) return "0";
  return (value * (1 + percentage / 100)).toFixed(0);
}  