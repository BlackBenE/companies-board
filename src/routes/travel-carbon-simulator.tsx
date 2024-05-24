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

const carbonRates: Transport = {
  "Voiture thermique": 218,
  "Voiture électrique": 103,
  "Train longue distance": 27,
  "Train local": 10,
  Avion: 259,
  Marcher: 0,
  Vélo: 0,
  "Vélo électrique": 11,
};

function TravelCarbonSimulator() {
  const [trips, setTrips] = useState<number>(0);
  const [transport, setTransport] = useState<{
    current: Transport;
    new: Transport;
  }>({
    current: {
      "Voiture thermique": 0,
      "Voiture électrique": 0,
      "Train longue distance": 0,
      "Train local": 0,
      Avion: 0,
      Marcher: 0,
      Vélo: 0,
      "Vélo électrique": 0,
    },
    new: {
      "Voiture thermique": 0,
      "Voiture électrique": 0,
      "Train longue distance": 0,
      "Train local": 0,
      Avion: 0,
      Marcher: 0,
      Vélo: 0,
      "Vélo électrique": 0,
    },
  });
  const [carbon, setCarbon] = useState<{ current: number; new: number }>({
    current: 0,
    new: 0,
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

  const handleTransportChange = (
    type: keyof Transport,
    distance: number,
    mode: "current" | "new"
  ) => {
    setTransport((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], [type]: distance },
    }));
  };

  const handleValidate = (mode: "current" | "new") => {
    setCarbon((prev) => ({
      ...prev,
      [mode]: calculateCarbon(transport[mode]),
    }));
  };

  const handleReduce = async () => {
    const response = await fetch("http://localhost:3000/reduce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        yearlyCarbonReduction: carbon.new - carbon.current,
      }),
    });
    if (response.ok) {
      setCarbon((prev) => ({ ...prev, current: prev.new }));
      setTransport((prev) => ({ ...prev, current: { ...prev.new } }));
      alert(
        `Vous avez réduit votre empreinte carbone de ${(
          carbon.new - carbon.current
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
      {Object.keys(transport.current).map((type) => (
        <label key={type}>
          {type}:
          <input
            type="number"
            value={transport.current[type as keyof Transport]}
            onChange={(e) =>
              handleTransportChange(
                type as keyof Transport,
                Number(e.target.value),
                "current"
              )
            }
          />
        </label>
      ))}
      <button onClick={() => handleValidate("current")}>Valider</button>

      {carbon.current > 0 && (
        <>
          <h3>
            Émissions annuelles de carbone: {carbon.current.toFixed(2)} kg CO2
          </h3>

          <h3>Réduire mon empreinte</h3>
          {Object.keys(transport.new).map((type) => (
            <label key={type}>
              {type}:
              <input
                type="number"
                value={transport.new[type as keyof Transport]}
                onChange={(e) =>
                  handleTransportChange(
                    type as keyof Transport,
                    Number(e.target.value),
                    "new"
                  )
                }
              />
            </label>
          ))}
          <button onClick={() => handleValidate("new")}>Valider</button>
          <h3>
            Émissions annuelles de carbone après réduction:{" "}
            {carbon.new.toFixed(2)} kg CO2
          </h3>
          {carbon.new < carbon.current && (
            <button onClick={handleReduce}>Je choisis ceci !</button>
          )}
        </>
      )}
    </div>
  );
}

export default TravelCarbonSimulator;
