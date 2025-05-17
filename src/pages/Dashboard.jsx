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
  const [editingMeme, setEditingMeme] = useState(null);
  const [editForm, setEditForm] = useState({
    suggestedCaption: "",
    tags: [],
    bottomText: "",
    topText: "",
    fontColor: "",
    fontSize: 0,
  });

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

  const handleDelete = async (id) => {
    await deleteDoc(doc(firestore, "memes", id));
    setMyMemes((prev) => prev.filter((meme) => meme.id !== id));
  };

  const getBadges = (meme) => {
    const badges = [];
    const upvotes = meme.likes || 0;
    const downvotes = meme.dislikes || 0;
    const views = meme.views || 0;

    if (upvotes < 10) return [];
    if (upvotes >= 10) badges.push("🏅 10 Likes Club");
    if (views >= 10000) badges.push("🎖 10k Views Club");
    if (upvotes - downvotes >= 50) badges.push("🔥 Viral Post");

    return badges;
  };

  const filteredMemes = myMemes.filter(
    (meme) =>
      (!filterTag || meme.tags?.includes(filterTag)) &&
      (!searchQuery ||
        meme.caption?.toLowerCase().includes(searchQuery.toLowerCase()))
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
  const paginatedMemes = sortedMemes.slice(
    (page - 1) * memesPerPage,
    page * memesPerPage
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-white via-blue-50 to-white rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
        📊 My Meme Dashboard
      </h2>

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

          {leaderboard.length > 0 && (
            <div className="bg-blue-100 border-l-8 border-blue-500 p-5 mb-8 rounded-xl shadow">
              <h3 className="text-2xl font-bold mb-3">🏆 Weekly Leaderboard</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <li key={index}>
                    {entry.uid} - {entry.score} pts
                  </li>
                ))}
              </ol>
            </div>
          )}

          {paginatedMemes.map((meme) => (
            <div
              key={meme.id}
              className="bg-white p-6 rounded-2xl shadow-xl mb-8 hover:shadow-2xl transition-shadow duration-300"
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

                  <div className="flex flex-wrap gap-6 text-gray-700 text-lg font-medium items-center mb-3">
                    <span className="flex items-center gap-1">
                      <span className="text-2xl">👀</span> {meme.views || 0}
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

                  <div className="mt-2 flex flex-wrap gap-3">
                    {getBadges(meme).map((badge, i) => {
                      const isTenLikesClub = badge.includes("10 Likes Club");
                      return (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full font-semibold shadow-lg transition-all duration-300 text-sm ${
                            isTenLikesClub
                              ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 border border-yellow-600 scale-105"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {badge}
                        </span>
                      );
                    })}
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
                  </div>
                </div>
              </div>
            </div>
          ))}
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
