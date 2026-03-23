import { useState, useEffect, useCallback } from 'react';
import { 
  getDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment,
  getDepartmentById 
} from '../services/departmentApi';
import toast from 'react-hot-toast';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // --- 1. Fetch All (Read) ---
  const fetchDepts = useCallback(async () => {
    setLoading(true);
    try {
        const result = await getDepartments();
        const finalData = result.data || result; // Agar result.data array hai toh wo lo, warna pura result
        setDepartments(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. Fetch Single (Read Detail) ---
  const fetchDeptById = async (id) => {
    setLoading(true);
    try {
      const data = await getDepartmentById(id);
      setSelectedDepartment(data);
      return data;
    } catch (err) {
      toast.error("Could not fetch department details");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Create ---
  const addDept = async (payload) => {
    setLoading(true);
    try {
      await createDepartment(payload);
      toast.success("Department created successfully!");
      await fetchDepts(); // Refresh list automatically
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || "Error adding department";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 4. Update (The missing link!) ---
  const editDept = async (id, payload) => {
    setLoading(true);
    try {
      await updateDepartment(id, payload);
      toast.success("Department updated successfully");
      await fetchDepts(); // Refresh list to show changes
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || "Update failed";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 5. Delete ---
  const removeDept = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    
    setLoading(true);
    try {
      await deleteDepartment(id);
      toast.success("Department removed");
      await fetchDepts();
      return true;
    } catch (err) {
      toast.error("Delete operation failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Auto-load on mount
  useEffect(() => {
    fetchDepts();
  }, [fetchDepts]);

  return { 
    departments, 
    selectedDepartment,
    loading, 
    addDept, 
    editDept,
    removeDept, 
    fetchDeptById,
    refresh: fetchDepts 
  };
};