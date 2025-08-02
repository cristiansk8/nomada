// utils/price.ts
export const formatPrice = (price: string | number): string => {
  const number = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("es-CO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};