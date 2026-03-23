import { useState, useEffect, useCallback } from "react";
import { fetchDoctors } from "../services/doctorApi";
import toast from "react-hot-toast";

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data || []);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to sync doctors";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDoctors();
  }, [refreshDoctors]);

  return { doctors, isLoading, error, refreshDoctors };
}