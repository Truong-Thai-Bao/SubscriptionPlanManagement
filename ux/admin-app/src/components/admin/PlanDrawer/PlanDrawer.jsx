// src/components/PlanDrawer/PlanDrawer.jsx
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import FeatureCard from "./FeatureCard";
import "../../../styles/common-form.css";
import "./PlanDrawer.css";
import planService from "../../../services/planService.js";
import planConfig from "../../../config/planConfig.json";

const PlanDrawer = ({ isOpen, onClose, onRefresh, editData }) => {
  const { t } = useTranslation(); // Initialize translation function

  const [formData, setFormData] = useState({
    name: "",
    user_type: "b2b",
    currency: "VND",
    price_monthly: 0,
    price_annual: 0,
    discount_percent: 0,
    max_days: 0,
    max_users: 0,
    max_storage: 0,
    max_courses: 0,
    ai_tokens: 0,
    status: 1,
  });
  const [features, setFeatures] = useState([]);

  /**
   * Effect: Initialize form data based on whether it's edit mode or create mode
   */
  useEffect(() => {
    if (editData) {
      let calculatedDiscount = 0;
      if (editData.price_monthly > 0 && editData.price_annual > 0) {
        calculatedDiscount =
          100 - (editData.price_annual / (editData.price_monthly * 12)) * 100;
      }
      setFormData({
        ...editData,
        discount_percent:
          calculatedDiscount > 0 ? Math.round(calculatedDiscount) : 0,
        status: editData.status !== undefined ? editData.status : 1,
      });

      let incomingFeature = editData.features_json || editData.features;
      // Nếu dữ liệu trả về từ server là string (chuỗi JSON), ta cần parse nó ra mảng
      if (typeof incomingFeature === "string") {
        try {
          incomingFeature = JSON.parse(incomingFeature);
        } catch (error) {
          incomingFeature = [];
        }
      }
      const feature = Array.isArray(incomingFeature)
        ? incomingFeature.map((f) => ({
            name: f.feature_name || f.name,
            feature_key: f.feature_key,
            value_type: f.value_type,
            description: f.description,
            feature_value: f.feature_value,
          }))
        : [];
      setFeatures(feature);
    } else {
      setFormData({
        name: "",
        user_type: "b2b",
        currency: "VND",
        price_monthly: 0,
        price_annual: 0,
        discount_percent: 0,
        max_days: 0,
        max_users: 0,
        max_storage: 0,
        max_courses: 0,
        ai_tokens: 0,
        status: 1,
      });
      setFeatures([]);
    }
  }, [editData, isOpen]);

  /**
   * Handle generic input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  /**
   * Handle pricing and discount calculations automatically
   */
  const handlePricingChange = (e) => {
    const { name, value } = e.target;

    // Prevent user from typing negative numbers
    if (parseFloat(value) < 0) {
      toast.error(t("plan.validation.price"));
      return;
    }

    const numValue = parseFloat(value) || 0;

    setFormData((prev) => {
      let newData = { ...prev, [name]: value };

      if (name === "price_monthly") {
        const annual = numValue * 12 * (1 - prev.discount_percent / 100);
        newData.price_annual = annual > 0 ? annual.toFixed(2) : 0;
      } else if (name === "discount_percent") {
        const annual = prev.price_monthly * 12 * (1 - numValue / 100);
        newData.price_annual = annual > 0 ? annual.toFixed(2) : 0;
      } else if (name === "price_annual" && prev.price_monthly > 0) {
        const discount = 100 - (numValue / (prev.price_monthly * 12)) * 100;
        newData.discount_percent = discount > 0 ? Math.round(discount) : 0;
      }
      return newData;
    });
  };

  /**
   * Handle modifications inside a specific Feature Card
   */
  const handleFeatureChange = (index, field, newValue) => {
    const newFeatures = [...features];
    newFeatures[index][field] = newValue;
    if (field === "value_type") {
      newFeatures[index].feature_value = newValue === "boolean" ? "true" : "";
    }
    setFeatures(newFeatures);
  };

  /**
   * Append a new blank Feature Card
   */
  const addFeature = () => {
    setFeatures([
      ...features,
      {
        name: "",
        feature_key: "",
        description: "",
        value_type: "boolean",
        feature_value: "true",
      },
    ]);
  };

  /**
   * Clear placeholder zero on focus
   */
  const handleFocus = (e) => {
    const { name, value } = e.target;
    if (value === 0 || value === "0") {
      setFormData((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Restore placeholder zero if left empty on blur
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === "") setFormData((prev) => ({ ...prev, [name]: "0" }));
  };

  /**
   * Remove a specific Feature Card by index
   */
  const removeFeature = (index) =>
    setFeatures(features.filter((_, i) => i !== index));

  /**
   * Submit form payload to the backend service
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanFeatures = features.filter(
        //Filter features that not missing Name
        (f) => f.name && f.name.trim() !== "",
      );

      const feats = cleanFeatures.map((f) => ({
        ...f,
        //assign key using GUID
        feature_key: crypto.randomUUID(),
      }));
      const payload = {
        ...formData,
        price_monthly: parseFloat(formData.price_monthly),
        price_annual: parseFloat(formData.price_annual),
        max_days: parseInt(formData.max_days) || 0,
        max_users: parseInt(formData.max_users) || 0,
        max_courses: parseInt(formData.max_courses) || 0,
        max_storage: parseInt(formData.max_storage) || 0,
        ai_tokens: parseInt(formData.ai_tokens) || 0,
        status: Number(formData.status),
        features_json: feats,
      };

      let data;
      // When updating existing data
      if (editData) {
        data = await planService.updatePlan(editData.id, payload);
      }
      // When creating new data
      else {
        data = await planService.createPlan(payload);
      }

      if (data.success) {
        toast.success(
          editData ? t("plan.success.update") : t("plan.success.create"),
        );
        onRefresh();
        onClose();
      } else {
        toast.error(t("plan.error.prefix") + data.message);
      }
    } catch (error) {
      const backendMsg = error.response?.data?.message;

      let finalErrorMsg = t("plan.error.server_connection");
      if (backendMsg) {
        const cleanMsg = backendMsg
          .replace(/^Validation error:\s*/i, "")
          .trim();

        finalErrorMsg = t(cleanMsg);
      }
      toast.error(finalErrorMsg);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-[10px] backdrop-blur-sm">
          {/* Overlay click area */}
          <div className="absolute inset-0" onClick={onClose}></div>

          {/* Modal Container */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-20px)] flex flex-col overflow-hidden relative z-10 border border-gray-200 dark:border-gray-800">
            {/* Header - Thêm shrink-0 để header không bị bóp méo khi nội dung quá dài */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 shrink-0">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                {editData
                  ? t("plan.drawer.title_edit")
                  : t("plan.drawer.title_create")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Content Body - Thêm min-h-0 để flexbox cho phép scroll khi nội dung vượt quá max-h */}
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
                {/* SECTION 1: General */}
                <div className="form-section">
                  <h4 className="section-title">
                    {t("plan.drawer.section_general")}
                  </h4>
                  <div className="form-row">
                    <div className="form-col" style={{ flex: 2 }}>
                      <label className="form-label">
                        {t("plan.drawer.labels.name")}
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("plan.drawer.placeholders.name")}
                        required
                      />
                    </div>
                    <div className="form-col">
                      <label className="form-label">
                        {t("plan.drawer.labels.user_type")}
                      </label>
                      <select
                        className="form-input"
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                      >
                        {planConfig.userTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status === 1}
                      onChange={handleChange}
                    />
                    {t("plan.drawer.is_active")}
                  </label>
                </div>

                {/* SECTION 2: Pricing */}
                <div className="form-section">
                  <h4 className="section-title">
                    {t("plan.drawer.section_pricing")}
                  </h4>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">
                        {t("plan.drawer.labels.currency")}
                      </label>
                      <select
                        className="form-input"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        {planConfig.currencies.map((cur) => (
                          <option key={cur.value} value={cur.value}>
                            {cur.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">
                        {t("plan.drawer.labels.monthly_price")}
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="price_monthly"
                        value={formData.price_monthly}
                        onChange={handlePricingChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                    <div className="form-col">
                      <label className="form-label">
                        {t("plan.drawer.labels.annual_discount")}
                      </label>
                      <input
                        className="form-input form-input-disabled"
                        type="number"
                        name="discount_percent"
                        value={formData.discount_percent}
                        onChange={handlePricingChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                    <div className="form-col">
                      <label className="form-label">
                        {t("plan.drawer.labels.annual_price")}
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="price_annual"
                        value={formData.price_annual}
                        onChange={handlePricingChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Policy */}
                <div className="form-section">
                  <h4 className="section-title">
                    {t("plan.drawer.section_policy")}
                  </h4>
                  <div className="form-row" style={{ flexWrap: "wrap" }}>
                    <div className="form-col" style={{ minWidth: "30%" }}>
                      <label className="form-label">
                        {t("plan.drawer.labels.max_days")}
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="max_days"
                        value={formData.max_days}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        placeholder={t("plan.drawer.placeholders.max_days")}
                      />
                    </div>
                    <div className="form-col" style={{ minWidth: "30%" }}>
                      <label className="form-label">
                        {t("plan.drawer.labels.max_users")}
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="max_users"
                        value={formData.max_users}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                    <div className="form-col" style={{ minWidth: "30%" }}>
                      <label className="form-label">
                        {t("plan.drawer.labels.max_courses")}
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="max_courses"
                        value={formData.max_courses}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                    <div className="form-col" style={{ minWidth: "45%" }}>
                      <label className="form-label">
                        {t("plan.drawer.labels.max_storage")}
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="max_storage"
                        value={formData.max_storage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                    <div className="form-col" style={{ minWidth: "45%" }}>
                      <label className="form-label">
                        {t("plan.drawer.labels.ai_tokens")}
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="ai_tokens"
                        value={formData.ai_tokens}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Extended Features */}
                <div className="form-section">
                  <h4 className="section-title">
                    {t("plan.drawer.section_features")}
                  </h4>

                  {features.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      feature={feature}
                      index={index}
                      onChange={handleFeatureChange}
                      onRemove={removeFeature}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={addFeature}
                    className="btn-add-feature"
                  >
                    {t("plan.drawer.btn_add_feature")}
                  </button>
                </div>

                <button type="submit" className="btn-save mt-4">
                  {t("plan.drawer.btn_save")}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanDrawer;
