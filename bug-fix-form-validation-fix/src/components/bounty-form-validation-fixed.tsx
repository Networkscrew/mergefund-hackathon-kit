"use client";

import React, { useState } from "react";

interface FormData {
  title: string;
  reward: string;
  difficulty: "Easy" | "Medium" | "Hard";
  progress: string;
}

interface FormErrors {
  title?: string;
  reward?: string;
  progress?: string;
}

interface CreateBountyFormProps {
  onSubmit: (bounty: Omit<{ id: string; title: string; reward: number; difficulty: string; progress: number }, "id">) => void;
  onCancel: () => void;
}

export default function BountyFormValidationFixed({ onSubmit, onCancel }: CreateBountyFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    reward: "",
    difficulty: "Medium",
    progress: "0",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormErrors, boolean>>({
    title: false,
    reward: false,
    progress: false,
  });

  // 🔥 FIX: Comprehensive validation function
  const validateField = (name: keyof FormErrors, value: string): string | undefined => {
    switch (name) {
      case "title":
        // Title cannot be empty or just whitespace
        if (!value.trim()) {
          return "Title is required";
        }
        // Title minimum length
        if (value.trim().length < 3) {
          return "Title must be at least 3 characters";
        }
        // Title maximum length
        if (value.trim().length > 100) {
          return "Title must be less than 100 characters";
        }
        return undefined;

      case "reward":
        // Reward cannot be empty
        if (!value.trim()) {
          return "Reward amount is required";
        }
        // Must be a valid number
        const rewardNum = parseFloat(value);
        if (isNaN(rewardNum)) {
          return "Reward must be a valid number";
        }
        // 🔥 FIX: Cannot be negative or zero
        if (rewardNum <= 0) {
          return "Reward must be greater than 0";
        }
        // Maximum reward limit
        if (rewardNum > 1000000) {
          return "Reward cannot exceed $1,000,000";
        }
        return undefined;

      case "progress":
        // Progress cannot be empty
        if (!value.trim()) {
          return "Progress is required";
        }
        // Must be a valid number
        const progressNum = parseInt(value);
        if (isNaN(progressNum)) {
          return "Progress must be a valid number";
        }
        // 🔥 FIX: Cannot be negative
        if (progressNum < 0) {
          return "Progress cannot be negative";
        }
        // Cannot exceed 100
        if (progressNum > 100) {
          return "Progress cannot exceed 100%";
        }
        return undefined;

      default:
        return undefined;
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof FormErrors;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name as keyof FormErrors]) {
      const error = validateField(name as keyof FormErrors, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on blur
    const error = validateField(name as keyof FormErrors, formData[name as keyof FormErrors]);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      reward: true,
      progress: true,
    });

    // Validate all fields
    if (!validateForm()) {
      return;
    }

    // Submit data
    onSubmit({
      title: formData.title.trim(),
      reward: parseFloat(formData.reward),
      difficulty: formData.difficulty,
      progress: parseInt(formData.progress),
    });
  };

  const getFieldClass = (fieldName: keyof FormErrors): string => {
    const baseClass = "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white";

    if (errors[fieldName]) {
      return `${baseClass} border-red-500`;
    }

    if (touched[fieldName] && !errors[fieldName]) {
      return `${baseClass} border-green-500`;
    }

    return `${baseClass} border-gray-300 dark:border-gray-600`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Bounty</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClass("title")}
            placeholder="Enter bounty title (min 3 characters)"
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.title}
            </p>
          )}
          {touched.title && !errors.title && (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">✓ Title looks good</p>
          )}
        </div>

        {/* Reward */}
        <div>
          <label htmlFor="reward" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reward Amount (USD) *
          </label>
          <input
            type="number"
            id="reward"
            name="reward"
            value={formData.reward}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            step="0.01"
            className={getFieldClass("reward")}
            placeholder="Enter reward amount (must be greater than 0)"
            aria-invalid={errors.reward ? "true" : "false"}
            aria-describedby={errors.reward ? "reward-error" : undefined}
          />
          {errors.reward && (
            <p id="reward-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.reward}
            </p>
          )}
          {touched.reward && !errors.reward && (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">✓ Valid reward amount</p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Progress */}
        <div>
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Initial Progress (%)
          </label>
          <input
            type="number"
            id="progress"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            max="100"
            className={getFieldClass("progress")}
            placeholder="Enter initial progress (0-100)"
            aria-invalid={errors.progress ? "true" : "false"}
            aria-describedby={errors.progress ? "progress-error" : undefined}
          />
          {errors.progress && (
            <p id="progress-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.progress}
            </p>
          )}
          {touched.progress && !errors.progress && (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">✓ Valid progress value</p>
          )}
        </div>

        {/* Form-Level Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md" role="alert">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              Please fix the following errors before submitting:
            </p>
            <ul className="mt-2 text-sm text-red-700 dark:text-red-400 list-disc list-inside">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className="flex-1 px-4 py-2 text-white font-medium rounded-md transition-colors bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Bounty
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
