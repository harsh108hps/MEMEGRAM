import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <>
      <footer
        className="bg-gray-900 text-gray-300 pt-20 pb-10"
        style={{
          clipPath:
            "polygon(0 10%, 10% 0, 25% 5%, 40% 0, 55% 10%, 70% 0, 85% 5%, 100% 0, 100% 100%, 0% 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <h2 className="text-2xl font-bold text-pink-500">MEMEGRAM</h2>
            <p className="text-sm mt-2">
              The internet’s playground for memes. Create, laugh, and go viral.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-pink-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-pink-500">
                  Leaderboard
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/create" className="hover:text-pink-500">
                    Create Meme
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link to="/dashboard" className="hover:text-pink-500">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com"
                target="_blank"
                className="hover:text-pink-500"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                className="hover:text-pink-500"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                className="hover:text-pink-500"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} MEMEGRAM. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
