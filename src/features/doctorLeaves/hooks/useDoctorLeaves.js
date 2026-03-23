import { useState } from "react";
import {
  getDoctorLeaves,
  createDoctorLeave,
  deleteDoctorLeave
} from "../services/doctorLeaveApi";
import toast from "react-hot-toast";

export const useDoctorLeaves = () => {

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async (doctorId) => {

    try {

      setLoading(true);

      const data = await getDoctorLeaves(doctorId);

      setLeaves(data.data || data);

    } catch {

      toast.error("Failed to load leaves");

    } finally {

      setLoading(false);

    }

  };

  const addLeave = async (payload, doctorId) => {

    try {

      await createDoctorLeave(payload);

      toast.success("Leave added");

      await fetchLeaves(doctorId);

    } catch {

      toast.error("Failed to add leave");

    }

  };

  const removeLeave = async (id, doctorId) => {

    try {

      await deleteDoctorLeave(id);

      toast.success("Leave removed");

      await fetchLeaves(doctorId);

    } catch {

      toast.error("Failed to delete leave");

    }

  };

  return {
    leaves,
    loading,
    fetchLeaves,
    addLeave,
    removeLeave
  };

};