import { useEffect, useState } from "react";
import { firestore } from "../../firebase-config";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MemeOfTheDay = () => {
  const [topMeme, setTopMeme] = useState(null);

  useEffect(() => {
    const fetchTopMeme = async () => {
      const oneDayAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
      const memesRef = collection(firestore, "memes");

      const q = query(memesRef, where("createdAt", ">", oneDayAgo));
      const snapshot = await getDocs(q);

      let bestMeme = null;
      snapshot.forEach(doc => {
        const data = doc.data();
        const netLikes = (data.likes || 0) - (data.dislikes || 0);

        if (!bestMeme || netLikes > bestMeme.netLikes) {
          bestMeme = {
            id: doc.id,
            ...data,
            netLikes,
          };
        }
      });

      setTopMeme(bestMeme);
    };

    fetchTopMeme();
  }, []);

  if (!topMeme) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-12 px-4 bg-white text-center border-b border-gray-200"
    >
      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        🔥 Meme of the Day
      </h2>
      <div className="max-w-md mx-auto bg-pink-50 rounded-lg shadow p-4">
        <img
          src={topMeme.imageUrl}
          alt="Top Meme"
          className="rounded mb-4 max-h-64 object-cover mx-auto"
        />
        <h3 className="font-semibold text-lg">{topMeme.caption}</h3>
        <p className="text-sm text-gray-600 mt-2">
          By {topMeme.author} • {topMeme.netLikes} net likes
        </p>
        
      </div>
    </motion.section>
  );
};

export default MemeOfTheDay;
