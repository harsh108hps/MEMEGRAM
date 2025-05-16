import React from "react";

const features = [
  { emoji: "😂", title: "Make ’em Laugh", desc: "Create memes that crack people up!" },
  { emoji: "🧠", title: "AI-Powered Captions", desc: "Stuck? Let AI help with clever ideas." },
  { emoji: "📈", title: "Track the Fame", desc: "See how viral your meme goes!" },
  { emoji: "🎭", title: "Templates Galore", desc: "Choose from hilarious meme formats." },
  { emoji: "🏆", title: "Meme of the Day", desc: "Earn bragging rights with top votes." },
  { emoji: "🚀", title: "Drop & Schedule", desc: "Post your best memes at the perfect time!" },
];

const EmojiFeatureSection = () => {
  return (
    <div className="bg-yellow-50 py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">🔥 Why MemeGram is Lit?</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:scale-105 transition transform duration-300 text-center"
          >
            <div className="text-4xl mb-2">{item.emoji}</div>
            <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiFeatureSection;
