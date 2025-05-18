import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore, auth } from "../../firebase-config";
import { useAuth } from "../contexts/AuthContext";
import EditModal from "../components/EditModal";
import { m } from "framer-motion";
import UserAchievements from "../components/UserAchievements";
import MemeStatsChart from "../components/MemeStatsChart";

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
  const memesPerPage = 4;
  const [editingMeme, setEditingMeme] = useState(null);
  const [editForm, setEditForm] = useState({
    suggestedCaption: "",
    tags: [],
    bottomText: "",
    topText: "",
    fontColor: "",
    fontSize: 0,
  });
  const [viewingStatsMeme, setViewingStatsMeme] = useState(null);

  const handleEditClick = (meme) => {
    setEditingMeme(meme);
    setEditForm({
      topText: meme.topText || "",
      bottomText: meme.bottomText || "",
      fontSize: meme.fontSize || 24,
      fontColor: meme.fontColor || "#000000",
      suggestedCaption: meme.suggestedCaption || "",
      tags: meme.tags || [],
    });
  };
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        if (!user) return;
        setLoading(true);
        const querySnapshot = await getDocs(collection(firestore, "memes"));
        const fetchedMemes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllMemes(fetchedMemes);
        const userMemes = fetchedMemes.filter((m) => m.userId === user.uid);
        setMyMemes(userMemes);

        const now = Date.now();
        const past24h = fetchedMemes.filter(
          (m) => now - m.createdAt?.seconds * 1000 < 24 * 60 * 60 * 1000
        );
        const topToday = past24h.reduce(
          (max, meme) =>
            (meme.upvotes || 0) - (meme.downvotes || 0) >
            (max.upvotes || 0) - (max.downvotes || 0)
              ? meme
              : max,
          {}
        );
        setMemeOfTheDay(topToday);

        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const recentMemes = fetchedMemes.filter(
          (m) => m.createdAt?.seconds * 1000 > oneWeekAgo
        );
        const userStats = {};
        recentMemes.forEach((m) => {
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

  // Smooth scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Reset to first page when filters or search query change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterTag]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(firestore, "memes", id));
    setMyMemes((prev) => prev.filter((meme) => meme.id !== id));
  };

  const getBadge = (meme) => {
    const upvotes = meme.likes || 0;
    const downvotes = meme.dislikes || 0;
    const views = meme.views || 0;

    if (upvotes - downvotes >= 50) return "🔥 Viral Post";
    if (views >= 100) return "🎖 100 Views Club";
    if (upvotes >= 10) return "🏅 10 Likes Club";
    return null;
  };

  const filteredMemes = myMemes.filter((meme) => {
    const matchesTag = !filterTag || meme.tags?.includes(filterTag);
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      meme.caption?.toLowerCase().includes(query) ||
      meme.suggestedCaption?.toLowerCase().includes(query) ||
      meme.tags?.some((tag) => tag.toLowerCase().includes(query));

    return matchesTag && matchesSearch;
  });

  const sortedMemes = [...filteredMemes].sort((a, b) => {
    if (sortType === "likes") {
      const scoreA = (a.likes || 0) - (a.dislikes || 0);
      const scoreB = (b.likes || 0) - (b.dislikes || 0);
      return scoreB - scoreA;
    } else {
      return b.createdAt?.seconds - a.createdAt?.seconds;
    }
  });

  const totalPages = Math.ceil(sortedMemes.length / memesPerPage);
  const paginatedMemes = sortedMemes.slice(
    (page - 1) * memesPerPage,
    page * memesPerPage
  );

  if (viewingStatsMeme) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-4 text-black">
          📊 Meme Stats
        </h2>
        <p className="text-lg font-medium mb-2 text-gray-700">
          {viewingStatsMeme.suggestedCaption}
        </p>
        <MemeStatsChart meme={viewingStatsMeme} />
        <button
          onClick={() => setViewingStatsMeme(null)}
          className="mt-6 bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          🔙 Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-white via-blue-50 to-white rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-black">
        📊 My Meme Dashboard
      </h2>
      <UserAchievements memes={myMemes} />
      {loading ? (
        <p className="text-center text-lg font-medium text-gray-600">
          Loading...
        </p>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      ) : (
        <>
          {memeOfTheDay?.id && (
            <div className="bg-yellow-100 border-l-8 border-yellow-500 p-5 mb-8 rounded-xl shadow">
              <h3 className="text-2xl font-bold mb-2">🌟 Meme of the Day</h3>
              <p className="text-lg italic">{memeOfTheDay.suggestedCaption}</p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4 mb-4">
            <select
              className="border rounded p-2 text-sm"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="likes">Sort by Likes</option>
            </select>

            <input
              type="text"
              placeholder="Search by tag or caption..."
              className="border rounded p-2 text-sm flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {paginatedMemes.map((meme) => (
            <div
              key={meme.id}
              className="bg-gray-100 p-6 rounded-2xl shadow-xl mb-8 hover:shadow-2xl transition-shadow duration-300 relative flex-1"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={meme.imageUrl}
                  alt="meme"
                  className="w-full md:w-64 h-auto rounded-xl border border-gray-200 shadow-md"
                />

                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {meme.suggestedCaption}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {meme.tags?.join(" ")} |{" "}
                    {meme.createdAt?.toDate().toLocaleDateString()}
                  </p>
                  <p className="text-wrap truncate">
                    <span className="font-bold">Top Text:</span> {meme.topText}
                  </p>
                  <p className="text-wrap truncate">
                    <span>
                      <span className="font-bold">Bottom Text:</span>{" "}
                      {meme.bottomText}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-6 text-gray-700 text-lg font-medium items-center mb-3">
                    <span className="flex items-center gap-1 relative">
                      <span className="absolute w-4 h-4 rounded-full bg-red-500 opacity-75 animate-ping -top-1 -left-1"></span>
                      <span className="text-2xl z-10">👀</span>{" "}
                      {meme.views || 0}
                    </span>

                    <span className="flex items-center gap-1 text-green-600">
                      <span className="text-2xl">👍</span> {meme.likes || 0}
                    </span>
                    <span className="flex items-center gap-1 text-red-600">
                      <span className="text-2xl">👎</span> {meme.dislikes || 0}
                    </span>
                    <span className="flex items-center gap-1 text-blue-600">
                      <span className="text-2xl">💬</span>{" "}
                      {meme.comments?.length || 0}
                    </span>
                  </div>

                  <div className="absolute right-0 top-0 flex flex-col lg:flex-row gap-2 mt-2 mr-2">
                    {(() => {
                      const badge = getBadge(meme);
                      if (!badge) return null;
                      const isTenLikesClub = badge.includes("10 Likes Club");

                      return (
                        <span
                          className={`px-3 py-1 rounded-full font-semibold shadow-lg transition-all duration-300 text-sm animate-bounce ${
                            isTenLikesClub
                              ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 border border-yellow-600 scale-105"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {badge}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="mt-4 flex gap-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
                      onClick={() => handleEditClick(meme)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
                      onClick={() => handleDelete(meme.id)}
                    >
                      🗑 Delete
                    </button>
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
                      onClick={() => setViewingStatsMeme(meme)}
                    >
                      📈 View Stats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Pagination Controls - only show if there are multiple pages */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {/* Prev Button */}
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded disabled:opacity-50"
              >
                ◀ Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded font-semibold ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
      <EditModal
        editingMeme={editingMeme}
        setEditingMeme={setEditingMeme}
        editForm={editForm}
        setEditForm={setEditForm}
        setMyMemes={setMyMemes}
      />
    </div>
  );
};

export default Dashboard;
