/** Opciones compartidas para listados de propiedades (cache en cliente). */
export const PROPERTY_LIST_QUERY = {
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 30,
};

export const PROPERTY_DETAIL_QUERY = {
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 20,
};
