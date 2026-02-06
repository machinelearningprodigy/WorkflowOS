import { BaseProvider, Action } from "../base.provider";

export class GoogleMapsProvider extends BaseProvider {
    name = "Google Maps";
    type = "MAPS";
    public slug = 'google-maps';
    authType: 'api_key' = 'api_key';

    async testConnection(apiKey: string): Promise<boolean> {
        try {
            // Test with a simple Geocoding request (requires Geocoding API enabled)
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${apiKey}`);
            const data = await response.json();
            return data.status === "OK" || data.status === "ZERO_RESULTS";
        } catch {
            return false;
        }
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: "geocode",
                name: "Geocode Address",
                description: "Convert an address into geographic coordinates.",
                inputs: [
                    { id: "address", name: "Address", type: "string", required: true }
                ]
            },
            {
                id: "distance_matrix",
                name: "Calculate Distance",
                description: "Get travel distance and time between two points.",
                inputs: [
                    { id: "origins", name: "Origin", type: "string", required: true },
                    { id: "destinations", name: "Destination", type: "string", required: true }
                ]
            }
        ];
    }
}
