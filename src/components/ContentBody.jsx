import { Link } from "react-router-dom";
import { Sparkles, Flame, Laugh, Trophy } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import RegisterModal from "./RegisterModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MemeOfTheDay from "./MemeOfTheDay";

const ContentBody = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Modal visibility state

  const handleSignUp = () => {
    if (user) {
      toast.info("You are already a Premium user.");
    } else {
      setShowRegisterModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
  };
  const handleStartCreating = () => {
    if (user) {
      navigate("/create");
    } else {
      toast.warning("Please log in to create a meme.");
    }
  };
  return (
    <main className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-pink-100 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600">
          <span className="loop-typewriter">Create. Laugh. Go Viral.</span>
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          The Internet’s Playground for Memes — powered by creativity and
          community.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleStartCreating}
            className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700"
          >
            Start Creating
          </button>
          <Link
            to="/feed"
            className="border border-pink-600 text-pink-600 px-6 py-3 rounded-full hover:bg-pink-50"
          >
            Explore Memes
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="flex items-start gap-4">
          <Sparkles size={32} className="text-pink-500" />
          <div>
            <h3 className="text-xl font-semibold">AI Meme Caption Generator</h3>
            <p className="text-sm text-gray-600">
              Get instant funny caption ideas for your memes using our AI tools.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Flame size={32} className="text-pink-500" />
          <div>
            <h3 className="text-xl font-semibold">Trending Memes & Tags</h3>
            <p className="text-sm text-gray-600">
              Explore what's hot in the meme world and follow trending tags.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Laugh size={32} className="text-pink-500" />
          <div>
            <h3 className="text-xl font-semibold">Community Voting</h3>
            <p className="text-sm text-gray-600">
              Upvote, comment, and laugh together. Let the best memes rise!
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Trophy size={32} className="text-pink-500" />
          <div>
            <h3 className="text-xl font-semibold">Leaderboards & Badges</h3>
            <p className="text-sm text-gray-600">
              Compete for top spots and unlock achievements with every viral
              post.
            </p>
          </div>
        </div>
      </section>
      <MemeOfTheDay />

      {/* Call to Action */}
      <section className="bg-pink-600 text-white py-12 text-center">
        <h2 className="text-2xl font-bold">Ready to Become a Meme Legend?</h2>
        <p className="mt-2">Join MEMEGRAM and let your creativity go viral.</p>

        {/* Marquee with effects */}
        <div className="overflow-hidden bg-yellow-200 py-2 mt-4">
          <div className="animate-marquee text-red-600 font-bold tracking-tight">
            🚨 50% OFF Premium Plans 💥 | 🎁 New User Bonus | ⚡ Create Viral
            Memes Instantly | 🚨 50% OFF Premium Plans 💥 | 🎁 New User Bonus |
            ⚡
          </div>
        </div>

        <button
          onClick={handleSignUp}
          className="mt-6 inline-block bg-white text-pink-600 px-6 py-3 rounded-full hover:bg-gray-100"
        >
          Upgrade Plan
        </button>
      </section>

      {showRegisterModal && <RegisterModal onClose={handleCloseModal} />}
    </main>
  );
};

export default ContentBody;
