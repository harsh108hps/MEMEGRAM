import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase-config";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const snapshot = await getDocs(collection(firestore, "memes"));
      const memes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const recentMemes = memes.filter(
        (meme) => meme.createdAt?.seconds * 1000 >= oneWeekAgo
      );

      const userStatsMap = {};

      recentMemes.forEach((meme) => {
        const upvotes = meme.likes || 0;
        const views = meme.views || 0;

        if (!userStatsMap[meme.userId]) {
          userStatsMap[meme.userId] = {
            totalLikes: 0,
            totalViews: 0,
            memes: 0,
            userName: meme.userName || "Anonymous",
          };
        }

        userStatsMap[meme.userId].totalLikes += upvotes;
        userStatsMap[meme.userId].totalViews += views;
        userStatsMap[meme.userId].memes += 1;
      });

      const ranked = Object.entries(userStatsMap)
        .map(([uid, data]) => ({
          uid,
          userName: data.userName,
          totalLikes: data.totalLikes,
          totalViews: data.totalViews,
          memeCount: data.memes,
        }))
        .sort((a, b) => b.totalLikes - a.totalLikes);

      setLeaderboardData(ranked);
    };

    fetchLeaderboard();
  }, []);
  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 mb-8 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🏆 Weekly Leaderboard
      </h2>
      {leaderboardData.length === 0 ? (
        <p className="text-center text-gray-500">
          No data available for this week.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-200 text-blue-800">
                <th className="p-3">Rank</th>
                <th className="p-3">User</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Total Likes</th>
                <th className="p-3">Total Views</th>
                <th className="p-3">Memes Posted</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => {
                // Extract first two characters of username (uppercase)
                const initials = (user.userName || "AN")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr key={user.uid} className="border-b">
                    <td className="p-3 font-semibold">#{index + 1}</td>
                    {/* User cell with circle initials */}
                    <td className="p-3 flex items-center space-x-3">
                      {/* Circle with initials */}
                      <div
                        className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold"
                        title={user.userName} // Tooltip on hover
                      >
                        {initials}
                      </div>
                      {/* Username */}
                      <span>{user.userName}</span>
                    </td>
                    <td className="p-3">{user.uid}</td>
                    <td className="p-3">{user.totalLikes}</td>
                    <td className="p-3">{user.totalViews}</td>
                    <td className="p-3">{user.memeCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
