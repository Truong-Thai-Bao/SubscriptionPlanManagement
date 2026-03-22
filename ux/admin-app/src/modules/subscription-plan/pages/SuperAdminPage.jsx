import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next"; // <-- Added i18n hook
import PlanTable from "../../../components/admin/PlanTable/PlanTable.jsx";
import PlanDrawer from "../../../components/admin/PlanDrawer/PlanDrawer.jsx";
import planApiService from "../../../services/planService.js";
import "./SuperAdminPage.css";

const SuperAdminPage = () => {
  const { t } = useTranslation(); // Initialize translation function

  const [plans, setPlans] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  /**
   * Fetch all subscription plans from the backend.
   * Handles various standard API response formats.
   */
  const fetchPlans = async () => {
    try {
      const data = await planApiService.getAllPlans();

      if (data && data.success && Array.isArray(data.data)) {
        setPlans(data.data);
      } else if (Array.isArray(data)) {
        setPlans(data);
      } else if (data && Array.isArray(data.data)) {
        setPlans(data.data);
      }
    } catch (error) {
      toast.error(t("plan.error.fetch_failed"));
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  /**
   * Open drawer to create a new plan.
   */
  const handleAddNew = () => {
    setEditingPlan(null);
    setIsDrawerOpen(true);
  };

  /**
   * Open drawer to edit an existing plan.
   * @param {Object} plan - The plan data to edit.
   */
  const handleEdit = (plan) => {
    console.log("log:", plan);
    setEditingPlan(plan);
    setIsDrawerOpen(true);
  };

  /**
   * Handle permanent deletion of a plan.
   * @param {number|string} id - The plan ID.
   */
  const handleDelete = async (id) => {
    if (!window.confirm(t("plan.confirm.delete"))) return;

    try {
      const data = await planApiService.deletePlan(id);
      if (data.success) {
        toast.success(t("plan.success.delete"));
        fetchPlans(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Fallback to default server error message if response is missing
      toast.error(
        error.response?.data?.message || t("plan.error.server_connection"),
      );
    }
  };

  /**
   * Handle soft deactivation of a plan.
   * @param {number|string} id - The plan ID.
   */
  const handleDeactivate = async (id) => {
    if (!window.confirm(t("plan.confirm.deactivate"))) return;

    try {
      const data = await planApiService.deactivatePlan(id);
      if (data.success) {
        toast.success(t("plan.success.deactivate"));
        fetchPlans(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("plan.error.server_connection"),
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Subscription Plan Management</h1>
        <button onClick={handleAddNew} className="btn-add-plan">
          + Add a new plan
        </button>
      </div>

      <PlanTable
        plans={plans}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeactivate={handleDeactivate}
      />

      <PlanDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRefresh={fetchPlans}
        editData={editingPlan}
      />
    </div>
  );
};

export default SuperAdminPage;
