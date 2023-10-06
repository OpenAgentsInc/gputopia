import { useState, useEffect } from 'react';

export function getMachineId() {
    if (typeof window === 'undefined') {
        throw new Error('machineid can only be used on the client side.');
    }

    const storedMacId = localStorage.getItem('machine-id');
    if (!storedMacId) {
      const newMacId = generateRandomHex(16);
      localStorage.setItem('machine-id', newMacId);
      return newMacId;
    } else {
      return storedMacId;
    }
}

export function useMachineId() {
  const [macId, setMacId] = useState("");

  useEffect(() => {
    setMacId(getMachineId());
  }, []);

  return macId;
}

export function generateRandomHex(n) {
    const randomValues = crypto.getRandomValues(new Uint8Array(n));
    return Array.from(randomValues).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

