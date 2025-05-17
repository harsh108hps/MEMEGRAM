import React from "react";

const UserAchievements = ({ memes }) => {
  // Aggregate user stats

  const totalLikes = memes.reduce((sum, meme) => sum + (meme.likes || 0), 0);
  const totalViews = memes.reduce((sum, meme) => sum + (meme.views || 0), 0);
  const totalComments = memes.reduce(
    (sum, meme) => sum + (meme.comments?.length || 0),
    0
  );
  const achievements = [];

  if (totalLikes >= 10)
    achievements.push({ icon: "🏅", label: "10 Likes Club" });
  if (totalViews >= 100)
    achievements.push({ icon: "📈", label: "100 Views Club" });
  if (totalComments >= 50)
    achievements.push({ icon: "🔁", label: "50 Comments Club" });

  if (achievements.length === 0) return null;

  return (
    <div className="bg-green-100 border-l-8 border-green-600 p-5 mb-8 rounded-xl shadow flex flex-col gap-2">
      <h3 className="text-2xl font-bold mb-2 text-green-800">
        🎉 Achievements Unlocked
      </h3>
      <div className="flex flex-wrap gap-4">
        {achievements.map((ach, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md text-green-700 font-semibold text-sm border border-green-300"
          >
            <span className="text-xl">{ach.icon}</span> {ach.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAchievements;
