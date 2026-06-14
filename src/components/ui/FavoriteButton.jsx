import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleShortlist } from "@/lib/shortlist";

export default function FavoriteButton({
  propertyId,
  liked,
  onToggle,
  className,
  iconClassName,
  size = "md",
  requireAuth,
  onRequireAuth,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (requireAuth && onRequireAuth) {
      onRequireAuth();
      return;
    }

    const nowLiked = toggleShortlist(propertyId);
    onToggle?.(nowLiked);
    toast.success(nowLiked ? "Guardado en tus favoritos" : "Eliminado de favoritos", {
      duration: 2000,
    });
  };

  const sizes = {
    sm: "w-9 h-9",
    md: "w-10 h-10",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "rounded-full flex items-center justify-center z-10 transition-colors",
        sizes[size],
        liked ? "bg-primary text-white shadow-lg" : "bg-white/95 text-gray-400 hover:text-primary shadow-sm",
        className
      )}
      aria-label={liked ? "Quitar de favoritos" : "Guardar en favoritos"}
    >
      <motion.span
        key={liked ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: [0.6, 1.25, 1] }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Heart className={cn("w-4 h-4", liked && "fill-current", iconClassName)} strokeWidth={2.25} />
      </motion.span>
    </button>
  );
}
