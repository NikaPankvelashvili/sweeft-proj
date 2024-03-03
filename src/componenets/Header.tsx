import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-[#8E7AB5] h-20">
      <nav className="flex items-center justify-center h-full px-8 font-serif">
        <div>
          <NavLink to="/" className={`text-white text-lg mr-8`}>
            Home
          </NavLink>
          <NavLink to="/history" className="text-white text-lg">
            History
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
