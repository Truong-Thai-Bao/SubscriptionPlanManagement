// src/components/PlanTable/PlanTable.jsx
import React from "react";
import { useTranslation } from "react-i18next"; // <-- Added i18n hook
import StatusBadge from "../Status/StatusBadge.jsx";
import "../../../styles/common-table.css";

const PlanTable = ({ plans, onEdit, onDelete, onDeactivate }) => {
  const { t } = useTranslation(); // Initialize translation function

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t("plan.table.th_name")}</th>
            <th>{t("plan.table.th_price")}</th>
            <th>{t("plan.table.th_currency")}</th>
            <th>{t("plan.table.th_duration")}</th>
            <th>{t("plan.table.th_status")}</th>
            <th>{t("plan.table.th_actions")}</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              {/* Package Name & Meta Info */}
              <td>
                <strong>{plan.name}</strong> <br />
                <span style={{ fontSize: "0.8rem", color: "#888" }}>
                  v{plan.current_version || "1.0"} |{" "}
                  {plan.user_type?.toUpperCase()}
                </span>
              </td>

              {/* Pricing breakdown */}
              <td>
                {plan.price_monthly} {plan.currency} / <br />
                {plan.price_annual} {plan.currency}
              </td>

              {/* Resource usage limits */}
              <td>
                {plan.max_users} {t("plan.table.unit_users")} <br />
                {plan.max_courses} {t("plan.table.unit_courses")} <br />
                {plan.max_storage} GB <br />
                {plan.ai_tokens} Tokens
              </td>

              {/* Statistics */}
              <td>{plan.subscribers_count || 0}</td>

              {/* Status Indicator */}
              <td>
                <StatusBadge status={plan.status} />
              </td>

              {/* Action Buttons */}
              <td>
                <button
                  onClick={() => onEdit(plan)}
                  className="btn-action btn-edit"
                >
                  {t("plan.table.btn_edit")}
                </button>

                {plan.status === 1 && (
                  <button
                    onClick={() => onDeactivate(plan.id)}
                    className="btn-action btn-warn"
                  >
                    {t("plan.table.btn_deactivate")}
                  </button>
                )}

                <button
                  onClick={() => onDelete(plan.id)}
                  /* Dynamic class based on deletion eligibility */
                  className={`btn-action ${plan.subscribers_count > 0 ? "btn-disabled" : "btn-delete"}`}
                  disabled={plan.subscribers_count > 0}
                  title={
                    plan.subscribers_count > 0
                      ? t("plan.table.tooltip_no_delete")
                      : t("plan.table.tooltip_delete")
                  }
                >
                  {t("plan.table.btn_delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanTable;
