/** Inserta tarjeta promo de propietario en posiciones del grid de Explorar. */
export function shouldInsertOwnerPromo(index) {
  return index === 1 || (index > 1 && (index - 1) % 10 === 0);
}

export const EXPLORE_SPLIT_LAYOUT = "lg:grid-cols-[2fr_3fr]";
export const EXPLORE_GUTTER = "px-5 lg:px-8";
export const EXPLORE_CONTENT_PAD = "px-5 lg:px-8 py-3 lg:py-4";
