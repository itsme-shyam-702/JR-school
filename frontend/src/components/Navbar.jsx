import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        <div className="font-bold text-xl tracking-wide">Jr Technical School</div>
        <ul className="flex flex-wrap gap-4 text-sm sm:text-base">
          <li><Link to="/" className="hover:text-yellow-300 transition">Home</Link></li>
          <li><Link to="/about" className="hover:text-yellow-300 transition">About</Link></li>
          <li><Link to="/admissions" className="hover:text-yellow-300 transition">Admissions</Link></li>
          <li><Link to="/dashboard" className="hover:text-yellow-300 transition">Dashboard</Link></li> {/* ✅ Added */}
          <li><Link to="/events" className="hover:text-yellow-300 transition">Events</Link></li>
          <li><Link to="/gallery" className="hover:text-yellow-300 transition">Gallery</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link></li>
          <li><Link to="/inbox" className="hover:text-yellow-300 transition">Inbox</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
