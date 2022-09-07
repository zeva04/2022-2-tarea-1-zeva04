import { MapContainer, TileLayer } from 'react-leaflet';
import './Map.css';

export default function Map() {
    return(
        <div className='map'>
            <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
            </MapContainer>
        </div>
    )
};
