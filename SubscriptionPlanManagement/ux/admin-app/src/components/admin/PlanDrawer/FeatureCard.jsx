// src/components/PlanDrawer/FeatureCard.jsx
import React from "react";
import { useTranslation } from "react-i18next"; // <-- Added i18n hook
import planConfig from "../../../config/planConfig.json";

const FeatureCard = ({ feature, index, onChange, onRemove }) => {
  const { t } = useTranslation(); // Initialize translation function

  /**
   * Dynamically renders the input field based on the selected value_type
   * Supports: boolean (select), integer (number), and default (text)
   */
  const renderFeatureValueInput = () => {
    switch (feature.value_type) {
      case "boolean":
        return (
          <select
            className="form-input"
            value={feature.feature_value}
            onChange={(e) => onChange(index, "feature_value", e.target.value)}
          >
            {planConfig.featureBooleanValues.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        );
      case "integer":
        return (
          <input
            className="form-input"
            type="number"
            placeholder={t("plan.feature_card.placeholder_value_int")}
            value={feature.feature_value}
            onChange={(e) => onChange(index, "feature_value", e.target.value)}
            required
          />
        );
      default:
        return (
          <input
            className="form-input"
            type="text"
            placeholder={t("plan.feature_card.placeholder_value_text")}
            value={feature.feature_value}
            onChange={(e) => onChange(index, "feature_value", e.target.value)}
            required
          />
        );
    }
  };

  return (
    <div className="feature-card">
      {/* Remove Feature Button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="btn-remove-feature"
        title={t("plan.feature_card.btn_remove")}
      >
        ✖
      </button>

      {/* Main Info: Name and Key */}
      <div className="form-row">
        <div className="form-col">
          <label className="form-label">
            {t("plan.feature_card.label_name")}
          </label>
          <input
            className="form-input"
            type="text"
            placeholder={t("plan.feature_card.placeholder_name")}
            value={feature.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Value Config: Data Type and Dynamic Value Input */}
      <div className="form-row">
        <div className="form-col">
          <label className="form-label">
            {t("plan.feature_card.label_type")}
          </label>
          <select
            className="form-input"
            value={feature.value_type}
            onChange={(e) => onChange(index, "value_type", e.target.value)}
          >
            {planConfig.featureDataTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-col">
          <label className="form-label">
            {t("plan.feature_card.label_value")}
          </label>
          {renderFeatureValueInput()}
        </div>
      </div>

      {/* Supplementary Info: Description */}
      <div>
        <label className="form-label">
          {t("plan.feature_card.label_desc")}
        </label>
        <input
          className="form-input"
          type="text"
          placeholder={t("plan.feature_card.placeholder_desc")}
          value={feature.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
        />
      </div>
    </div>
  );
};

export default FeatureCard;
