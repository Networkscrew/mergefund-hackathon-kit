"use client";

import React from "react";

interface FundingProgressProps {
  raised: number;
  goal: number;
  currency?: string;
}

export default function FundingProgressFixed({
  raised,
  goal,
  currency = "$"
}: FundingProgressProps) {
  // 🔥 FIX: Handle edge cases for progress calculation
  const calculateProgress = () => {
    // Guard clause for invalid inputs
    if (goal <= 0) {
      return 0; // Zero or negative goal = 0% progress
    }

    if (raised < 0) {
      return 0; // Negative raised = 0% progress
    }

    // Calculate raw percentage
    const rawPercentage = (raised / goal) * 100;

    // 🔥 FIX: Clamp to 0-100 range
    const clampedPercentage = Math.max(0, Math.min(100, rawPercentage));

    // Round to 1 decimal place
    return Math.round(clampedPercentage * 10) / 10;
  };

  const progress = calculateProgress();

  // Determine color based on progress
  const getColor = () => {
    if (progress >= 100) return "bg-green-600";
    if (progress >= 75) return "bg-blue-600";
    if (progress >= 50) return "bg-yellow-600";
    return "bg-gray-600";
  };

  // Format numbers with commas
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
          <div
            style={{ width: `${progress}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getColor()} transition-all duration-500 ease-out`}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex flex-col">
          <span className="text-gray-600 dark:text-gray-400">Raised</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(raised)}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-gray-600 dark:text-gray-400">Goal</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(goal)}
          </span>
        </div>
      </div>

      {/* Percentage Display */}
      <div className="text-center">
        <span className={`text-lg font-bold ${
          progress >= 100 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
        }`}>
          {progress}%
        </span>
        {progress >= 100 && (
          <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">
            🎉 Goal Reached!
          </span>
        )}
      </div>

      {/* 🔥 FIX: Edge Case Warnings */}
      {goal <= 0 && (
        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            ⚠️ Warning: Goal amount must be greater than 0
          </p>
        </div>
      )}

      {raised < 0 && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-xs text-red-800 dark:text-red-300">
            ⚠️ Warning: Raised amount cannot be negative
          </p>
        </div>
      )}

      {/* Progress Status */}
      {progress < 25 && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          🚀 Just getting started!
        </div>
      )}
      {progress >= 25 && progress < 50 && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          📈 Making progress!
        </div>
      )}
      {progress >= 50 && progress < 75 && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          💪 Over halfway there!
        </div>
      )}
      {progress >= 75 && progress < 100 && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          🎯 Almost there!
        </div>
      )}
    </div>
  );
}
