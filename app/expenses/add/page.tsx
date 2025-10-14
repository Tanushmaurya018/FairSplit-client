"use client";

import { useState, useEffect, Suspense } from "react";
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

function AddExpensePage() {
  const router = useRouter();
  const params = useSearchParams();
  const groupId = params.get("groupId");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"error" | "success">("error");

  useEffect(() => {
    async function loadMembers() {
      if (!groupId) return;
      try {
        const res = await axios.get(`/api/group/${groupId}`);
        const data: GroupData = res.data?.data || res.data;
        setMembers(data?.members || []);
      } catch {
        setMsg("Failed to load group members.");
        setMsgType("error");
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, [groupId]);

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setParticipants(selected);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-white">Loading members...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-lg mx-auto relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <FaArrowLeft /> Back
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
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Expense Title</label>
              <input
                type="text"
                placeholder="e.g., Dinner at Cafe"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Paid By */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Paid By</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Member</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.username || m.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Participants</label>
              <select
                multiple
                value={participants}
                onChange={handleParticipantsChange}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                required
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.username || m.email}
                  </option>
                ))}
              </select>
            </div>

            {msg && (
              <div
                className={`text-sm p-4 rounded-lg ${
                  msgType === "success"
                    ? "bg-green-500/20 border border-green-500/50 text-green-200"
                    : "bg-red-500/20 border border-red-500/50 text-red-200"
                }`}
              >
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg"
            >
              <FaSave /> {submitting ? "Saving..." : "Save Expense"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense to satisfy Turbopack
export default function AddExpensePageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <AddExpensePage />
    </Suspense>
  );
}
