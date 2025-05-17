import { useEffect, useState, useRef } from "react";
import { firestore } from "../../firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const MemeOfTheDay = () => {
  const [topMemes, setTopMemes] = useState([]);

  useEffect(() => {
    const fetchTopMemes = async () => {
      const oneDayAgo = Timestamp.fromDate(
        new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      const memesRef = collection(firestore, "memes");

      const q = query(memesRef, where("createdAt", ">", oneDayAgo));
      const snapshot = await getDocs(q);

      const memes = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const netLikes = (data.likes || 0) - (data.dislikes || 0);
        memes.push({
          id: doc.id,
          ...data,
          netLikes,
        });
      });

      const topThree = memes
        .sort((a, b) => b.netLikes - a.netLikes)
        .slice(0, 3);

      setTopMemes(topThree);
    };

    fetchTopMemes();
  }, []);

  if (topMemes.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-12 px-4 bg-white text-center border-b border-gray-200"
    >
      <h2 className="text-2xl font-bold text-pink-600 mb-6">
        <span className="fire-animate inline-block mr-1">🔥</span>
        Top Memes of the Day
      </h2>

      {/* Carousel for lg screens */}
      <div className="hidden lg:block">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3}
          spaceBetween={30}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop
        >
          {topMemes.map((meme, index) => (
            <SwiperSlide key={meme.id}>
              <MemeCard meme={meme} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Stack display for smaller screens */}
      <div className="lg:hidden space-y-6">
        {topMemes.map((meme, index) => (
          <MemeCard key={meme.id} meme={meme} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

// const MemeCard = ({ meme, index }) => {
//   const badgeLabels = ["🥇 Top 1", "🥈 Top 2", "🥉 Top 3"];

//   return (
//     <motion.div
//       whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
//       transition={{ type: "spring", stiffness: 300 }}
//       className="bg-pink-50 rounded-lg shadow p-4 cursor-pointer transition-transform duration-300"
//     >
//       <div className="relative max-h-74 overflow-hidden rounded mb-4">
//         {/* Badge */}
//         {badgeLabels[index] && (
//           <motion.div
//             className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow z-10"
//             animate={{
//               scale: [1, 1.1, 1],
//               y: [0, -2, 0],
//             }}
//             transition={{
//               duration: 1.5,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           >
//             {badgeLabels[index]}
//           </motion.div>
//         )}

//         <img
//           src={meme.imageUrl}
//           alt="Top Meme"
//           className="w-full h-full object-contain rounded"
//         />

//         {meme.topText && (
//           <div
//             className="absolute top-2 left-0 w-full font-bold drop-shadow px-2"
//             style={{
//               color: meme.fontColor || "#FFFFFF",
//               fontSize: meme.fontSize ? `${meme.fontSize}px` : "24px",
//               textAlign: meme.alignment || "center",
//             }}
//           >
//             {meme.topText}
//           </div>
//         )}

//         {meme.bottomText && (
//           <div
//             className="absolute bottom-2 left-0 w-full font-bold drop-shadow px-2"
//             style={{
//               color: meme.fontColor || "#FFFFFF",
//               fontSize: meme.fontSize ? `${meme.fontSize}px` : "24px",
//               textAlign: meme.alignment || "center",
//             }}
//           >
//             {meme.bottomText}
//           </div>
//         )}
//       </div>

//       <h3 className="font-semibold text-lg">{meme.suggestedCaption}</h3>
//       <p className="text-sm text-gray-600 mt-2">
//         By {meme.userName} • {meme.netLikes} net likes
//       </p>
//     </motion.div>
//   );
// };
const MemeCard = ({ meme, index }) => {
  const badgeLabels = ["🥇 Top 1", "🥈 Top 2", "🥉 Top 3"];
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -50px 0px" });

  const direction = index % 2 === 0 ? -100 : 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction, scale: 0.9 }}
      animate={
        inView
          ? { opacity: 1, x: 0, scale: 1 }
          : { opacity: 0, x: direction, scale: 0.9 }
      }
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
      }}
      className="bg-pink-50 rounded-lg shadow p-4 cursor-pointer transition-transform duration-300"
    >
      <div className="relative max-h-74 overflow-hidden rounded mb-4">
        {badgeLabels[index] && (
          <motion.div
            className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow z-10"
            animate={{
              scale: [1, 1.1, 1],
              y: [0, -2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {badgeLabels[index]}
          </motion.div>
        )}

        <img
          src={meme.imageUrl}
          alt="Top Meme"
          className="w-full h-full object-contain rounded"
        />

        {meme.topText && (
          <div
            className="absolute top-2 left-0 w-full font-bold drop-shadow px-2"
            style={{
              color: meme.fontColor || "#FFFFFF",
              fontSize: meme.fontSize ? `${meme.fontSize}px` : "24px",
              textAlign: meme.alignment || "center",
            }}
          >
            {meme.topText}
          </div>
        )}

        {meme.bottomText && (
          <div
            className="absolute bottom-2 left-0 w-full font-bold drop-shadow px-2"
            style={{
              color: meme.fontColor || "#FFFFFF",
              fontSize: meme.fontSize ? `${meme.fontSize}px` : "24px",
              textAlign: meme.alignment || "center",
            }}
          >
            {meme.bottomText}
          </div>
        )}
      </div>

      <h3 className="font-semibold text-lg">{meme.suggestedCaption}</h3>
      <p className="text-sm text-gray-600 mt-2">
        By {meme.userName} • {meme.netLikes} net likes
      </p>
    </motion.div>
  );
};

export default MemeOfTheDay;
