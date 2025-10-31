import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function Navbar() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role || "visitor";

  return (
    <nav className="bg-blue-700 text-white p-4 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Brand Name */}
        <div className="font-bold text-xl tracking-wide">
          Jr Technical School
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-wrap gap-4 text-sm sm:text-base items-center">
          {/* ✅ Public Links */}
          <li>
            <Link to="/" className="hover:text-yellow-300 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-300 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/admissions" className="hover:text-yellow-300 transition">
              Admissions
            </Link>
          </li>
          <li>
            <Link to="/events" className="hover:text-yellow-300 transition">
              Events
            </Link>
          </li>
          <li>
            <Link to="/gallery" className="hover:text-yellow-300 transition">
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-yellow-300 transition">
              Contact
            </Link>
          </li>

          {/* ✅ Admin + Staff Access */}
          <SignedIn>
            {/* Admission Dashboard (Admin + Staff) */}
            {(role === "admin" || role === "staff") && (
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-yellow-300 transition"
                >
                Dashboard
                </Link>
              </li>
            )}

            {/* Inbox (Admin only) */}
            {role === "admin" && (
              <li>
                <Link
                  to="/inbox"
                  className="hover:text-yellow-300 transition"
                >
                  Inbox
                </Link>
              </li>
            )}
          </SignedIn>

          {/* ✅ Auth Buttons */}
          <li>
            <SignedOut>
              <SignInButton>
                <button className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "ml-2",
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
