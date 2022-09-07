import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const client = new W3CWebSocket("wss://tarea-1.2022-2.tallerdeintegracion.cl/connect");

function Connect () {

  const [flight_id_land, setflight_id_land] = useState("");
  const [vuelardos, setvuelardos] = useState([]);

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
        const plane = mensaje.plane;
        console.log("plane"); 
      }

      if (mensaje.type === "take-off") {
        const flight_id_off = mensaje.flight_id
        console.log("TAKE-OFF:", flight_id_off); 
      }

      if (mensaje.type === "landing") {
        setflight_id_land(mensaje.flight_id) 
        console.log("LANDING:", flight_id_land); 
      }

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

  }, []);

  return(
    <>
      <div className='map'>
      <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={true}>
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[0,0]}>
            <Popup>
                {flight_id_land} <br />
            </Popup>
          </Marker>

          {console.log(vuelardos)}

          {/* Aeropuertos*/}
          {Object.keys(vuelardos).map((key) => {

            const avion = vuelardos[key];
            const data = [avion.departure.location.lat, avion.departure.location.long];
            return(
              <Marker position={data}>
              </Marker> 
            )})}

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
