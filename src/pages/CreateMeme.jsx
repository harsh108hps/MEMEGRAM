import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage } from "../../firebase-config";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { BsEmojiSunglasses } from "react-icons/bs";

const CreateMeme = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [alignment, setAlignment] = useState("center");
  const [tagsInput, setTagsInput] = useState("");
  const [suggestedCaption, setSuggestedCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleImageUrlInput = () => {
    if (imageUrlInput.trim()) {
      setImage(imageUrlInput.trim());
      setImageFile(null);
    }
  };

  const handleGenerateCaption = () => {
    const tagKeywordMap = {
      coding: [
        "Works in dev, breaks in prod. Classic.",
        "Fix one bug, create three new ones. Software development, baby!",
        "Git commit -m 'final_final_v3_actually_final'",
        "Me coding vs AI writing the same code in 5 seconds.",
        "When the code compiles, but deep down you know it shouldn't.",
        "It worked on my machine.",
        "Code like nobody’s debugging.",
        "Semicolon ruined my life... again.",
        "I have a joke on recursion, but it’s too deep.",
        "99 little bugs in the code, take one down, patch it around… 127 bugs in the code.",
        "Git commit -m 'final final FINAL version'",
        "Real developers don’t comment, they whisper to the code.",
        "Stack Overflow is my co-pilot.",
        "While(true) { procrastinate(); }",
        "I turn coffee into code… and bugs.",
        "That moment when the code runs… but it really shouldn't.",
        "Trust me, I’m a developer. (Famous last words)",
        "404: Sleep not found",
      ],
      funny: [
        "That one 'k' text ruining your whole week.",
        "Cooking is fun… until it’s time to wash dishes.",
        "Fitness tip: If you eat fast enough, the calories can’t catch you.",
        "Dog logic: bark first, think later.",
        "Me: I’ll eat clean today. Also me: orders 3 pizzas",
        "POV: You opened Instagram for 2 mins... and now it's 3 hours later.",
        "Influencers be like: Just woke up 😌 (with full makeup and perfect lighting).",
        "When the filter is cute but you still look like a potato.",
        " Brain: 1% ideas, 99% panic.",
        " Why run? We’re all dying anyway.",
        "Battery full. Will to live: low",
        "404: Motivation not found",
        "If sleep was a job, I’d be CEO",
        "    Born to scroll, forced to work.",
        "Currently training for a Netflix marathon.",
        "My diet starts... after this snack.",
        " God’s still buffering my success.",
        " Confidence level: selfie with no filter.",
        "This meme is my therapy session.",
        "Warning: May start dancing randomly.",
      ],
      cat: [
        "My cat judging me like it pays rent.",
        "Pet: Sleeps all day. Me: Jealous.",
        "This cat’s side-eye has me rethinking my life.",
        "Me: Come cuddle. Cat: How about never?",
      ],
      dog: [
        "Talking to my dog like it understands taxes.",
        "Dog logic: bark first, think later.",
        "My dog’s zoomies could power a small city.",
        "Pet me or face the consequences.",
      ],
      sleep: [
        "Sleep schedule? Never heard of her.",
        "Alarms are just spicy lullabies.",
        "Me: Finally relaxed. Brain: Time to panic.",
        "One more episode. One more regret.",
      ],
    };

    const defaultCaptions = [
      "When the code finally works...",
      "Me waiting for the weekend like...",
      "Life before coffee vs after ☕",
      "That feeling when your console.log solves more than Stack Overflow.",
      "Procrastinators unite… tomorrow.",
      "Me: I'll sleep early tonight. Also me at 3AM: Is SpongeBob a sea sponge or a kitchen one?",
      "Adulting level: Cried because I dropped a taco.",
      "Nothing haunts you like the pizza you didn’t eat.",
      "Why do I spend 20 minutes picking a movie just to scroll on my phone the whole time?",
      "Mood: buffering...",
      "Brain.exe has stopped working",
      "Too tired to function",
      "When autocorrect ruins your life",
      "Trust issues? I use public WiFi",
      "Plot twist: I was the drama",
      "Running on vibes and bad decisions",
      "404: Motivation not found",
      "Can’t. Busy doing nothing.",
      "Spoiler alert: I survived",
      "Reality? Hard pass.",
      "I thought it was Friday",
    ];
    const tags = tagsInput
      .toLowerCase()
      .split(",")
      .map((tag) => tag.replace(/^#/, "").trim())
      .filter(Boolean);
    const matchedCaptions = tags.flatMap((tag) => tagKeywordMap[tag] || []);
    const captionPool =
      matchedCaptions.length > 0 ? matchedCaptions : defaultCaptions;
    const random = captionPool[Math.floor(Math.random() * captionPool.length)];
    setSuggestedCaption(random);
  };

  const handlePublish = async () => {
    setLoading(true);
    if (!image) {
      toast.warning("Please provide an image.");
      return;
    }

    if (!user) {
      toast.warning("Please log in to publish a meme.");
      return;
    }
    const formattedTags = tagsInput
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, "").toLowerCase())
      .filter((tag) => tag.length > 0);
    try {
      let imageUrl = image;
      if (imageFile) {
        const imageRef = ref(storage, `memes/${uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      await addDoc(collection(firestore, "memes"), {
        imageUrl,
        topText,
        bottomText,
        fontSize,
        fontColor,
        alignment,
        tags: formattedTags,
        suggestedCaption,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || user.email,
        likes: 0,
        dislikes: 0,
        comments: [],
      });
      toast.success("Meme published successfully!");
      setImage(null);
      setImageFile(null);
      setTopText("");
      setBottomText("");
      setFontSize(28);
      setFontColor("#ffffff");
      setAlignment("center");
      setTagsInput("");
      setSuggestedCaption("");
      setImageUrlInput("");
    } catch (error) {
      console.error("Error publishing meme:", error);
      toast.error("❌ Failed to publish meme.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#f8f5f0] m-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <span className="text-yellow-500 zoom-in-out">
          <BsEmojiSunglasses size={28} />
        </span>
        <span>Meme Creation Studio 📽️</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />

          <label className="block font-medium">or Paste Image URL</label>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/meme.jpg"
              className="flex-1 p-2 border rounded bg-gray-100  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />
            <button
              onClick={handleImageUrlInput}
              className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
            >
              Load
            </button>
          </div>

          <label className="block font-medium">Top Text</label>
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            className="w-full p-2 border rounded mb-2 bg-gray-100  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          />

          <label className="block font-medium">Bottom Text</label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            className="w-full p-2 border rounded mb-2 bg-gray-100  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          />

          <div className="flex space-x-2 mb-2">
            <label className="block font-medium">Font Size</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 p-1 border rounded bg-gray-100  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4 mb-4">
            <label className="block font-medium">Font Color</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
            />
          </div>

          <div className="mb-4  ">
            <label className="block font-medium">Text Alignment</label>
            <select
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#funny, #relatable, #coding"
              className="w-full p-2 border rounded bg-gray-100  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={handleGenerateCaption}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Generate AI Caption
            </button>
            {suggestedCaption && (
              <p className="mt-2 text-gray-900 italic ">
                💡 {suggestedCaption}
              </p>
            )}
          </div>

          <button
            onClick={handlePublish}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            {loading ? "Publishing..." : "Publish Meme"}
          </button>
        </div>

        {/* Preview */}
        <div className="relative border border-gray-400 p-2 bg-gray-100 rounded">
          {image ? (
            <div className="w-full relative">
              <img src={image} alt="Meme preview" className="w-full rounded" />
              <div
                className={`absolute top-2 left-0 right-0 text-${alignment} px-4 font-bold`}
                style={{ fontSize: `${fontSize}px`, color: fontColor }}
              >
                {topText}
              </div>
              <div
                className={`absolute bottom-2 left-0 right-0 text-${alignment} px-4 font-bold`}
                style={{ fontSize: `${fontSize}px`, color: fontColor }}
              >
                {bottomText}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center p-4">
              No image selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMeme;
