'use client';

import { createContext, useContext, useState } from "react";
import { Coordenades, DadesEntrada, Marcador, ResultatAPI } from "./domain";

interface MenuContextType {
  data: DadesEntrada
  setData: (d: DadesEntrada) => void
  step: number
  setStep: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  ambits: { [key: string]: string }
  center: { c: Coordenades, pin: boolean }
  setCenter: (c: { c: Coordenades, pin: boolean }) => void
  markers: Marcador[]
  setMarkers: (m: Marcador[]) => void
  firstResults?: ResultatAPI[]
  setFirstResults: (a: ResultatAPI[]) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [center, setCenter] = useState<{ c: Coordenades, pin: boolean }>({ c: { lat: 41.3640153, lng: 2.1571719 }, pin: false });
  const [data, setData] = useState<DadesEntrada>({ dia: '', ciutat: '', context: '', tipus: { art: false, history: false, science: false, events: false } });
  const [markers, setMarkers] = useState<Marcador[]>([]);
  const [step, setStep] = useState<number>(0);
  const [firstResults, setFirstResults] = useState<ResultatAPI[]>();

  const ambits: { [key: string]: string } = {
    art: "art",
    science: "ciència",
    history: "historia",
    events: "esdeveniments"
  }

  const nextStep = () => {
    if (step < 2)
      setStep(step + 1);
  }

  const prevStep = () => {
    if (step > 0)
      setStep(step - 1);
  }

  return (
    <MenuContext.Provider value={{
      data, setData, step, setStep, nextStep, prevStep, ambits, center, setCenter, markers, setMarkers, firstResults, setFirstResults
    }}>
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