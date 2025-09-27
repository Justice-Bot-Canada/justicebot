import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  ExternalLink,
  Edit3,
  Search
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "sonner";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Court {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  website: string;
  hours: string;
  lat: number;
  lng: number;
  venueTypes: string[];
}

interface TribunalLocatorProps {
  venue?: string;
  userProvince?: string;
  userMunicipality?: string;
  caseDescription?: string;
  onCourtSelected?: (court: Court) => void;
}

// Sample court data - in production, this would come from a database
const courts: Court[] = [
  {
    id: "ltb-toronto",
    name: "Landlord and Tenant Board - Toronto Office",
    type: "Tribunal",
    address: "15 Grosvenor Street",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M7A 2G6",
    phone: "416-645-8080",
    website: "https://tribunalsontario.ca/ltb/",
    hours: "Monday-Friday 8:30 AM - 5:00 PM",
    lat: 43.6532,
    lng: -79.3832,
    venueTypes: ["ltb"]
  },
  {
    id: "hrto-toronto",
    name: "Human Rights Tribunal of Ontario",
    type: "Tribunal", 
    address: "655 Bay Street",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M7A 2A3",
    phone: "416-326-1312",
    website: "https://www.sjto.gov.on.ca/hrto/",
    hours: "Monday-Friday 8:30 AM - 5:00 PM",
    lat: 43.6577,
    lng: -79.3864,
    venueTypes: ["hrto"]
  },
  {
    id: "small-claims-toronto",
    name: "Small Claims Court - Toronto",
    type: "Court",
    address: "47 Sheppard Avenue East",
    city: "Toronto", 
    province: "Ontario",
    postalCode: "M2N 5X5",
    phone: "416-326-3554",
    website: "https://www.ontariocourts.ca/scj/",
    hours: "Monday-Friday 8:30 AM - 4:30 PM",
    lat: 43.7615,
    lng: -79.4111,
    venueTypes: ["small-claims"]
  },
  {
    id: "family-court-toronto",
    name: "Family Court - Toronto",
    type: "Court",
    address: "393 University Avenue",
    city: "Toronto",
    province: "Ontario", 
    postalCode: "M5G 1E6",
    phone: "416-327-5020",
    website: "https://www.ontariocourts.ca/scj/",
    hours: "Monday-Friday 8:30 AM - 4:30 PM",
    lat: 43.6550,
    lng: -79.3890,
    venueTypes: ["family"]
  }
];

// Component to update map center when coordinates change
function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], 12);
  }, [lat, lng, map]);
  
  return null;
}

const TribunalLocator: React.FC<TribunalLocatorProps> = ({
  venue,
  userProvince = "Ontario",
  userMunicipality = "Toronto",
  caseDescription = "",
  onCourtSelected
}) => {
  const [searchAddress, setSearchAddress] = useState(`${userMunicipality}, ${userProvince}`);
  const [customAddress, setCustomAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 43.6532, lng: -79.3832 }); // Default to Toronto
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  useEffect(() => {
    // Filter courts based on venue type and province
    let filtered = courts.filter(court => 
      court.province.toLowerCase() === userProvince.toLowerCase()
    );

    if (venue) {
      filtered = filtered.filter(court => 
        court.venueTypes.includes(venue)
      );
    }

    setFilteredCourts(filtered);
  }, [venue, userProvince]);

  useEffect(() => {
    if (searchAddress) {
      geocodeAddress(searchAddress);
    }
  }, [searchAddress]);

  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;
    
    setLoading(true);
    try {
      // Use Nominatim (free OpenStreetMap geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=ca`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        setMapCenter({
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon)
        });
      } else {
        toast.error("Address not found. Using default location.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to find address. Using default location.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressEdit = () => {
    setIsEditingAddress(true);
    setCustomAddress(searchAddress);
  };

  const handleAddressUpdate = () => {
    if (customAddress.trim()) {
      setSearchAddress(customAddress);
      setIsEditingAddress(false);
    }
  };

  const calculateDistance = (court: Court): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (court.lat - mapCenter.lat) * Math.PI / 180;
    const dLng = (court.lng - mapCenter.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(mapCenter.lat * Math.PI / 180) * Math.cos(court.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortedCourts = filteredCourts
    .map(court => ({
      ...court,
      distance: calculateDistance(court)
    }))
    .sort((a, b) => a.distance - b.distance);

  const getVenueTypeLabel = (venueType: string) => {
    switch (venueType) {
      case 'ltb': return 'Landlord & Tenant Board';
      case 'hrto': return 'Human Rights Tribunal';
      case 'small-claims': return 'Small Claims Court';
      case 'family': return 'Family Court';
      default: return 'Court';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Find Nearby Courts & Tribunals
          </CardTitle>
          <CardDescription>
            {venue ? `Showing ${getVenueTypeLabel(venue)} locations` : 'Showing all court locations'} near your address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address Section */}
          <div className="space-y-2">
            <Label>Search Location</Label>
            {!isEditingAddress ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={searchAddress}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddressEdit}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="Enter address or city, province"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddressUpdate()}
                />
                <Button onClick={handleAddressUpdate} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingAddress(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {isEditingAddress 
                ? "Change this if the incident happened in a different location"
                : "Click edit if the incident happened elsewhere"
              }
            </p>
          </div>

          {/* Map */}
          <div className="h-64 w-full rounded-lg overflow-hidden border">
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapCenter lat={mapCenter.lat} lng={mapCenter.lng} />
              
              {/* User location marker */}
              <Marker position={[mapCenter.lat, mapCenter.lng]}>
                <Popup>
                  <div className="text-center">
                    <strong>Your Location</strong><br />
                    {searchAddress}
                  </div>
                </Popup>
              </Marker>

              {/* Court markers */}
              {filteredCourts.map((court) => (
                <Marker 
                  key={court.id} 
                  position={[court.lat, court.lng]}
                >
                  <Popup>
                    <div className="min-w-48">
                      <h4 className="font-semibold mb-1">{court.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {court.address}<br />
                        {court.city}, {court.province} {court.postalCode}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCourt(court);
                          onCourtSelected?.(court);
                        }}
                        className="w-full"
                      >
                        Select This Location
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Courts List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Nearby Locations ({sortedCourts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedCourts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No courts found for the selected criteria.</p>
              <p className="text-sm">Try expanding your search area or checking different venue types.</p>
            </div>
          ) : (
            sortedCourts.map((court) => (
              <div 
                key={court.id}
                className={`p-4 border rounded-lg transition-colors ${
                  selectedCourt?.id === court.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{court.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{court.type}</Badge>
                      <Badge variant="secondary">
                        {court.distance.toFixed(1)} km away
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="text-sm">
                        {court.address}<br />
                        {court.city}, {court.province} {court.postalCode}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{court.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{court.hours}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={court.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedCourt(court);
                      onCourtSelected?.(court);
                      toast.success(`Selected ${court.name}`);
                    }}
                    variant={selectedCourt?.id === court.id ? "default" : "outline"}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {selectedCourt?.id === court.id ? "Selected" : "Select Location"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        `${court.address}, ${court.city}, ${court.province} ${court.postalCode}`
                      )}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TribunalLocator;