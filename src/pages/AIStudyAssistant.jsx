import { useState } from "react";
import { Upload, FileText, Brain, ListChecks, Sparkles } from "lucide-react";

export default function AIStudyAssistant() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleAIAction = (action) => {
    setLoading(true);
    setOutput(`Titi is analyzing your document for ${action}...`);
    
    setTimeout(() => {
      setLoading(false);
      if (action === "Summary") setOutput("✨ Summary: This document discusses the core principles of Quantum Physics, focusing on wave-particle duality and the Heisenberg Uncertainty Principle. Key takeaway: energy is quantized.");
      if (action === "Flashcards") setOutput("🗂️ Flashcards Generated:\n1. What is a Photon? -> A particle of light.\n2. Define Planck's constant -> h = 6.626 x 10^-34 J·s.");
      if (action === "Quiz") setOutput("📝 Quiz Created:\nQ1: Who proposed the uncertainty principle?\nQ2: What is the speed of light in vacuum?");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-8 pb-32">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-black mb-4">Titi <span className="text-blue-500">AI Assistant</span></h1>
        <p className="text-gray-400 mb-12">Upload your PDFs and let Titi turn them into study gold. 💎</p>

        {/* Upload Area */}
        <div className="glass p-12 rounded-[40px] border-2 border-dashed border-blue-500/30 mb-8 flex flex-col items-center justify-center relative group overflow-hidden">
          <Upload size={60} className="text-blue-500 mb-4 group-hover:scale-110 transition-all" />
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p className="text-xl font-medium">{file ? file.name : "Drop your PDF here or click to upload"}</p>
          <p className="text-gray-500 text-sm mt-2">Supports PDF, TXT, DOCX</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button onClick={() => handleAIAction("Summary")} className="glass p-6 rounded-3xl hover:bg-blue-600/20 transition-all flex flex-col items-center gap-3">
            <FileText className="text-blue-400" /> <span className="font-bold">Summarize</span>
          </button>
          <button onClick={() => handleAIAction("Flashcards")} className="glass p-6 rounded-3xl hover:bg-purple-600/20 transition-all flex flex-col items-center gap-3">
            <ListChecks className="text-purple-400" /> <span className="font-bold">Flashcards</span>
          </button>
          <button onClick={() => handleAIAction("Quiz")} className="glass p-6 rounded-3xl hover:bg-pink-600/20 transition-all flex flex-col items-center gap-3">
            <Sparkles className="text-pink-400" /> <span className="font-bold">Quick Quiz</span>
          </button>
        </div>

        {/* Output Area */}
        <div className="glass p-8 rounded-[32px] min-h-[200px] text-left relative">
          <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold uppercase text-xs tracking-widest">
            <Brain size={16} /> Titi's Analysis
          </div>
          {loading ? (
            <div className="flex items-center gap-3 text-gray-400 animate-pulse">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              Titi is thinking...
            </div>
          ) : (
            <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-line">
              {output || "Upload a file and choose an action to see the magic ✨"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}