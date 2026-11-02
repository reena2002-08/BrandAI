import { useState } from "react";
import jsPDF from "jspdf";

function Dashboard() {

  const [formData, setFormData] = useState({
    business: "",
    audience: "",
    style: "",
    platform: "",
  });

  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("generator");
  const [darkMode, setDarkMode] = useState(true);
  const [aiStatus, setAiStatus] = useState("Online");
  const [model, setModel] = useState("deepseek/deepseek-chat");
  const [comparison, setComparison] = useState([]);
  const [evaluation, setEvaluation] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const exportPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("BrandAI Generated Creative", 20, 20);

  doc.setFontSize(14);

  const content = generatedContent || "No content generated.";

  const splitText = doc.splitTextToSize(content, 170);

  doc.text(splitText, 20, 40);

  doc.save("BrandAI-Creative.pdf");

};

  const handleGenerate = async () => {

    try {

      setLoading(true);
      setGeneratedContent("");

      console.log("Generate Button Clicked");

      const response = await fetch("http://localhost:8000/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    ...formData,
    model,
  }),
});

      console.log("Response Status:", response.status);

      const data = await response.json();

      console.log("Backend Data:", data);

      if (response.ok) {

       setGeneratedContent(data.output);
setGeneratedImage(data.image);

const newHistoryItem = {
  business: formData.business,
  audience: formData.audience,
  style: formData.style,
  platform: formData.platform,
  content: data.output,
  image: data.image,
  time: new Date().toLocaleTimeString(),
};

setHistory((prev) => [newHistoryItem, ...prev]);

      } else {

        setGeneratedContent(
          "Error: " + (data.error || "Failed to generate content")
        );

      }

    } catch (error) {

      console.log("Frontend Error:", error);

      setGeneratedContent("Frontend Error Occurred");

    } finally {

      setLoading(false);

    }

  };

  const handleCompare = async () => {
  try {

    const response = await fetch(
      "http://localhost:8000/compare",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

   const data = await response.json();

setComparison(data.comparison);

setEvaluation(data.evaluation);

  } catch (error) {

    console.log(error);

  }
};

  return (
<div
  className={`min-h-screen flex transition-all duration-500 ${
    darkMode
      ? "bg-black text-white"
      : "bg-white text-black"
  }`}
>
    {/* Sidebar */}
    <div className="w-72 bg-zinc-950 border-r border-zinc-800 p-6 hidden md:block">

      <h1 className="text-3xl font-bold text-purple-500 mb-12">
        BrandAI
      </h1>

      <div className="space-y-4">

        {/* AI Generator */}
        <div
          onClick={() => setActiveTab("generator")}
          className={`p-4 rounded-xl cursor-pointer transition ${
            activeTab === "generator"
              ? "bg-purple-600"
              : "bg-zinc-900 hover:bg-zinc-800"
          }`}
        >
          AI Generator
        </div>

        {/* History */}
        <div
          onClick={() => setActiveTab("history")}
          className={`p-4 rounded-xl cursor-pointer transition ${
            activeTab === "history"
              ? "bg-purple-600"
              : "bg-zinc-900 hover:bg-zinc-800"
          }`}
        >
          History
        </div>

        {/* Analytics */}
        <div
  onClick={() => setActiveTab("analytics")}
  className={`p-4 rounded-xl cursor-pointer transition ${
    activeTab === "analytics"
      ? "bg-purple-600"
      : "bg-zinc-900 hover:bg-zinc-800"
  }`}
>
  Analytics
</div>

        {/* Settings */}
        <div
  onClick={() => setActiveTab("settings")}
  className={`p-4 rounded-xl cursor-pointer transition ${
    activeTab === "settings"
      ? "bg-purple-600"
      : "bg-zinc-900 hover:bg-zinc-800"
  }`}
>
  Settings
</div>

      </div>

    </div>

    {/* Main Content */}
    <div className="flex-1 p-8">

        {/* ========================= */}
{/* ANALYTICS PAGE */}
{/* ========================= */}

{activeTab === "analytics" && (

  <div>

    <h2 className="text-5xl font-bold mb-4">
      AI Analytics Dashboard
    </h2>

    <p className="text-gray-400 mb-10">
      Smart AI insights and branding statistics.
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* Card 1 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

        <h3 className="text-gray-400 mb-3">
          Total Creatives
        </h3>

        <p className="text-5xl font-bold text-purple-500">
          {history.length}
        </p>

      </div>

      {/* Card 2 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

        <h3 className="text-gray-400 mb-3">
          AI Status
        </h3>

        <p className="text-3xl font-bold text-green-400">
          {aiStatus}
        </p>

      </div>

      {/* Card 3 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

        <h3 className="text-gray-400 mb-3">
          Most Used Platform
        </h3>

        <p className="text-3xl font-bold text-blue-400">
          Instagram
        </p>

      </div>

      {/* Card 4 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

        <h3 className="text-gray-400 mb-3">
          Brand Score
        </h3>

        <p className="text-5xl font-bold text-pink-400">
          92%
        </p>

      </div>

    </div>

    {/* Large Chart Style Box */}
    <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

      <h3 className="text-3xl font-semibold mb-6">
        AI Performance Insights
      </h3>

      <div className="space-y-6">

        <div>

          <div className="flex justify-between mb-2">
            <span>Content Quality</span>
            <span>95%</span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-4">
            <div className="bg-purple-600 h-4 rounded-full w-[95%]"></div>
          </div>

        </div>

        <div>

          <div className="flex justify-between mb-2">
            <span>Brand Relevance</span>
            <span>90%</span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-4">
            <div className="bg-pink-500 h-4 rounded-full w-[90%]"></div>
          </div>

        </div>

        <div>

          <div className="flex justify-between mb-2">
            <span>Audience Engagement</span>
            <span>88%</span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-4">
            <div className="bg-blue-500 h-4 rounded-full w-[88%]"></div>
          </div>

        </div>

      </div>

    </div>

  </div>

)}

{/* ========================= */}
{/* SETTINGS PAGE */}
{/* ========================= */}

{activeTab === "settings" && (

  <div>

    <h2 className="text-5xl font-bold mb-4">
      Dashboard Settings
    </h2>

    <p className="text-gray-400 mb-10">
      Customize your AI branding platform.
    </p>

    <div className="grid md:grid-cols-2 gap-8">

      {/* Dark Mode */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        <h3 className="text-2xl font-semibold mb-4">
          Appearance Mode
        </h3>

        <button
  onClick={() => setDarkMode(!darkMode)}
  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition"
>
  {darkMode ? "Dark Mode Enabled" : "Light Mode Enabled"}
</button>

      </div>

      {/* AI Status */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        <h3 className="text-2xl font-semibold mb-4">
          AI Service Status
        </h3>

        <div className="flex items-center gap-3">

          <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>

          <span className="text-green-400 text-xl">
            {aiStatus}
          </span>

        </div>

      </div>

      {/* Export */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        <h3 className="text-2xl font-semibold mb-4">
          Export Options
        </h3>

        <p className="text-gray-400 mb-4">
          Download generated branding creatives.
        </p>

        <button
  onClick={exportPDF}
  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition"
>
  Export PDF
</button>
      </div>

      {/* Version */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        <h3 className="text-2xl font-semibold mb-4">
          Platform Version
        </h3>

        <p className="text-4xl font-bold text-purple-500">
          v2.0
        </p>

      </div>

    </div>

  </div>

)}

      {/* ========================= */}
      {/* HISTORY PAGE */}
      {/* ========================= */}

      {activeTab === "history" && (

        <div>

          <h2 className="text-5xl font-bold mb-4">
            Creative History
          </h2>

          <p className="text-gray-400 mb-10">
            Previously generated AI branding creatives.
          </p>

          <div className="grid gap-6">

            {history.length === 0 ? (

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center text-gray-500">
                No history available yet.
              </div>

            ) : (

              history.map((item, index) => (

                <div
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
                >

                  <div className="flex justify-between items-center mb-4">

                    <h3 className="text-2xl font-semibold text-purple-400">
                      {item.business}
                    </h3>

                    <span className="text-gray-500 text-sm">
                      {item.time}
                    </span>

                  </div>

                  <img
                    src={item.image}
                    alt="History"
                    className="w-full h-[300px] object-cover rounded-2xl mb-6"
                  />

                  <div className="whitespace-pre-wrap text-gray-300">
                    {item.content}
                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      )}

      {/* ========================= */}
      {/* GENERATOR PAGE */}
      {/* ========================= */}

      {activeTab === "generator" && (

        <>

          <h2 className="text-5xl font-bold mb-4">
            AI Brand Intelligence Dashboard
          </h2>

          <p className="text-gray-400 mb-12">
            Generate AI-powered branding creatives using intelligent prompt engineering.
          </p>

          {/* AI Model Selection */}
<div className="mb-8">
  <label className="block text-lg font-semibold mb-3">
  Choose AI Model
</label>

  <select
    value={model}
    onChange={(e) => setModel(e.target.value)}
    className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
  >
    <option value="deepseek/deepseek-chat">
  DeepSeek
</option>

<option value="openai/gpt-oss-20b:free">
  GPT OSS
</option>
  </select>
</div>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* LEFT PANEL */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h3 className="text-3xl font-semibold mb-8">
                Brand Details
              </h3>

              <div className="space-y-6">

                <input
                  type="text"
                  name="business"
                  placeholder="Business Type"
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-purple-500"
                />

                <select
                  name="audience"
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-purple-500"
                >
                  <option value="">Target Audience</option>
                  <option>Gen Z</option>
                  <option>Professionals</option>
                  <option>Luxury Audience</option>
                  <option>Students</option>
                </select>

                <select
                  name="style"
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-purple-500"
                >
                  <option value="">Design Style</option>
                  <option>Minimal</option>
                  <option>Luxury</option>
                  <option>Cyberpunk</option>
                  <option>Modern</option>
                </select>

                <select
                  name="platform"
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-purple-500"
                >
                  <option value="">Platform</option>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>Facebook</option>
                </select>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-xl text-lg font-semibold transition"
                >
                  {loading ? "Generating..." : "Generate AI Creative"}
                </button>

                <button
  onClick={handleCompare}
  className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-lg font-semibold transition mt-3"
>
  Compare Models
</button>

              </div>

            </div>

            {/* OUTPUT SECTION */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-purple-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-900/20">

              <div className="flex items-center justify-between mb-8">

                <div>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    AI Generated Output
                  </h3>

                  <p className="text-gray-400">
                    Smart branding creatives generated using AI
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30">
                  ✨
                </div>

              </div>

              {generatedContent ? (

                <div className="relative overflow-hidden">

                  <div className="absolute inset-0 bg-purple-500/5 blur-3xl"></div>

                  <div className="relative bg-black/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 whitespace-pre-wrap text-gray-200 leading-loose text-lg">

                    <div className="flex justify-end mb-4">

                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(generatedContent)
                        }
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm transition"
                      >
                        Copy Output
                      </button>

                    </div>

                    {generatedImage && (

                      <div className="relative mb-6">

                        <img
                          src={generatedImage}
                          alt="AI Generated Poster"
                          className="w-full h-[400px] object-cover rounded-3xl border border-purple-500/20 shadow-xl shadow-purple-900/20"
                        />

                      </div>

                    )}

                    {generatedContent}

                  </div>

                </div>

              ) : (

                <div className="h-[400px] flex flex-col items-center justify-center text-center">

                  <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center text-5xl mb-6 animate-pulse">
                    🤖
                  </div>

                  <h4 className="text-2xl font-semibold text-white mb-3">
                    AI Output Awaits
                  </h4>

                  <p className="text-gray-500 max-w-md">
                    Fill in your brand details and generate powerful AI-powered
                    marketing creatives instantly.
                  </p>

                </div>

              )}

          

             </div>

          </div>

          {comparison?.length > 0 && (

            <div className="mt-12">

              <h2 className="text-4xl font-bold mb-8">
                AI Model Comparison
              </h2>

              {evaluation && (

  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">

    <h3 className="text-3xl font-bold text-yellow-400 mb-6">
      🏆 Winner: {evaluation.winner}
    </h3>

    <div className="overflow-x-auto">

      <table className="w-full text-center">

        <thead>

          <tr className="border-b border-zinc-700">

            <th className="p-4">Metric</th>
            <th className="p-4">DeepSeek</th>
            <th className="p-4">GPT OSS</th>

          </tr>

        </thead>

        <tbody>

          <tr>
            <td className="p-4">Creativity</td>
            <td>{evaluation?.DeepSeek?.creativity}</td>
            <td>{evaluation?.GPTOSS?.creativity}</td>
          </tr>

          <tr>
            <td className="p-4">Relevance</td>
            <td>{evaluation?.DeepSeek?.relevance}</td>
            <td>{evaluation?.GPTOSS?.relevance}</td>
          </tr>

          <tr>
            <td className="p-4">Marketing</td>
            <td>{evaluation?.DeepSeek?.marketing}</td>
            <td>{evaluation?.GPTOSS?.marketing}</td>
          </tr>

          <tr>
            <td className="p-4">Hashtags</td>
            <td>{evaluation?.DeepSeek?.hashtags}</td>
            <td>{evaluation?.GPTOSS?.hashtags}</td>
          </tr>

          <tr className="font-bold text-purple-400">
            <td className="p-4">Overall</td>
            <td>{evaluation?.DeepSeek?.overall}</td>
            <td>{evaluation?.GPTOSS?.overall}</td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>

)}

              <div className="grid md:grid-cols-2 gap-6">

                {comparison.map((item, index) => (

                  <div
                    key={index}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                  >

                    <h3 className="text-2xl font-bold text-purple-400 mb-4">
                      {item.model}
                    </h3>

                    <div className="whitespace-pre-wrap text-gray-300">
                      {item.output}
                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </>

      )}

    </div>

  </div>
);
}

export default Dashboard;