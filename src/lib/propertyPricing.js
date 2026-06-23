import { getTotalMonthly } from "@/lib/propertyCardUtils";

export function getPropertyPricing(property) {
  if (!property) {
    return { rent: 0, admin: 0, deposit: 0, totalMonthly: 0, isSale: false, salePrice: 0 };
  }
  const isSale = property.listing_intent === "venta" || property.listing_type === "venta";
  const rent = property.monthly_rent || 0;
  const admin = property.admin_fee || property.administration_fee || 0;
  const deposit = property.deposit || 0;
  return {
    rent,
    admin,
    deposit,
    totalMonthly: getTotalMonthly(property),
    isSale,
    salePrice: property.sale_price || 0,
  };
}
