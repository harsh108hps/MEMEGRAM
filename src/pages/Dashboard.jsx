import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../../firebase-config";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [myMemes, setMyMemes] = useState([]);
  const [allMemes, setAllMemes] = useState([]);
  const [sortType, setSortType] = useState("date");
  const [memeOfTheDay, setMemeOfTheDay] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTag, setFilterTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const memesPerPage = 5;

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        if (!user) return;
        setLoading(true);
        const querySnapshot = await getDocs(collection(firestore, "memes"));
        const fetchedMemes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllMemes(fetchedMemes);
        const userMemes = fetchedMemes.filter(m => m.userId === user.uid);
        setMyMemes(userMemes);

        // Meme of the Day
        const now = Date.now();
        const past24h = fetchedMemes.filter(m =>
          now - m.createdAt?.seconds * 1000 < 24 * 60 * 60 * 1000
        );
        const topToday = past24h.reduce((max, meme) =>
          ((meme.upvotes || 0) - (meme.downvotes || 0)) >
          ((max.upvotes || 0) - (max.downvotes || 0)) ? meme : max, {});
        setMemeOfTheDay(topToday);

        // Weekly Leaderboard
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const recentMemes = fetchedMemes.filter(
          m => m.createdAt?.seconds * 1000 > oneWeekAgo
        );
        const userStats = {};
        recentMemes.forEach(m => {
          const netVotes = (m.upvotes || 0) - (m.downvotes || 0);
          if (!userStats[m.userId]) userStats[m.userId] = { total: 0 };
          userStats[m.userId].total += netVotes;
        });
        const ranked = Object.entries(userStats)
          .map(([uid, stats]) => ({ uid, score: stats.total }))
          .sort((a, b) => b.score - a.score);
        setLeaderboard(ranked);
      } catch (err) {
        setError("Failed to fetch memes.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(firestore, "memes", id));
    setMyMemes(prev => prev.filter(meme => meme.id !== id));
  };

  const getBadges = (meme) => {
  const badges = [];
  const upvotes = meme.upvotes || 0;
  const downvotes = meme.downvotes || 0;
  const views = meme.views || 0;

  if (upvotes < 10) return []; // 👈 Only show badges if upvotes ≥ 10

  if (upvotes >= 10) badges.push("🏅 10 Likes Club");
  if (views >= 10000) badges.push("🎖 10k Views Club");
  if (upvotes - downvotes >= 50) badges.push("🔥 Viral Post");

  return badges;
};

  const filteredMemes = myMemes
    .filter(meme =>
      (!filterTag || meme.tags?.includes(filterTag)) &&
      (!searchQuery || meme.caption?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const sortedMemes = [...filteredMemes].sort((a, b) => {
    if (sortType === "popularity") {
      const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
      const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
      return scoreB - scoreA;
    } else {
      return b.createdAt?.seconds - a.createdAt?.seconds;
    }
  });

  const totalPages = Math.ceil(sortedMemes.length / memesPerPage);
  const paginatedMemes = sortedMemes.slice((page - 1) * memesPerPage, page * memesPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 My Meme Dashboard</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {memeOfTheDay?.id && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
              <h3 className="text-xl font-semibold mb-1">🌟 Meme of the Day</h3>
              <p>{memeOfTheDay.caption}</p>
            </div>
          )}

          {leaderboard.length > 0 && (
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <h3 className="text-xl font-semibold mb-2">🏆 Weekly Leaderboard</h3>
              <ol className="list-decimal list-inside">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <li key={index}>User ID: {entry.uid} — Score: {entry.score}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex flex-wrap gap-4 items-center mb-4">
            <label className="text-sm font-medium">Sort by:</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="date">Newest</option>
              <option value="popularity">Popularity</option>
            </select>

            <input
              type="text"
              placeholder="Search caption..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-2 py-1 rounded"
            />

            <input
              type="text"
              placeholder="Filter by tag..."
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          {paginatedMemes.length === 0 ? (
            <p className="text-center text-gray-500">No memes match the criteria.</p>
          ) : (
            paginatedMemes.map(meme => (
              <div key={meme.id} className="bg-white p-4 rounded shadow mb-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <img src={meme.imageUrl} alt="meme" className="w-full md:w-48 h-auto rounded" />

                  <div className="flex-1">
                    <p className="text-lg font-semibold">{meme.caption}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {meme.tags?.join(" ")} | {meme.createdAt?.toDate().toLocaleDateString()}
                    </p>

                    <div className="flex gap-4 text-sm text-gray-700">
                      <span>👀 {meme.views || 0}</span>
                      <span>👍 {meme.upvotes || 0}</span>
                      <span>👎 {meme.downvotes || 0}</span>
                      <span>💬 {meme.comments?.length || 0}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
  {getBadges(meme).map((badge, i) => (
    <span
      key={i}
      className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold"
    >
      {badge}
    </span>
  ))}
</div>


                    <div className="mt-1 text-sm text-yellow-600">
                      {getBadges(meme).map((badge, i) => (
                        <span key={i} className="mr-2">{badge}</span>
                      ))}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => alert("Edit coming soon...")}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleDelete(meme.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                className="px-3 py-1 bg-gray-300 rounded"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>
              <span className="px-2">Page {page} of {totalPages}</span>
              <button
                className="px-3 py-1 bg-gray-300 rounded"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
