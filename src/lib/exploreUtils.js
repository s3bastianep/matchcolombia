/** Inserta tarjeta promo de propietario en posiciones del grid de Explorar. */
export function shouldInsertOwnerPromo(index) {
  return index === 1 || (index > 1 && (index - 1) % 10 === 0);
}

export const EXPLORE_SPLIT_LAYOUT = "lg:grid-cols-[2fr_3fr]";
