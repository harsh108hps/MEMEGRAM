import React, { useEffect, useState } from "react";
// import { db } from "../firebase"; // uncomment when Firebase is active
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase-config";
// const dummyMemes = [
//   {
//     id: "1",
//     imageURL: "https://i.imgflip.com/30b1gx.jpg",
//     topText: "When you deploy without bugs",
//     bottomText: "Legendary moment 👑",
//     caption: "Flawless code! 😂",
//     tags: ["#devlife", "#funny"],
//     upvotes: 12,
//     downvotes: 2,
//     createdBy: "MemeKing",
//     createdAt: new Date().toLocaleDateString(),
//   },
// ];

const Feed = () => {
  const [memes, setMemes] = useState([]);
  const [votes, setVotes] = useState({});

  // Fetch memes (replace dummyMemes with real fetch later)
  useEffect(() => {
    const fetchMemes = async () => {
      // Uncomment for Firebase
      const querySnapshot = await getDocs(collection(firestore, "memes"));
      const memeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(memeList);
      setMemes(memeList); // Replace with memeList for real data
    };

    fetchMemes();
  }, []);

  const handleVote = (id, type) => {
    if (votes[id]) return; // Prevent multiple votes

    setMemes((prev) =>
      prev.map((meme) =>
        meme.id === id
          ? {
              ...meme,
              upvotes: type === "up" ? meme.upvotes + 1 : meme.upvotes,
              downvotes: type === "down" ? meme.downvotes + 1 : meme.downvotes,
            }
          : meme
      )
    );

    setVotes((prev) => ({ ...prev, [id]: type }));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🔥 Meme Feed</h1>

      {memes.map((meme) => (
        <div key={meme.id} className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative w-full">
            <img
              src={meme.imageUrl}
              alt="meme"
              className="w-full rounded-md object-contain"
            />
         <div
  className="absolute top-2 left-0 w-full font-bold drop-shadow px-2"
  style={{
    color: meme.fontColor,
    fontSize: meme.fontSize ? `${meme.fontSize}px` : "24px",
    textAlign: meme.alignment || "center", // default to center
  }}
>
  {meme.topText}
</div>

<div
  className="absolute bottom-2 left-0 w-full font-bold drop-shadow px-2"
  style={{
    color: meme.fontColor,
    fontSize: meme.fontSize ? `${meme.fontSize}px` : "24px",
    textAlign: meme.alignment || "center", // default to center
  }}
>
  {meme.bottomText}
</div>

          </div>

          <p className="mt-3 text-lg font-medium">📝 {meme.caption}</p>
          <div className="text-sm text-gray-500 mb-2">
            Tags: {meme.tags?.join(" ")} | Posted by: {meme.userName} |{" "}
            {meme.createdAt?.toDate().toLocaleString()}
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => handleVote(meme.id, "up")}
              disabled={votes[meme.id]}
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                votes[meme.id] === "up" ? "bg-green-300" : "bg-gray-100"
              }`}
            >
              👍 {meme.upvotes}
            </button>
            <button
              onClick={() => handleVote(meme.id, "down")}
              disabled={votes[meme.id]}
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                votes[meme.id] === "down" ? "bg-red-300" : "bg-gray-100"
              }`}
            >
              👎 {meme.downvotes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
