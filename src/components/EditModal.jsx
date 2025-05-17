import React, { useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase-config";
import { toast } from "react-toastify";
const EditModal = ({
  editingMeme,
  setEditingMeme,
  editForm,
  setEditForm,
  setMyMemes,
}) => {
  const [loading, setLoading] = useState(false);
  if (!editingMeme) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        ...editForm,
        createdAt: serverTimestamp(),
      };
      await updateDoc(doc(firestore, "memes", editingMeme.id), updatedData);
      setMyMemes((prev) =>
        prev.map((m) => (m.id === editingMeme.id ? { ...m, ...editForm } : m))
      );
      setEditingMeme(null);
      toast.success("Meme updated successfully!");
    } catch (error) {
      console.log("Error updating meme:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4 relative">
        <h3 className="text-xl font-bold mb-4">Edit Meme</h3>

        <label className="block mb-2">Suggested Caption</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={editForm.suggestedCaption}
          onChange={(e) =>
            setEditForm({ ...editForm, suggestedCaption: e.target.value })
          }
        />

        <label className="block mb-2">Top Text</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={editForm.topText}
          onChange={(e) =>
            setEditForm({ ...editForm, topText: e.target.value })
          }
        />

        <label className="block mb-2">Bottom Text</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={editForm.bottomText}
          onChange={(e) =>
            setEditForm({ ...editForm, bottomText: e.target.value })
          }
        />

        <label className="block mb-2">Font Size</label>
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          value={editForm.fontSize}
          onChange={(e) =>
            setEditForm({ ...editForm, fontSize: parseInt(e.target.value) })
          }
        />

        <label className="block mb-2">Font Color</label>
        <input
          type="color"
          className="w-full p-2 border rounded mb-4"
          value={editForm.fontColor}
          onChange={(e) =>
            setEditForm({ ...editForm, fontColor: e.target.value })
          }
        />

        <label className="block mb-2">Tags (comma separated)</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={editForm.tags.join(",")}
          onChange={(e) =>
            setEditForm({ ...editForm, tags: e.target.value.split(",") })
          }
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => setEditingMeme(null)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
