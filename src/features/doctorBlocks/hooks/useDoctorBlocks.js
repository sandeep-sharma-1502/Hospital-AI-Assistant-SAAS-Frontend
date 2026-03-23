import { useState } from "react";
import {
  getDoctorBlocks,
  createDoctorBlock,
  deleteDoctorBlock
} from "../services/doctorBlockApi";
import toast from "react-hot-toast";

export const useDoctorBlocks = () => {

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlocks = async (doctorId) => {

    try {

      setLoading(true);

      const data = await getDoctorBlocks(doctorId);

      setBlocks(data.data || data);

    } catch {

      toast.error("Failed to load blocks");

    } finally {

      setLoading(false);

    }

  };

  const addBlock = async (payload, doctorId) => {

    try {

      await createDoctorBlock(payload);

      toast.success("Block created");

      await fetchBlocks(doctorId);

    } catch {

      toast.error("Failed to create block");

    }

  };

  const removeBlock = async (id, doctorId) => {

    try {

      await deleteDoctorBlock(id);

      toast.success("Block removed");

      await fetchBlocks(doctorId);

    } catch {

      toast.error("Failed to delete block");

    }

  };

  return {
    blocks,
    loading,
    fetchBlocks,
    addBlock,
    removeBlock
  };

};