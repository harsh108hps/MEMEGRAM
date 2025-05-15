import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-12 text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-pink-600">MEMEGRAM</h2>
          <p className="text-sm mt-2">Create. Laugh. Go Viral. The internet’s playground for memes.</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
            <li><Link to="/create" className="hover:text-pink-600">Create Meme</Link></li>
            <li><Link to="/leaderboard" className="hover:text-pink-600">Leaderboard</Link></li>
            <li><Link to="/dashboard" className="hover:text-pink-600">Dashboard</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-pink-600"><Instagram size={20} /></a>
            <a href="#" className="hover:text-pink-600"><Twitter size={20} /></a>
            <a href="#" className="hover:text-pink-600"><Youtube size={20} /></a>
          </div>
        </div>

      </div>

      <div className="text-center text-xs text-gray-500 py-4">
        &copy; {new Date().getFullYear()} MEMEGRAM. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
