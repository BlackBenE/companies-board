import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import "../styles/travel-carbon-simulator.css";

export const Route = createFileRoute("/travel-carbon-simulator")({
  component: TravelCarbonSimulator,
});

interface Transport {
  "Voiture thermique": number;
  "Voiture électrique": number;
  "Train longue distance": number;
  "Train local": number;
  Avion: number;
  Marcher: number;
  Vélo: number;
  "Vélo électrique": number;
}

function TravelCarbonSimulator() {
  const [trips, setTrips] = useState<number>(0);
  const [currentTransport, setCurrentTransport] = useState<Transport>({
    "Voiture thermique": 0,
    "Voiture électrique": 0,
    "Train longue distance": 0,
    "Train local": 0,
    Avion: 0,
    Marcher: 0,
    Vélo: 0,
    "Vélo électrique": 0,
  });
  const [newTransport, setNewTransport] = useState<Transport>({
    ...currentTransport,
  });
  const [currentCarbon, setCurrentCarbon] = useState<number>(0);
  const [newCarbon, setNewCarbon] = useState<number>(0);
  const [carbonRates, setCarbonRates] = useState<Transport>({
    "Voiture thermique": 218,
    "Voiture électrique": 103,
    "Train longue distance": 27,
    "Train local": 10,
    Avion: 259,
    Marcher: 0,
    Vélo: 0,
    "Vélo électrique": 11,
  });

  const calculateCarbon = (transport: Transport): number => {
    let total = 0;
    for (const [type, distance] of Object.entries(transport)) {
      total += distance * carbonRates[type as keyof Transport];
    }
    return (total * trips) / 1000;
  };

  const handleTripsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrips(Number(e.target.value));
  };

  const handleCurrentTransportChange = (
    type: keyof Transport,
    distance: number
  ) => {
    setCurrentTransport({ ...currentTransport, [type]: distance });
    setCurrentCarbon(calculateCarbon(currentTransport));
  };

  const handleNewTransportChange = (
    type: keyof Transport,
    distance: number
  ) => {
    setNewTransport({ ...newTransport, [type]: distance });
    setNewCarbon(calculateCarbon(newTransport));
  };

  const handleReduce = async () => {
    const response = await fetch("http://localhost:3000/reduce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        yearlyCarbonReduction: newCarbon - currentCarbon,
      }),
    });
    if (response.ok) {
      setCurrentCarbon(newCarbon);
      setCurrentTransport(newTransport);
      alert(
        `Vous avez réduit votre empreinte carbone de ${(
          newCarbon - currentCarbon
        ).toFixed(2)} kg/an, félicitations !`
      );
    } else {
      console.error("Erreur lors de l'envoi des données");
    }
  };

  return (
    <div className="travel-carbon-simulator">
      <h2>Simulateur de carbone de voyage</h2>

      <label>
        Nombre de voyages par an:
        <input type="number" value={trips} onChange={handleTripsChange} />
      </label>

      <h3>Transport actuel</h3>
      {Object.keys(currentTransport).map((type) => (
        <label key={type}>
          {type}:
          <input
            type="number"
            value={currentTransport[type as keyof Transport]}
            onChange={(e) =>
              handleCurrentTransportChange(
                type as keyof Transport,
                Number(e.target.value)
              )
            }
          />
          km
        </label>
      ))}

      <button
        onClick={() => setCurrentCarbon(calculateCarbon(currentTransport))}
      >
        Valider
      </button>

      <h3>Émissions annuelles de carbone: {currentCarbon.toFixed(2)} kg CO2</h3>

      <h3>Réduire mon empreinte</h3>
      {Object.keys(newTransport).map((type) => (
        <label key={type}>
          {type}:
          <input
            type="number"
            value={newTransport[type as keyof Transport]}
            onChange={(e) =>
              handleNewTransportChange(
                type as keyof Transport,
                Number(e.target.value)
              )
            }
          />
          km
        </label>
      ))}

      <button onClick={() => setNewCarbon(calculateCarbon(newTransport))}>
        Valider
      </button>

      <h3>
        Émissions annuelles de carbone après réduction: {newCarbon.toFixed(2)}{" "}
        kg CO2
      </h3>

      {newCarbon < currentCarbon && (
        <button onClick={handleReduce}>Je choisis ceci !</button>
      )}
    </div>
  );
}

export default TravelCarbonSimulator;
