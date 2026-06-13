import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Bed, Bath, Maximize, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import SmartImage from "@/components/ui/SmartImage";
import { INTERIORS, FALLBACK_IMAGE } from "@/lib/colombiaImages";
import { isInShortlist, toggleShortlist } from "@/lib/shortlist";

const formatCOP = (value) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);

const typeColors = {
  apartamento: "bg-[hsl(340,82%,52%)]",
  casa: "bg-[hsl(168,72%,40%)]",
  estudio: "bg-[hsl(265,75%,58%)]",
  habitacion: "bg-[hsl(200,90%,50%)]",
  penthouse: "bg-[hsl(32,95%,54%)]",
  duplex: "bg-[hsl(340,82%,52%)]",
};

const typeLabel = { apartamento: "Apto", casa: "Casa", estudio: "Estudio", habitacion: "Hab.", penthouse: "PH", duplex: "Dúplex" };

export default function PropertyCard({ property, index = 0, matchScore, showMatch }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(isInShortlist(property.id));
  const image = property.images?.[0] || INTERIORS.sala;
  const typeColor = typeColors[property.property_type] || "bg-primary";

  useEffect(() => {
    const handler = () => setLiked(isInShortlist(property.id));
    window.addEventListener("shortlist-updated", handler);
    return () => window.removeEventListener("shortlist-updated", handler);
  }, [property.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="card-hover"
    >
      <Link to={`/propiedad/${property.id}`} className="group block">
        <article className="rounded-3xl bg-white border border-border/40 overflow-hidden shadow-sm group-hover:shadow-xl group-hover:border-[hsl(265,75%,58%)]/25 transition-all duration-300">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <SmartImage
              src={image}
              alt={property.title}
              fallback={FALLBACK_IMAGE}
              className="absolute inset-0"
              imgClassName="group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isAuthenticated) {
                  navigate("/login", { state: { from: window.location.pathname } });
                  return;
                }
                setLiked(toggleShortlist(property.id));
              }}
              className={cn(
                "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all backdrop-blur-sm",
                liked ? "bg-primary text-white shadow-lg" : "bg-white/90 text-gray-400 hover:text-primary"
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
            </button>

            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span className={cn("px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-sm", typeColor)}>
                {typeLabel[property.property_type] || property.property_type}
              </span>
              {showMatch && matchScore > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-extrabold text-[hsl(265,75%,50%)] shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {matchScore}% match
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-[10px] font-bold">
                <MapPin className="w-3 h-3" />
                {property.neighborhood || property.city}
              </span>
              <p className="font-extrabold text-lg text-white drop-shadow-md">{formatCOP(property.monthly_rent)}</p>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-[hsl(265,75%,50%)] transition-colors">
              {property.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{property.city} · {property.locality}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t border-border/30">
              <span className="flex items-center gap-1.5 font-semibold"><Bed className="w-3.5 h-3.5 text-[hsl(265,75%,58%)]" />{property.bedrooms}</span>
              <span className="flex items-center gap-1.5 font-semibold"><Bath className="w-3.5 h-3.5 text-[hsl(200,90%,50%)]" />{property.bathrooms}</span>
              {property.area_sqm && (
                <span className="flex items-center gap-1.5 font-semibold"><Maximize className="w-3.5 h-3.5 text-[hsl(168,72%,40%)]" />{property.area_sqm}m²</span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
