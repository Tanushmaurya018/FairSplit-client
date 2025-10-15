"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { FaArrowLeft, FaUserPlus, FaMoneyBillWave, FaBalanceScale, FaUsers } from "react-icons/fa";

interface Member {
  _id: string;
  username?: string;
  email?: string;
  name?: string;
}

interface Expense {
  _id: string;
  title?: string;
  amount: number;
  payerId?: {
    username?: string;
    email?: string;
  } | string;
  createdAt: string;
}

interface Balance {
  userId?: {
    username?: string;
    email?: string;
  } | string;
  balance: number;
}

interface Settlement {
  from?: {
    username?: string;
    email?: string;
  } | string;
  to?: {
    username?: string;
    email?: string;
  } | string;
  amount?: number;
  amt?: number;
}

interface Group {
  _id: string;
  name: string;
  members: Member[];
}

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [expense, setExpense] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);
  const [userIdToAdd, setUserIdToAdd] = useState<string>("");
  const [balances, setBalances] = useState<Balance[] | null>(null);
  const [settlements, setSettlements] = useState<Settlement[] | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [msgType, setMsgType] = useState<"error" | "success">("error");

  const fetchGroup = async (): Promise<void> => {
    const { data } = await axios.get(`/api/group/${groupId}`);
    setGroup(data?.data || data);
  };

  const fetchExpenses = async (): Promise<void> => {
    const { data } = await axios.get(`/api/expense/groups/${groupId}`);
    setExpense(data?.data || data);
  };

  useEffect(() => {
    (async () => {
      try {
        const cached = localStorage.getItem("user");
        if (!cached) return router.push("/login");

        await fetchGroup();
        await fetchExpenses();
      } catch {
        setMsg("Failed to load group.");
        setMsgType("error");
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId, router]);

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!userIdToAdd.trim()) return;
    setAdding(true);
    setMsg("");

    try {
      const userId = userIdToAdd.trim();
      await axios.post(`/api/group/${groupId}/members`, { userId });
      setUserIdToAdd("");
      await fetchGroup();
      setMsg("Member added successfully!");
      setMsgType("success");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setMsg(error?.response?.data?.message || "Failed to add member.");
      setMsgType("error");
    } finally {
      setAdding(false);
    }
  };

  const loadBalances = async (): Promise<void> => {
    setMsg("");
    try {
      const { data } = await axios.get(`/api/balance/groups/${groupId}`);
      setBalances(data?.data || data);
      setMsgType("success");
    } catch {
      setMsg("Failed to fetch balances.");
      setMsgType("error");
    }
  };

  const loadSettlements = async (): Promise<void> => {
    setMsg("");
    try {
      const { data } = await axios.get(`/api/settlement/groups/${groupId}/suggestions`);
      setSettlements(data?.transactions || data?.transactions || data);
      setMsgType("success");
    } catch {
      setMsg("Failed to fetch settlements.");
      setMsgType("error");
    }
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
          <p className="text-gray-300">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
          <p className="text-gray-300 text-lg">Group not found.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
          >
            <FaArrowLeft /> Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: "2s"}}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">{group.name}</h1>
            <p className="text-gray-400 text-sm">Group ID: {group._id}</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-lg transition"
          >
            <FaArrowLeft /> Back
          </button>
        </header>

        <section className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">Members</h2>
              </div>
            </div>

            <form onSubmit={handleAddMember} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste user ID"
                  value={userIdToAdd}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserIdToAdd(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15"
                />
                <button
                  type="submit"
                  disabled={adding}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold rounded-lg transition transform hover:scale-105"
                >
                  <FaUserPlus /> {adding ? "Adding..." : "Add"}
                </button>
              </div>
              
              {msg && (
                <div className={`text-sm p-3 rounded-lg flex items-center gap-2 mt-3 ${
                  msgType === "success"
                    ? "bg-green-500/20 border border-green-500/50 text-green-200"
                    : "bg-red-500/20 border border-red-500/50 text-red-200"
                }`}>
                  <span>{msgType === "success" ? "✓" : "⚠"}</span>
                  {msg}
                </div>
              )}
            </form>

            {Array.isArray(group.members) && group.members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {group.members.map((m: Member) => (
                  <div key={m._id} className="bg-white/10 border border-white/20 rounded-lg p-4 hover:border-white/40 transition">
                    <p className="text-white font-medium">{m.username || m.name || "Member"}</p>
                    <p className="text-gray-400 text-sm mt-1">{m.email || m._id}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No members yet.</p>
            )}
          </div>
        </section>

        <section className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                <FaMoneyBillWave className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Expenses</h2>
            </div>
            <button
              onClick={() => router.push(`/expenses/add?groupId=${group._id}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
            >
              <FaMoneyBillWave /> Add Expense
            </button>
          </div>

          {Array.isArray(expense) && expense?.length > 0 ? (
            <div className="space-y-3">
              {expense?.map((e: Expense) => (
                <div key={e._id} className="bg-white/10 border border-white/20 rounded-lg p-4 hover:border-white/40 transition flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{e.title || "Expense"}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      by {typeof e.payerId === "object" ? (e.payerId?.username || e.payerId?.email || "Unknown") : e.payerId || "Unknown"} • {new Date(e.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-green-400 font-semibold">₹{Number(e.amount || 0).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No expenses recorded.</p>
          )}
        </section>

        <section className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
              <FaBalanceScale className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Balances & Settlements</h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadBalances}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-lg transition font-semibold"
            >
              <FaBalanceScale /> Check Balances
            </button>
            <button
              onClick={loadSettlements}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-lg transition font-semibold"
            >
              ⚖️ Settlement Plan
            </button>
          </div>

          {balances && (
            <div className="mt-4">
              <h3 className="text-white font-semibold mb-4">Balances (+ = creditor, − = debtor)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {balances.map((b: Balance, idx: number) => (
                  <div key={idx} className="bg-white/10 border border-white/20 rounded-lg p-4 hover:border-white/40 transition">
                    <p className="text-gray-300 text-sm">
                      <span className="text-white font-medium">
                        {typeof b.userId === "object" ? (b.userId?.username || b.userId?.email || "User") : b.userId || "User"}
                      </span>
                    </p>
                    <p className={`text-lg font-semibold mt-2 ${Number(b.balance) >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {Number(b.balance) >= 0 ? "+" : ""}
                      ₹{Number(b.balance || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {settlements && (
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-4">Suggested Settlements</h3>
              <div className="space-y-3">
                {settlements.map((t: Settlement, i: number) => (
                  <div key={i} className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 hover:border-green-500/80 transition">
                    <p className="text-green-100 text-sm">
                      <span className="text-white font-semibold">
                        {typeof t.from === "object" ? (t.from?.username || t.from?.email || "User") : t.from}
                      </span>
                      {" "}pays{" "}
                      <span className="text-white font-semibold">
                        {typeof t.to === "object" ? (t.to?.username || t.to?.email || "User") : t.to}
                      </span>
                      {" "}
                      <span className="text-green-300 font-bold">
                        ₹{Number(t.amount || t.amt || 0).toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}