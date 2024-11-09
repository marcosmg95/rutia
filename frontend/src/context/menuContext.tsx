'use client';

import { createContext, useContext, useState } from "react";
import { DadesEntrada } from "./domain";

interface MenuContextType {
  data: DadesEntrada
  setData: (d: DadesEntrada) => void
  step: number
  nextStep: () => void
  prevStep: () => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [data, setData] = useState<DadesEntrada>({ dia: '', ciutat: '', tipus: [] });
  const [step, setStep] = useState<number>(0);

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  return (
    <MenuContext.Provider value={{ data, setData, step, nextStep, prevStep }}>
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