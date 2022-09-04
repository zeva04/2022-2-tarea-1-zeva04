import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const client = new W3CWebSocket("wss://tarea-1.2022-2.tallerdeintegracion.cl/connect");

function Connect () {

  useEffect(() => {
    client.onopen = () => {
      console.log('Websocket Client Connected');

    client.send(JSON.stringify({
      type: "join",
      id: "b4cc1cdd-dd4e-4d8b-8bcd-4cb7c1665e9d",
      username: "Seba",
    }));
    };

    client.onmessage = (message) => {
      const mensaje = JSON.parse(message.data);
      console.log(mensaje);

      if (mensaje.type === "flights") {
        const vuelos = mensaje.flights
        for (const vuelo in vuelos){
          const flight_id = vuelos[vuelo].id
          const departure_id = vuelos[vuelo].departure.id
          const destination_id = vuelos[vuelo].destination.id
          const departure_date = vuelos[vuelo].departure_date
          console.log("FLIGHT:", flight_id, departure_id, destination_id, departure_date)
        }
      }

      if (mensaje.type === "plane") {
        console.log("plane"); 
      }

      if (mensaje.type === "take-off") {
        const flight_id_off = mensaje.flight_id
        console.log("TAKE-OFF:", flight_id_off); 
      }

      if (mensaje.type === "landing") {
        const flight_id_land = mensaje.flight_id
        console.log("LANDING:", flight_id_land); 
      }

      if (mensaje.type === "crashed") {
        const flight_id_crash = mensaje.flight_id
        console.log("CRASHED:", flight_id_crash); 
      }

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

};

export default Connect;



// Connection opened


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
