import { useState, useEffect } from "react";

const ColorThemeButton = () => {
  const [theme, setTheme] = useState("light");

  // On mount, load theme from localStorage (if exists)
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
  }, []);

  // Apply theme + save to localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className='flex items-center gap-2 ml-8'>
      <button
        onClick={toggleTheme}
        className={`relative flex items-center w-16 h-9 rounded-full p-1 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800" : "bg-yellow-100"
        }`}>
        <span
          className={`absolute text-lg transition-all duration-300 ${
            theme === "dark"
              ? "opacity-0 -translate-x-4"
              : "opacity-100 translate-x-0"
          }`}>
          🌞
        </span>
        <span
          className={`absolute text-lg transition-all duration-300 ${
            theme === "dark"
              ? "opacity-100 translate-x-8"
              : "opacity-0 translate-x-11"
          }`}>
          🌙
        </span>
      </button>
    </div>
  );
};

export default ColorThemeButton;
