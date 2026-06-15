import { useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";
import { absoluteUrl, getPropertySeo, resolveRouteSeo } from "@/lib/seo";
import SeoHead from "./SeoHead";

export default function RouteSeo() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { property } = usePropertyPanel();
  const query = searchParams.toString();

  const seo = useMemo(() => {
    if (property) {
      const propertySeo = getPropertySeo(property);
      if (propertySeo) return propertySeo;
    }
    return resolveRouteSeo(pathname, new URLSearchParams(query));
  }, [pathname, query, property]);

  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      image={seo.image}
      url={seo.url ? absoluteUrl(seo.url) : absoluteUrl(pathname)}
      noindex={seo.noindex}
      jsonLd={seo.jsonLd || []}
    />
  );
}
