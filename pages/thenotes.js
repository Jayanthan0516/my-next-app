import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiFileText, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

export default function TheNotes() {
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  // Step 2: Create a function to save the note
  // This function must be declared as 'async'
  const [savedNote, setSavedNote] = useState(null);

  const saveNote = async () => {
    try {
      const response = await fetch("http://localhost:8000/notes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note_title: noteTitle,
          note_content: noteContent,
          user_id: sessionStorage.getItem("userId"),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSavedNote(data);  // Save the newly created note into state
        alert("Note Saved!");
        setNoteTitle("");
        setNoteContent("");  // Reset the form
      } else {
        alert("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("An error occurred while saving the note");
    }
  };

  return (
    <div className={`font-[Poppins,sans-serif] min-h-screen flex flex-col transition-all duration-300 ${showForm ? "backdrop-blur-2xl" : ""}`}>
      {/* Header Section */}
      <header className="bg-[#a1ccd2] text-black p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Keep Notes</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><button onClick={() => router.push("/")} className="hover:underline">Home</button></li>
            <li><button onClick={() => router.push("/register")} className="hover:underline">Register</button></li>
            <li><button onClick={() => router.push("/login")} className="hover:underline">Login</button></li>
          </ul>
        </nav>
      </header>

      {/* Greeting Section */}
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold">{greeting} {username}!</h1>
        <p className="text-lg mt-2">Welcome to your notes.</p>
      </div>

      {/* Floating Notes Icon Button */}
      <button 
        className="fixed bottom-4 right-4 bg-[#f4a261] p-4 rounded-full shadow-lg text-white hover:bg-[#e76f51] transition-all"
        onClick={() => setShowForm(true)}
      >
        <FiFileText size={24} />
      </button>

      {/* Notes Form */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.8 }} 
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-3xl"
        >
          <div className="bg-white bg-opacity-40 backdrop-blur-xl p-6 rounded-lg shadow-xl w-96 border border-white/30 relative">
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={() => setShowForm(false)}
            >
              <FiX size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Add a Note</h2>

            {/* Heading Input Box */}
            <input
              type="text"
              className="w-full p-2 border rounded bg-white bg-opacity-40 backdrop-blur-md"
              placeholder="Enter note title..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />

            {/* Textarea for Notes */}
            <textarea
              className="w-full p-3 border rounded h-40 bg-white bg-opacity-40 backdrop-blur-md mt-3"
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />

            {/* Save & Delete Buttons */}
            <div className="flex justify-between mt-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#22c55e] text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={saveNote} 
              >
                {/* Call the saveNote function */}
                Save
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#ef4444] text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => { setNoteTitle(""); setNoteContent(""); }}
              >
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Display saved note after successful save */}
      {savedNote && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <h3 className="font-bold text-xl">Saved Note:</h3>
          <p><strong>Title:</strong> {savedNote.note_title}</p>
          <p><strong>Content:</strong> {savedNote.note_content}</p>
          <p><strong>Created On:</strong> {savedNote.created_on}</p>
        </div>
      )}
    </div>
  );
}
