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

      const userLikesMap = {};

      recentMemes.forEach((meme) => {
        const upvotes = meme.likes || 0;
        if (!userLikesMap[meme.userId]) {
          userLikesMap[meme.userId] = {
            totalLikes: 0,
            memes: 0,
            userName: meme.userName || "Anonymous",
          };
        }

        userLikesMap[meme.userId].totalLikes += upvotes;
        userLikesMap[meme.userId].memes += 1;
      });

      const ranked = Object.entries(userLikesMap)
        .map(([uid, data]) => ({
          uid,
          userName: data.userName,
          totalLikes: data.totalLikes,
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
                <th className="p-3">Memes Posted</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => (
                <tr key={user.uid} className="border-b">
                  <td className="p-3 font-semibold">#{index + 1}</td>
                  <td className="p-3">{user.userName}</td>
                  <td className="p-3">{user.uid}</td>
                  <td className="p-3">{user.totalLikes}</td>
                  <td className="p-3">{user.memeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
