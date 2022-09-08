import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet'
import "./salida.png";
import "./Map.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const client = new W3CWebSocket("wss://tarea-1.2022-2.tallerdeintegracion.cl/connect");

function Connect () {

  //const [flight_id_land, setflight_id_land] = useState("");
  const [vuelardos, setvuelardos] = useState([]);
  const [positions, setpositions] = useState([]);

  client.onopen = () => {
    console.log('Websocket Client Connected');

    client.send(JSON.stringify({
      type: "join",
      id: "b4cc1cdd-dd4e-4d8b-8bcd-4cb7c1665e9d",
      username: "Seba",
    }));
  };

  useEffect(() => {

    client.onmessage = (message) => {
      const mensaje = JSON.parse(message.data);

      var table = document.getElementById("mytable");

      if (mensaje.type === "flights") {
        const vuelos = mensaje.flights
        
        const active_flights = Object.keys(vuelos).map(function(key)
           { return vuelos[key]; });
          setvuelardos(active_flights);
        

        for (const vuelo in vuelos){
          // Obtenemos la info que necesitamos
          const flight_id = vuelos[vuelo].id
          const departure_id = vuelos[vuelo].departure.id
          const destination_id = vuelos[vuelo].destination.id
          const departure_date = vuelos[vuelo].departure_date

          // Agregamos la información en las tablas
          var row = table.insertRow(0);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          cell1.innerHTML = flight_id;
          cell2.innerHTML = departure_id;
          cell3.innerHTML = destination_id;
          cell4.innerHTML = departure_date;
        }
      }

      if (mensaje.type === "plane") {
        const javion = mensaje.plane;
        setpositions({...positions, [javion.flight_id]: [[javion.position.lat, javion.position.long], [javion.airline.name], [javion.captain], [javion.ETA], [javion.status]]})
        console.log("plane"); 
      }

      if (mensaje.type === "take-off") {
        const flight_id_off = mensaje.flight_id
        console.log("TAKE-OFF:", flight_id_off); 
      }

      if (mensaje.type === "landing") {
        //setflight_id_land(mensaje.flight_id) 
        console.log("LANDING:")}

      if (mensaje.type === "crashed") {
        //setflight_id_crash(mensaje.flight_id)
        console.log("CRASHED:")}

      if (mensaje.type === "message") {
        const chat_id = mensaje.message.flight_id
        const chat_level = mensaje.message.level
        const chat_name = mensaje.message.name
        const chat_date = mensaje.message.date
        const chat_content = mensaje.message.content
        console.log("MESSAGE FROM:", chat_id,"-", chat_name,":", chat_content, chat_date, chat_level)
      }

    };

  }, [positions]);

  //const fillBlueOptions = { fillColor: 'blue' }
  const blackOptions = { color: 'black' }
  const purpleOptions = { color: 'purple' }
  const limeOptions = { color: 'lime' }
  const redOptions = { color: 'red' }

  return(
    <>
      <div className='map'>
      <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={true}>
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Aeropuertos de Salida*/}
          {Object.keys(vuelardos).map((key) => {
            const avion = vuelardos[key];
            const aeropuertos_salida = [avion.departure.location.lat, avion.departure.location.long];
            return (
              <Marker position={aeropuertos_salida} iconUrl={"salida.png"}>
                <Popup>
                  Aeropuerto de Salida: {avion.departure.name} <br />
                  Vuelo: {avion.id} <br />
                  Pais: {avion.departure.city.country.name}<br />
                  Ciudad: {avion.departure.city.name}<br />
                  <br />
                </Popup>
              </Marker>
            )
          })}


          {/* Aeropuertos de Llegada*/}
          {Object.keys(vuelardos).map((key) => {
            const avion = vuelardos[key];
            const aeropuertos_llegada = [avion.destination.location.lat, avion.destination.location.long];
            return (
              <Marker position={aeropuertos_llegada}>
                <Popup>
                  Aeropuerto de Llegada: {avion.destination.name} <br />
                  Vuelo: {avion.id} <br />
                  Pais: {avion.destination.city.country.name}<br />
                  Ciudad: {avion.destination.city.name}<br />
                </Popup>
              </Marker>
            )
          })}
          
          {/* Aviones*/}
          {Object.keys(positions).map((key) => {
            const ubi = positions[key][0];
            const airline = positions[key][1]
            const captain = positions[key][2]
            const ETA = positions[key][3]
            const status = positions[key][4]
            
            return (
              <div>
                {status === "flying" ?
                  <CircleMarker center={ubi} radius={2} pathOptions={blackOptions}>
                    <Popup>
                      Avion: {key} <br />
                      Airline: {airline} <br />
                      Captain: {captain} <br />
                      ETA: {ETA} <br />
                      Status: {status} <br />
                    </Popup>
                  </CircleMarker> : status === "crashed"?
                  <CircleMarker center={ubi} radius={2} pathOptions={redOptions}>
                    <Popup>
                      Avion: {key} <br />
                      Airline: {airline} <br />
                      Captain: {captain} <br />
                      ETA: {ETA} <br />
                      Status: {status} <br />
                    </Popup>
                  </CircleMarker>: status === "landed"?
                  <CircleMarker center={ubi} radius={2} pathOptions={purpleOptions}>
                    <Popup>
                      Avion: {key} <br />
                      Airline: {airline} <br />
                      Captain: {captain} <br />
                      ETA: {ETA} <br />
                      Status: {status} <br />
                    </Popup>
                  </CircleMarker>: 
                  <CircleMarker center={ubi} radius={2} pathOptions={blackOptions}>
                  <Popup>
                    Avion: {key} <br />
                    Airline: {airline} <br />
                    Captain: {captain} <br />
                    ETA: {ETA} <br />
                    Status: {status} <br />
                  </Popup>
                </CircleMarker>
                  }
              
              </div>
            )
          })}

          {/* Trayectos */}
          {Object.keys(vuelardos).map((key) => {
            const avion = vuelardos[key];
            const trayecto = [
              [avion.departure.location.lat, avion.departure.location.long],
              [avion.destination.location.lat, avion.destination.location.long],
            ];
            return (
              <Polyline pathOptions={limeOptions} positions={trayecto} />
            )
          })}

      </MapContainer>
  </div>
    </>
  )

};

export default Connect;



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
