"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterState {
  difficulty: "all" | "Easy" | "Medium" | "Hard";
  minReward: string;
  tags: string[];
}

interface BountyFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export default function BountyFilterFixed({ onFilterChange, initialFilters }: BountyFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔥 FIX: Initialize filters from URL params on mount
  const [filters, setFilters] = useState<FilterState>(() => {
    const difficulty = (searchParams.get("difficulty") as FilterState["difficulty"]) || "all";
    const minReward = searchParams.get("minReward") || "";
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];

    return {
      difficulty,
      minReward,
      tags,
    };
  });

  // 🔥 FIX: Sync filters to URL whenever they change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.difficulty !== "all") {
      params.set("difficulty", filters.difficulty);
    }

    if (filters.minReward) {
      params.set("minReward", filters.minReward);
    }

    if (filters.tags.length > 0) {
      params.set("tags", filters.tags.join(","));
    }

    // Update URL without triggering navigation (replace state)
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // 🔥 FIX: Notify parent component of filter changes
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleDifficultyChange = (difficulty: FilterState["difficulty"]) => {
    setFilters(prev => ({ ...prev, difficulty }));
  };

  const handleMinRewardChange = (minReward: string) => {
    setFilters(prev => ({ ...prev, minReward }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: "all",
      minReward: "",
      tags: [],
    });
  };

  const availableTags = ["React", "TypeScript", "UI", "Backend", "Frontend", "Database"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Clear All
        </button>
      </div>

      {/* Difficulty Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Difficulty
        </label>
        <div className="flex flex-wrap gap-2">
          {(["all", "Easy", "Medium", "Hard"] as const).map(level => (
            <button
              key={level}
              onClick={() => handleDifficultyChange(level)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.difficulty === level
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {level === "all" ? "All Levels" : level}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Reward Filter */}
      <div>
        <label htmlFor="minReward" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Minimum Reward (USD)
        </label>
        <input
          type="number"
          id="minReward"
          value={filters.minReward}
          onChange={(e) => handleMinRewardChange(e.target.value)}
          min="0"
          step="0.01"
          placeholder="Enter minimum reward"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.tags.includes(tag)
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.difficulty !== "all" || filters.minReward || filters.tags.length > 0) && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.difficulty !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                Difficulty: {filters.difficulty}
              </span>
            )}
            {filters.minReward && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded">
                Min Reward: ${filters.minReward}
              </span>
            )}
            {filters.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded"
              >
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="hover:text-purple-600 dark:hover:text-purple-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 FIX: URL Sync Indicator */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>Filters synced to URL</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Share this URL to keep your filters
        </p>
      </div>
    </div>
  );
}
