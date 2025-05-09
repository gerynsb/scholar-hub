import React from "react";
import { motion } from "framer-motion";

interface FilterSectionProps {
  isActiveDropdownOpen: boolean;
  setIsActiveDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCategoryDropdownOpen: boolean;
  setIsCategoryDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedActiveFilters: string[];
  selectedCategoryFilters: string[];
  handleFilterChange: (filterType: string, value: string) => void;
  resetFilters: () => void;
}

const dropdownVariants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.3 } },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
};

const FilterSection: React.FC<FilterSectionProps> = ({
  isActiveDropdownOpen,
  setIsActiveDropdownOpen,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  selectedActiveFilters,
  selectedCategoryFilters,
  handleFilterChange,
  resetFilters,
}) => {
  return (
    <div
      className="w-full md:w-1/4 p-4 bg-white border border-gray-300 rounded-3xl shadow-lg"
      style={{
        height: "auto",
        minHeight: "300px",
        maxHeight: "450px",
        overflow: "hidden",
      }}
    >
      {/* Header Filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-black font-bold">Filter</h2>
        <button
          className="text-blue-600 font-semibold hover:underline"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>

      {/* Dropdown Masa Aktif */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left text-lg font-medium text-black border-b border-gray-300 pb-2 rounded"
          onClick={() => setIsActiveDropdownOpen(!isActiveDropdownOpen)}
        >
          Masa Aktif
          <span>{isActiveDropdownOpen ? "▲" : "▼"}</span>
        </button>
        <motion.div
          initial="hidden"
          animate={isActiveDropdownOpen ? "visible" : "hidden"}
          variants={dropdownVariants}
          className="overflow-hidden mt-2"
        >
          {["Masih Berlangsung", "Akan Berakhir"].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 text-black"
            >
              <input
                type="checkbox"
                className="form-checkbox rounded-full border-gray-300 text-blue-600 focus:ring focus:ring-blue-300"
                checked={selectedActiveFilters.includes(option)}
                onChange={() => handleFilterChange("active", option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </motion.div>
      </div>

      {/* Dropdown Jenis Beasiswa */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left text-lg font-medium text-black border-b border-gray-300 pb-2 rounded"
          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
        >
          Jenis Beasiswa
          <span>{isCategoryDropdownOpen ? "▲" : "▼"}</span>
        </button>
        <motion.div
          initial="hidden"
          animate={isCategoryDropdownOpen ? "visible" : "hidden"}
          variants={dropdownVariants}
          className="overflow-hidden mt-2"
        >
          {["Akademik", "Non Akademik", "Bantuan", "Penelitian"].map(
            (option) => (
              <label
                key={option}
                className="flex items-center space-x-2 text-black"
              >
                <input
                  type="checkbox"
                  className="form-checkbox rounded-full border-gray-300 text-blue-600 focus:ring focus:ring-blue-300"
                  checked={selectedCategoryFilters.includes(option)}
                  onChange={() => handleFilterChange("category", option)}
                />
                <span>{option}</span>
              </label>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FilterSection;
