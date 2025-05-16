import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { firestore } from "../../firebase-config";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { useAuth } from "../contexts/AuthContext";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const Feed = () => {
  const { user } = useAuth();
  const [memes, setMemes] = useState([]);
  const [votes, setVotes] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("New");
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [newComment, setNewComment] = useState("");

  const emojiList = ["🔥", "😂", "🎉", "💥", "🤩", "🥳"];
  const [emojis, setEmojis] = useState([]);

  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  useEffect(() => {
    const fetchMemes = async () => {
      const querySnapshot = await getDocs(collection(firestore, "memes"));
      let memeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const now = new Date();
      //Filter based on selection
      switch (filter) {
        case "Top (24hr)":
          memeList = memeList
            .filter(
              (meme) =>
                meme.createdAt?.toDate() &&
                now - meme.createdAt.toDate() <= 24 * 60 * 60 * 1000
            )
            .sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;
        case "Top (Week)":
          memeList = memeList
            .filter(
              (meme) =>
                meme.createdAt?.toDate() &&
                now - meme.createdAt.toDate() <= 7 * 24 * 60 * 60 * 1000
            )
            .sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;

        case "Top (All Time)":
          memeList = memeList.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;
        case "New":
        default:
          memeList = memeList.sort(
            (a, b) =>
              b.createdAt?.toDate()?.getTime() -
              a.createdAt?.toDate()?.getTime()
          );
      }
      setMemes(memeList);
      setCurrentIndex(0);
    };

    fetchMemes();
  }, [filter]);

  useEffect(() => {
    // Start generating emojis at random intervals
    const interval = setInterval(() => {
      const randomEmoji =
        emojiList[Math.floor(Math.random() * emojiList.length)];
      setEmojis((prev) => [
        ...prev,
        { emoji: randomEmoji, id: Date.now() + Math.random() },
      ]);
    }, 400); // Adds new emoji every 300ms

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  useEffect(() => {
    if (!memes[currentIndex]?.comments?.length) return;

    const interval = setInterval(() => {
      setCurrentCommentIndex(
        (prev) => (prev + 1) % memes[currentIndex].comments.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, memes]);
  useEffect(() => {
    setCurrentCommentIndex(0);
  }, [currentIndex]);
  const handleVote = async (id, type) => {
    if (votes[id]) return;
    const memeRef = doc(firestore, "memes", id);
    try {
      await updateDoc(memeRef, {
        likes: type === "up" ? increment(1) : increment(0),
        dislikes: type === "down" ? increment(1) : increment(0),
      });
      setMemes((prev) =>
        prev.map((meme) =>
          meme.id === id
            ? {
                ...meme,
                likes: type === "up" ? (meme.likes || 0) + 1 : meme.likes || 0,
                dislikes:
                  type === "down"
                    ? (meme.dislikes || 0) + 1
                    : meme.dislikes || 0,
              }
            : meme
        )
      );
      setVotes((prev) => ({ ...prev, [id]: type }));

      if (type === "up") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };
  const currentMeme = memes[currentIndex];
  return (
    <div className="p-4 max-w-4xl mx-auto ">
      {showConfetti && <Confetti width={width} height={height} />}
      <h1 className="text-3xl font-bold mb-6 text-center">🔥 Meme Feed</h1>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
        {["New", "Top (24hr)", "Top (Week)", "Top (All Time)"].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === label
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {currentMeme ? (
        <div
          key={currentMeme.id}
          className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6 mb-6"
        >
          {/* Image + Text Overlay */}
          <div className="relative w-full max-h-[600px]">
            <img
              src={currentMeme.imageUrl}
              alt="meme"
              className="w-full h-auto rounded-md object-contain"
            />
            {/* Top Text */}
            <div
              className="absolute top-2 left-0 w-full font-bold drop-shadow px-2"
              style={{
                color: currentMeme.fontColor,
                fontSize: currentMeme.fontSize
                  ? `${currentMeme.fontSize}px`
                  : "24px",
                textAlign: currentMeme.alignment || "center",
              }}
            >
              {currentMeme.topText}
            </div>
            {/* Bottom Text */}
            <div
              className="absolute bottom-2 left-0 w-full font-bold drop-shadow px-2"
              style={{
                color: currentMeme.fontColor,
                fontSize: currentMeme.fontSize
                  ? `${currentMeme.fontSize}px`
                  : "24px",
                textAlign: currentMeme.alignment || "center",
              }}
            >
              {currentMeme.bottomText}
            </div>
          </div>

          {/* This content is now safely below the image */}
          <div className="mt-4">
            <p className="text-lg font-medium break-words">
              📝 {currentMeme.suggestedCaption}
            </p>
            <div className="text-sm text-gray-500 mb-2 mt-1">
              Tags: {currentMeme.tags?.join(" ")} | Posted by:{" "}
              {currentMeme.userName} |{" "}
              {currentMeme.createdAt?.toDate().toLocaleString()}
            </div>

            <div className="flex gap-4 items-center mb-4">
              <button
                onClick={() => handleVote(currentMeme.id, "up")}
                disabled={votes[currentMeme.id]}
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  votes[currentMeme.id] === "up"
                    ? "bg-green-300"
                    : "bg-gray-100 hover:bg-green-100"
                }`}
              >
                👍 {currentMeme.likes}
              </button>
              <button
                onClick={() => handleVote(currentMeme.id, "down")}
                disabled={votes[currentMeme.id]}
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  votes[currentMeme.id] === "down"
                    ? "bg-red-300"
                    : "bg-gray-100 hover:bg-red-100"
                }`}
              >
                👎 {currentMeme.dislikes}
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">💬 Comments</h3>
              <div className="text-sm bg-gray-100 p-3 rounded h-10 flex items-center justify-center">
                {currentMeme.comments?.length > 0 ? (
                  <div key={currentCommentIndex}>
                    <span className="font-medium">
                      {currentMeme.comments[currentCommentIndex]?.userName}:
                    </span>{" "}
                    {currentMeme.comments[currentCommentIndex]?.text}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
              </div>
            </div>
            {user ? (
              <div className="mt-2 mb-2flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-sm px-1"
                />
                <button
                  onClick={async () => {
                    if (!newComment.trim()) return;

                    const memeRef = doc(firestore, "memes", currentMeme.id);
                    const newCommentObj = {
                      userName: user.displayName || user.email,
                      text: newComment.trim(),
                      timestamp: new Date(),
                    };

                    try {
                      await updateDoc(memeRef, {
                        comments: [
                          ...(currentMeme.comments || []),
                          newCommentObj,
                        ],
                      });

                      setMemes((prev) =>
                        prev.map((meme) =>
                          meme.id === currentMeme.id
                            ? {
                                ...meme,
                                comments: [
                                  ...(meme.comments || []),
                                  newCommentObj,
                                ],
                              }
                            : meme
                        )
                      );
                      setNewComment("");
                    } catch (err) {
                      console.error("Failed to post comment:", err);
                    }
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Post
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Login to post a comment.
              </p>
            )}
            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                <MdOutlineArrowBackIos className="inline-block" />
              </button>
              <button
                onClick={() =>
                  setCurrentIndex((i) => Math.min(memes.length - 1, i + 1))
                }
                disabled={currentIndex === memes.length - 1}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                <MdOutlineArrowForwardIos className="inline-block" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No memes available</p>
      )}
      {/* Emoji Animation */}
      <div className="absolute bottom-0 right-0 flex gap-4 items-center animate-run">
        {emojis.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute bottom-0 right-0 animate-slide"
            style={{
              fontSize: "2rem",
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {emoji.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
