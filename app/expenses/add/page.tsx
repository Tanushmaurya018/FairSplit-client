"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { FaArrowLeft, FaSave, FaMoneyBillWave } from "react-icons/fa";

interface Member {
  _id: string;
  username?: string;
  email?: string;
}

interface GroupData {
  members: Member[];
}

export default function AddExpensePage() {
  const router = useRouter();
  const params = useSearchParams();
  const groupId = params.get("groupId");

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paidBy, setPaidBy] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [msgType, setMsgType] = useState<"error" | "success">("error");

  useEffect(() => {
    (async () => {
      try {
        if (!groupId) return;
        const res = await axios.get(`/api/group/${groupId}`);
        const data: GroupData = res.data?.data || res.data;
        setMembers(data?.members || []);
      } catch {
        setMsg("Failed to load group members.");
        setMsgType("error");
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMsg("");

    if (!title || !amount || !paidBy || participants.length === 0) {
      setMsg("Please fill all required fields.");
      setMsgType("error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`/api/expense/groups/${groupId}`, {
        title,
        amount: Number(amount),
        payerId: paidBy,
        participants,
      });

      if (res.data?.success) {
        setMsg("Expense added successfully!");
        setMsgType("success");
        setTimeout(() => router.push(`/groups/${groupId}`), 1000);
      } else {
        setMsg(res.data?.message || "Failed to add expense.");
        setMsgType("error");
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setMsg(error?.response?.data?.message || "Error adding expense.");
      setMsgType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selected = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setParticipants(selected);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: "2s"}}></div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: "2s"}}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg">
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
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl shadow-lg">
                  <FaMoneyBillWave className="text-white text-3xl" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Add Expense</h1>
                <p className="text-gray-400 text-sm mt-1">Split costs with your group</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g., Dinner at Cafe"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Paid By</label>
                <select
                  value={paidBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaidBy(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15 appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-slate-900">Select Member</option>
                  {members.map((m: Member) => (
                    <option key={m._id} value={m._id} className="bg-slate-900">
                      {m.username || m.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Participants</label>
                <select
                  multiple
                  value={participants}
                  onChange={handleParticipantsChange}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15 cursor-pointer"
                  required
                >
                  {members.map((m: Member) => (
                    <option key={m._id} value={m._id} className="bg-slate-900">
                      {m.username || m.email}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Hold CMD (⌘) on Mac or CTRL on Windows to select multiple members
                </p>
                {participants.length > 0 && (
                  <div className="mt-3 p-3 bg-indigo-500/20 border border-indigo-500/50 rounded-lg">
                    <p className="text-sm text-indigo-200">
                      ✓ {participants.length} participant{participants.length !== 1 ? "s" : ""} selected
                    </p>
                  </div>
                )}
              </div>

              {msg && (
                <div className={`text-sm p-4 rounded-lg flex items-center gap-2 ${
                  msgType === "success"
                    ? "bg-green-500/20 border border-green-500/50 text-green-200"
                    : "bg-red-500/20 border border-red-500/50 text-red-200"
                }`}>
                  <span>{msgType === "success" ? "✓" : "⚠"}</span>
                  {msg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105"
              >
                <FaSave />
                {submitting ? "Saving..." : "Save Expense"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}