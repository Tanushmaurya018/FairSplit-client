"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaUsers, FaPlus, FaSignOutAlt } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Member {
  _id: string;
  name?: string;
}

interface Group {
  _id: string;
  name: string;
  members: Member[];
  createdAt?: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cached = localStorage.getItem("user");
        if (!cached) {
          router.push("/login");
          return;
        }
        setUser(JSON.parse(cached));

        const { data } = await axios.get("/api/group");
        setGroups(Array.isArray(data.data) ? data.data : data?.data?.groups || []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const uniqueMembers = new Set(groups.flatMap(g => (g.members || []).map(m => m._id)));

  // 🔹 Changed: now only user ID, no full URL
  const userId = user?._id || "";

  const copyToClipboard = async (): Promise<void> => {
    if (userId) {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 5000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.username || "User"}! 👋
              </h1>
              <p className="text-gray-400">Manage your groups and expenses effortlessly</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/groups/create"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <FaPlus className="text-lg" />
                Create Group
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-3 bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-red-200 font-semibold rounded-lg transition duration-200"
              >
                <FaSignOutAlt className="text-lg" />
                Logout
              </button>
            </div>
          </div>

          {/* 🔹 Changed: display only user ID */}
          <div className="px-6 pb-4 flex items-center gap-3">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-gray-400 text-sm truncate">
              {userId}
            </div>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 border font-semibold rounded-lg transition duration-200 ${
                copied
                  ? 'bg-green-400/30 border-green-400/50 text-green-200'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
              }`}
            >
              {copied ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        </header>

        <main className="p-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard title="Total Groups" value={groups.length} />
            <StatCard title="Total Members" value={uniqueMembers.size} />
          </section>

          <section className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">Your Groups</h2>
              </div>
              <Link href="/groups/create" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                + New Group
              </Link>
            </div>

            {groups.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="text-gray-500 text-5xl mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 text-lg">No groups yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <GroupCard
                    key={group._id}
                    group={group}
                    onOpen={() => router.push(`/groups/${group._id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

interface GroupCardProps {
  group: Group;
  onOpen: () => void;
}

function GroupCard({ group, onOpen }: GroupCardProps) {
  return (
    <button
      onClick={onOpen}
      className="group text-left backdrop-blur-md bg-white/10 border border-white/20 hover:border-white/40 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 group-hover:from-purple-500/50 group-hover:to-blue-500/50 transition">
          <FaUsers className="text-purple-300 text-lg" />
        </div>
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition">
          {group.name || "Untitled Group"}
        </h3>
      </div>
      <p className="text-sm text-gray-400">
        {(group.members || []).length} {(group.members || []).length === 1 ? "member" : "members"}
      </p>
    </button>
  );
}

interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 hover:border-white/40 rounded-xl p-6 shadow-lg transition-all duration-300 group hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-blue-500/30">
      <h4 className="text-gray-400 text-sm font-medium mb-2">{title}</h4>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  );
}