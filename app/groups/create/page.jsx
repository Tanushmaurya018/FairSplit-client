"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaArrowLeft, FaUsers, FaCheck } from "react-icons/fa";

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [memberIdsInput, setMemberIdsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");

  const parseUserIds = (raw) =>
    raw
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const memberIds = parseUserIds(memberIdsInput);
      console.log(name, memberIds);
      const { data } = await axios.post("/api/group", { name, members: memberIds });
      const id = data?._id || data?.group?._id;
      setMsg("Group created successfully!");
      setMsgType("success");
      
      setTimeout(() => {
        if (id) router.push(`/groups/${id}`);
        else router.push("/");
      }, 1000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to create group");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  const memberCount = parseUserIds(memberIdsInput).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: "2s"}}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition" />
            Back
          </button>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-xl shadow-lg">
                  <FaUsers className="text-white text-3xl" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Create Group</h1>
                <p className="text-gray-400 text-sm mt-1">Start managing expenses with your friends</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Group Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Goa Trip"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Member IDs</label>
                <textarea
                  value={memberIdsInput}
                  onChange={(e) => setMemberIdsInput(e.target.value)}
                  rows={4}
                  placeholder="Paste user IDs (separated by spaces or commas)&#10;Example: 65a1b2c3d4e5f6g7h8i9j0k1 65b2c3d4e5f6g7h8i9j0k1a2"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15 resize-none"
                />
                {memberCount > 0 && (
                  <p className="text-xs text-purple-300 flex items-center gap-1">
                    <FaCheck className="text-green-400" />
                    {memberCount} member{memberCount !== 1 ? "s" : ""} added
                  </p>
                )}
              </div>

              {msg && (
                <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${
                  msgType === "success"
                    ? "bg-green-500/20 border border-green-500/50 text-green-200"
                    : "bg-red-500/20 border border-red-500/50 text-red-200"
                }`}>
                  <span>{msgType === "success" ? "✓" : "⚠"}</span>
                  {msg}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105"
                >
                  {loading ? "Creating..." : "Create Group"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}