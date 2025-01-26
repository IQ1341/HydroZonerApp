import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define a type for the sterilisasi data
interface SterilisasiContextType {
  otomasiSterilisasi: string;
  setOtomasiSterilisasi: (value: string) => void;
  otomasiRefill: string;
  setOtomasiRefill: (value: string) => void;
  durasiSterilisasi: string;
  setDurasiSterilisasi: (value: string) => void;
  durasiUV: string;
  setDurasiUV: (value: string) => void;
  durasiPostUV: string;
  setDurasiPostUV: (value: string) => void;
  sterilisasiAktif: boolean;
  setSterilisasiAktif: (value: boolean) => void;
}

// Create the context
const SterilisasiContext = createContext<SterilisasiContextType | undefined>(undefined);

// Create the provider
export const SterilisasiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [otomasiSterilisasi, setOtomasiSterilisasi] = useState('Tidak');
  const [otomasiRefill, setOtomasiRefill] = useState('Tidak');
  const [durasiSterilisasi, setDurasiSterilisasi] = useState('10');
  const [durasiUV, setDurasiUV] = useState('10');
  const [durasiPostUV, setDurasiPostUV] = useState('10');
  const [sterilisasiAktif, setSterilisasiAktif] = useState(false);

  return (
    <SterilisasiContext.Provider
      value={{
        otomasiSterilisasi,
        setOtomasiSterilisasi,
        otomasiRefill,
        setOtomasiRefill,
        durasiSterilisasi,
        setDurasiSterilisasi,
        durasiUV,
        setDurasiUV,
        durasiPostUV,
        setDurasiPostUV,
        sterilisasiAktif,
        setSterilisasiAktif,
      }}
    >
      {children}
    </SterilisasiContext.Provider>
  );
};

// Custom hook to use the context
export const useSterilisasiContext = () => {
  const context = useContext(SterilisasiContext);
  if (!context) {
    throw new Error('useSterilisasiContext must be used within a SterilisasiProvider');
  }
  return context;
};
