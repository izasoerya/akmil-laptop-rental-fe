import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle: React.FC<{
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}> = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        padding: "10px",
        background: isDarkMode ? "#444" : "#f0f0f0", // Adjusted background color
        border: "none",
        cursor: "pointer",
        color: isDarkMode ? "#fff" : "#333",
        fontSize: "1.5rem",
        borderRadius: "5px", // Added border radius for better aesthetics
      }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default DarkModeToggle;
