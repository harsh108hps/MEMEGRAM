import React, { useState } from 'react';

const CreateMeme = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [alignment, setAlignment] = useState('center');
  const [tagsInput, setTagsInput] = useState('');
  const [suggestedCaption, setSuggestedCaption] = useState('');

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
      "Debugging: 90% staring, 10% fixing"
    ];
    const random = captions[Math.floor(Math.random() * captions.length)];
    setSuggestedCaption(random);
  };

  const handlePublish = () => {
    if (!image) {
      alert("Please provide an image.");
      return;
    }

    const formattedTags = tagsInput
      .split(',')
      .map(tag => tag.trim().replace(/^#/, '').toLowerCase())
      .filter(tag => tag.length > 0);

    console.log("📸 Meme ready to publish (no Firebase):", {
      image,
      topText,
      bottomText,
      fontSize,
      fontColor,
      alignment,
      tags: formattedTags
    });

    alert("✅ Meme ready! (Not stored yet - Firebase disabled)");

    // Reset
    setImage(null);
    setImageFile(null);
    setTopText('');
    setBottomText('');
    setFontSize(28);
    setFontColor('#ffffff');
    setAlignment('center');
    setTagsInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🧠 Meme Creation Studio</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

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
          <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} className="w-full p-2 border rounded mb-2" />

          <label className="block font-medium">Bottom Text</label>
          <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="w-full p-2 border rounded mb-2" />

          <div className="flex space-x-2 mb-2">
            <label className="block font-medium">Font Size</label>
            <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-20 p-1 border rounded" />
          </div>

          <div className="flex space-x-4 mb-4">
            <label className="block font-medium">Font Color</label>
            <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Text Alignment</label>
            <select value={alignment} onChange={(e) => setAlignment(e.target.value)} className="w-full p-2 border rounded">
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
            {suggestedCaption && <p className="mt-2 text-gray-700 italic">💡 {suggestedCaption}</p>}
          </div>

          <button
            onClick={handlePublish}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Publish Meme
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
            <div className="text-gray-500 text-center p-4">No image selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMeme;
