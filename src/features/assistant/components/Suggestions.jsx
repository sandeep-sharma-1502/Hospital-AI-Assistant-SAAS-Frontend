import React from "react";
import { motion } from "framer-motion";

const suggestions = [
  "Book an appointment",
  "I have fever and headache",
  "Find doctor near me",
];

const Suggestions = ({ onSelect }) => {
  return (
    <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
      {suggestions.map((item, index) => (
        <motion.button
          key={index}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => onSelect(item)}
          className="px-2 text-2xl font-medium text-black py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-sm rounded-full transition-all shadow-sm"
        >
          {item}
        </motion.button>
      ))}
    </div>
  );
};

export default Suggestions;