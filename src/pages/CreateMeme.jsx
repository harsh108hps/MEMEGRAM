import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage } from "../../firebase-config";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

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
    const captions = [
      "When the code finally works...",
      "Me waiting for the weekend like...",
      "This is peak performance 😂",
      "Life before coffee vs after ☕",
      "Debugging: 90% staring, 10% fixing",
      "When you realize it's Monday tomorrow...",
      "Did I lock the door? Did I say something weird 5 years ago?",
      "That one 'k' text ruining your whole week.",
      "Social battery: 0%. Awkward smile: 100%.",
      "Anxiety said, 'Surprise!' and now I'm crying in the club.",
      "Me: Finally relaxed. Brain: Time to panic.",
      "Cooking is fun… until it’s time to wash dishes.",
      "Me: I’ll eat clean today. Also me: orders 3 pizzas",
      "Fitness tip: If you eat fast enough, the calories can’t catch you.",
      "Fridge: empty. Mood: ruined.",
      "That bite of food hitting just right… tears in my eyes.",
      "Me at 3am: Time to rewatch my whole life.",
      "One more episode. One more regret.",
      "Alarms are just spicy lullabies.",
      "Procrastinators unite… tomorrow.",
      "Sleep schedule? Never heard of her.",
      "Dog logic: bark first, think later.",
      "My cat judging me like it pays rent.",
      "Pet: Sleeps all day. Me: Jealous.",
      "Talking to my dog like it understands taxes.",
      "Works in dev, breaks in prod. Classic.",
      "When the code finally runs, but you have no idea why.",
      "Fix one bug, create three new ones. Software development, baby!",
      "That feeling when your console.log solves more than Stack Overflow.",
      "Git commit -m 'final_final_v3_actually_final'",
      "99 bugs in the code. Take one down, patch it around... 127 bugs in the code.",
      "Me: It’s just a small CSS change. Also me: Why is the entire layout broken?",
      "Debugging: when you stare at your code long enough to doubt reality.",
      "Programmer's prayer: Please don’t let it be a semicolon.",
      "When the code compiles, but deep down you know it shouldn't.",
      "Me coding vs AI writing the same code in 5 seconds.",
      "AI wrote it. I just copied, pasted, and prayed.",
      "When you use ChatGPT to debug, but it roasts your code instead.",
      "Learning code in 2025: 20% syntax, 80% asking AI what went wrong.",
      "Why learn recursion when AI already understands it better than I ever will?",
    ];
    const random = captions[Math.floor(Math.random() * captions.length)];
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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🧠 Meme Creation Studio</h2>

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
              className="flex-1 p-2 border rounded"
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
            className="w-full p-2 border rounded mb-2"
          />

          <label className="block font-medium">Bottom Text</label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <div className="flex space-x-2 mb-2">
            <label className="block font-medium">Font Size</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 p-1 border rounded"
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

          <div className="mb-4">
            <label className="block font-medium">Text Alignment</label>
            <select
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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
              <p className="mt-2 text-gray-700 italic">💡 {suggestedCaption}</p>
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
        <div className="relative border border-gray-300 p-2 bg-white rounded">
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
