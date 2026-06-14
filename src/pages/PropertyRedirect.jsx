import { Navigate, useParams, useSearchParams } from "react-router-dom";

export default function PropertyRedirect() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const visita = searchParams.get("visita") === "1" ? "&visita=1" : "";
  return <Navigate to={`/explorar?inmueble=${id}${visita}`} replace />;
}
