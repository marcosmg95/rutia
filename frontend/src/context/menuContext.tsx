'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { Coordenades, DadesEntrada, Marcador, ResultatAPI } from "./domain";

interface MenuContextType {
  data: DadesEntrada
  setData: (d: DadesEntrada) => void
  step: number
  setStep: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  ambits: { [key: string]: string }
  center: Coordenades
  setCenter: (c: Coordenades) => void
  markers: Marcador[]
  setMarkers: (m: Marcador[]) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [center, setCenter] = useState<Coordenades>({ lat: 41.3640153, lng: 2.1571719 });
  const [data, setData] = useState<DadesEntrada>({ dia: '', ciutat: '', context: '', tipus: { art: false, history: false, science: false } });
  const [markers, setMarkers] = useState<Marcador[]>([]);
  const [step, setStep] = useState<number>(0);

  const ambits: { [key: string]: string } = {
    art: "art",
    science: "ciència",
    history: "historia",
  }

  const nextStep = () => {
    if (step < 2)
      setStep(step + 1);
  }

  const prevStep = () => {
    if (step > 0)
      setStep(step - 1);
  }

  const getMarkers = async () => {
    const fields = Object.keys(data.tipus).map((key) => `${key}=${data.tipus[key] ? '1' : '0'}`).join('&')
    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}field?${fields}&latitude=${data.localitzacio?.lat}&longitude=${data.localitzacio?.lng}`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong on API server!");
      }
    }).then((response) => {
      // console.debug('debug', response);

      const marcadors: Marcador[] = response.map((r: ResultatAPI) => {
        return {
          nom: r.title,
          localitzacio: {
            lat: r.location?.latitude,
            lng: r.location?.longitude,
          }
        }
      })
      setMarkers(marcadors);
    }).catch((error) => {
      console.error('error', error);
    });
  };

  useEffect(() => {
    if (data.localitzacio) {
      setCenter(data.localitzacio);
    }
  }, [data.localitzacio])

  useEffect(() => {
    if (step > 0) {
      getMarkers();
    }

  }, [center, ambits, step])




  return (
    <MenuContext.Provider value={{ data, setData, step, setStep, nextStep, prevStep, ambits, center, setCenter, markers, setMarkers }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};