import React from "react";
import { motion } from "framer-motion";
const features = [
  {
    emoji: "😂",
    title: "Make ’em Laugh",
    desc: "Create memes that crack people up!",
  },
  {
    emoji: "🧠",
    title: "AI-Powered Captions",
    desc: "Stuck? Let AI help with clever ideas.",
  },
  {
    emoji: "📈",
    title: "Track the Fame",
    desc: "See how viral your meme goes!",
  },
  {
    emoji: "🎭",
    title: "Templates Galore",
    desc: "Choose from hilarious meme formats.",
  },
  {
    emoji: "🏆",
    title: "Meme of the Day",
    desc: "Earn bragging rights with top votes.",
  },
  {
    emoji: "🚀",
    title: "Drop & Schedule",
    desc: "Post your best memes at the perfect time!",
  },
];
const cardVariants = {
  hidden: {
    opacity: 0,
    y: -200, // drop from even higher
    scale: 0.95, // slightly smaller to give a "pop"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 600, // stronger spring
      damping: 15, // more bounce
      mass: 0.4, // lighter for a snappy feel
      duration: 0.6, // faster animation
    },
  },
};

const EmojiFeatureSection = () => {
  return (
    <div className="bg-yellow-50 py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        🔥 Why MemeGram is Lit?
      </h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow text-center glow-on-scroll"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.07 }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="text-4xl mb-2">{item.emoji}</div>
            <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EmojiFeatureSection;
