import { Navigate, useLocation } from "react-router-dom";
import CityLTBTemplate from "@/components/CityLTBTemplate";
import { getCityConfig } from "@/data/cityConfigs";

export default function LTBCityPage() {
  const location = useLocation();
  const slug = location.pathname.replace('/', '');
  
  const config = getCityConfig(slug);
  
  if (!config) {
    return <Navigate to="/ltb-help" replace />;
  }

  return <CityLTBTemplate config={config} />;
}