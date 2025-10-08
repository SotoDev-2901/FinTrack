import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu, RxCross2, RxExit } from "react-icons/rx";

export const NavItem = ({ to, label, onClick }: { to: string; label: string; onClick: () => void; }) => (
  <NavLink to={to}
    className={({ isActive }) =>
      `text-white px-4 py-2 hover:text-secondary duration-300 ease-in hover:scale-105 ${
        isActive ? "border-b-2 border-secondary" : ""
      }`
    }
    onClick={() => onClick()}
  >
    {label}
  </NavLink>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-background shadow relative">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <NavLink to="/" className="text-xl font-semibold text-white">
          <img
            src="src/assets/Logo.png"
            alt="Logo FinTrack"
            className="w-12 h-12 rounded-full bg-white/5 ring-1 ring-white/10 transform transition-transform duration-200 hover:scale-110 inline-block mr-2"
          />
          FinTrack
        </NavLink>
      </div>

      {/* Botón hamburguesa (visible solo en móvil) */}
      <button
        className="text-white text-2xl md:hidden focus:outline-none"
        onClick={toggleMenu}
      >
        {isOpen ? <RxCross2 /> : <RxHamburgerMenu />}
      </button>

      {/* Links de navegación */}
      <div
        className={`flex flex-col md:flex-row md:items-center md:space-x-12 absolute md:static bg-background md:bg-transparent left-0 w-full md:w-auto transition-all duration-300 ease-in-out ${
          isOpen
            ? "top-16 opacity-100"
            : "top-[-400px] opacity-0 md:opacity-100"
        }`}
      >
        <NavItem to="/" label="Inicio" onClick={() => setIsOpen(false)} />
        <NavItem
          to="/transactions"
          label="Transacciones"
          onClick={() => setIsOpen(false)}
        />
        <NavItem
          to="/goals"
          label="Objetivos"
          onClick={() => setIsOpen(false)}
        />

        {/* Botón de salir en móvil */}
        <NavLink
          to="#"
          className="text-white px-4 py-2 hover:text-secondary duration-300 ease-in flex items-center space-x-2 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <RxExit className="text-secondary text-xl" />
          <span>Salir</span>
        </NavLink>
      </div>

      {/* Icono de salida (solo desktop) */}
      <div className="hidden md:flex">
        <NavLink to="#">
          <RxExit className="text-secondary text-xl transform transition-transform duration-200 hover:scale-110" />
        </NavLink>
      </div>
    </nav>
  );
};
