// features/patients/hooks/usePatients.js

import { useState } from "react";
import { getPatients, createPatient } from "../services/patientApi";

export const usePatients = () => {

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPatients = async () => {

    try {
      setLoading(true);
      const res = await getPatients();
      setPatients(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

  };

  const addPatient = async (data) => {

    const res = await createPatient(data);

    const newPatient = res?.data;

    setPatients(prev => [newPatient, ...prev]);

    return newPatient;

  };

  return {
    patients,
    loading,
    searchPatients,
    addPatient
  };

};