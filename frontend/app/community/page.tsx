'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  MessageSquare,
  Heart,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flame,
} from 'lucide-react';

// --- TYPES ---
interface Comment {
  id: number;
  user: string;
  text: string;
}

interface Post {
  id: number;
  user: string;
  content: string;
  likes: number;
  time: string;
  avatar: string;
  isLiked: boolean;
  comments: Comment[];
}

export default function CommunityPage() {
  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState('feed');

  // --- FEED & COMMENT STATE ---
  const [newPostContent, setNewPostContent] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(
    null
  );
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Initialize with explicit Post[] type
  // --- DEFAULT POSTS (SSR-safe) ---
  const defaultPosts: Post[] = [
    {
      id: 1,
      user: 'Alex Miller',
      content: 'Just hit a new PR on Bench Press! 100kg feeling light! 🔥',
      likes: 12,
      time: '2h ago',
      avatar: 'AM',
      isLiked: false,
      comments: [{ id: 101, user: 'Sarah', text: 'Monster lift! 💪' }],
    },
    {
      id: 2,
      user: 'Sarah Chen',
      content:
        "Completed the 'Early Bird' 5k challenge this morning. Who else is in?",
      likes: 24,
      time: '5h ago',
      avatar: 'SC',
      isLiked: false,
      comments: [],
    },
    {
      id: 3,
      user: 'Mike Ross',
      content: 'Consistency is key. 30 days straight in the gym!',
      likes: 8,
      time: '6h ago',
      avatar: 'MR',
      isLiked: false,
      comments: [],
    },
    {
      id: 4,
      user: 'Emma Wilson',
      content: 'New yoga flow felt amazing today. Flexibility is improving!',
      likes: 15,
      time: '8h ago',
      avatar: 'EW',
      isLiked: false,
      comments: [],
    },
    {
      id: 5,
      user: 'David Goggins',
      content: 'Stay hard! 20 mile run done before sunrise.',
      likes: 102,
      time: '10h ago',
      avatar: 'DG',
      isLiked: false,
      comments: [
        { id: 102, user: 'Marcus', text: 'Who’s gonna carry the boats?!' },
      ],
    },
    {
      id: 6,
      user: 'John Doe',
      content: 'Trying out a new meal prep strategy this week.',
      likes: 4,
      time: '12h ago',
      avatar: 'JD',
      isLiked: false,
      comments: [],
    },
  ];

  // --- STATE ---
const [posts, setPosts] = useState<Post[]>(defaultPosts);

// --- LOAD FROM LOCALSTORAGE AFTER MOUNT ---
useEffect(() => {
  const loadPosts = () => {
    try {
      // Guard against server-side rendering
      if (typeof window === 'undefined') return;

      const saved = window.localStorage.getItem('nexus_community_posts');
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setPosts(parsed);
      }
    } catch (e) {
      console.error('Failed to load posts from localStorage', e);
    }
  };

  loadPosts();
}, []);

// Save data whenever posts change
useEffect(() => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('nexus_community_posts', JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts', e);
  }
}, [posts]);


  // --- CHALLENGES STATE ---
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: 'Morning Cardio',
      participants: 1240,
      daysLeft: 3,
      progress: 65,
      isJoined: false,
      difficulty: 'Medium',
      category: 'Endurance',
    },
    {
      id: 2,
      title: 'No Sugar Week',
      participants: 850,
      daysLeft: 5,
      progress: 40,
      isJoined: true,
      difficulty: 'Hard',
      category: 'Nutrition',
    },
    {
      id: 3,
      title: '100 Pushups/Day',
      participants: 2100,
      daysLeft: 12,
      progress: 15,
      isJoined: false,
      difficulty: 'Expert',
      category: 'Strength',
    },
    {
      id: 4,
      title: 'Daily Meditation',
      participants: 530,
      daysLeft: 2,
      progress: 90,
      isJoined: false,
      difficulty: 'Easy',
      category: 'Mindset',
    },
  ]);

  // --- LOGIC: PAGINATION ---
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // --- HANDLERS ---
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      user: 'You',
      content: newPostContent,
      likes: 0,
      time: 'Just now',
      avatar: 'YOU',
      isLiked: false,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setCurrentPage(1);
  };

  const handleAddComment = (postId: number) => {
    if (!commentText.trim()) return;
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...(post.comments || []),
              { id: Date.now(), user: 'You', text: commentText },
            ],
          };
        }
        return post;
      })
    );
    setCommentText('');
    setActiveCommentPostId(null);
  };

  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const toggleChallenge = (id: number) => {
    setChallenges(
      challenges.map((c) =>
        c.id === id
          ? {
              ...c,
              isJoined: !c.isJoined,
              participants: c.isJoined
                ? c.participants - 1
                : c.participants + 1,
            }
          : c
      )
    );
  };

  const joinedCount = challenges.filter((c) => c.isJoined).length;

  // --- LEADERBOARD LOGIC ---
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const leaderboardData = [
    { name: 'Marcus Thorne', points: '15,240', rank: 1 },
    { name: 'Elena Rodriguez', points: '14,890', rank: 2 },
    { name: 'Jaxson Vane', points: '13,100', rank: 3 },
    { name: 'Sarah Jenkins', points: '11,450', rank: 4 },
    { name: 'Leo Kwong', points: '9,800', rank: 5 },
    { name: 'Mila Volkov', points: '8,200', rank: 6 },
  ];
  const displayedUsers = showFullLeaderboard
    ? leaderboardData
    : leaderboardData.slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      {/* HEART ANIMATION CSS */}
      <style jsx global>{`
        @keyframes heartPop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-like {
          animation: heartPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.49);
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
            Nexus <span className="text-orange-500">Community</span>
          </h1>
          <p className="text-zinc-500 font-medium italic">
            Push your limits with the global Nexus community.
          </p>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 shadow-2xl">
          {['feed', 'challenges'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'feed' ? (
            <>
              {/* POST INPUT */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 flex items-center gap-4 focus-within:border-orange-500/50 transition-all shadow-xl">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-500 shrink-0 uppercase">
                  YOU
                </div>
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                  placeholder="Share your progress with the tribe..."
                  className="flex-grow bg-transparent border-none outline-none text-sm font-medium text-white placeholder:text-zinc-600"
                />
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="p-4 bg-orange-600 rounded-2xl hover:bg-orange-500 transition shadow-lg disabled:opacity-30 active:scale-95"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* FEED LIST */}
              <div className="space-y-6">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-zinc-700 transition-all animate-in fade-in slide-in-from-bottom-4"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-zinc-700">
                          {post.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{post.user}</h4>
                          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                            {post.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed mb-6 text-lg">
                      {post.content}
                    </p>

                    <div className="flex flex-col gap-4 border-t border-zinc-800 pt-6">
                      <div className="flex gap-6">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 transition-colors font-bold text-xs ${
                            post.isLiked
                              ? 'text-orange-500'
                              : 'text-zinc-500 hover:text-orange-500'
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={post.isLiked ? 'currentColor' : 'none'}
                            className={post.isLiked ? 'animate-like' : ''}
                          />
                          {post.likes}
                        </button>
                        <button
                          onClick={() =>
                            setActiveCommentPostId(
                              activeCommentPostId === post.id ? null : post.id
                            )
                          }
                          className={`flex items-center gap-2 transition font-bold text-xs ${
                            activeCommentPostId === post.id
                              ? 'text-white'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          <MessageSquare size={18} />{' '}
                          {post.comments.length > 0
                            ? `${post.comments.length} Comments`
                            : 'Comment'}
                        </button>
                      </div>

                      {/* COMMENTS LIST */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-black/30 rounded-2xl p-4 border border-zinc-800/50 animate-in fade-in slide-in-from-left-2"
                            >
                              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
                                {comment.user}
                              </p>
                              <p className="text-sm text-zinc-400 font-medium">
                                {comment.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* COMMENT INPUT BOX */}
                      {activeCommentPostId === post.id && (
                        <div className="flex gap-3 animate-in zoom-in-95 duration-200">
                          <input
                            autoFocus
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleAddComment(post.id)
                            }
                            placeholder="Write a comment..."
                            className="flex-grow bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-orange-500 transition-colors"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="bg-orange-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 transition"
                          >
                            Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8 pb-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 transition hover:border-zinc-500"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold text-xs transition ${
                        currentPage === i + 1
                          ? 'bg-orange-600 text-white'
                          : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 transition hover:border-zinc-500"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* CHALLENGES VIEW */
            <div className="space-y-8 animate-in fade-in">
              <div className="bg-orange-600/10 border border-orange-500/20 p-8 rounded-[2.5rem] flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">
                    Active Missions
                  </h2>
                  <p className="text-orange-500/70 font-bold text-sm">
                    You are deployed in {joinedCount} challenges
                  </p>
                </div>
                <div className="bg-orange-500 text-black w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl">
                  {joinedCount}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((c) => (
                  <div
                    key={c.id}
                    className={`bg-zinc-900 border transition-all duration-500 rounded-[2.5rem] p-8 group relative overflow-hidden ${
                      c.isJoined
                        ? 'border-orange-500'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {c.isJoined && (
                      <div className="absolute top-0 right-0 bg-orange-500 text-black text-[10px] font-black px-6 py-2 rounded-bl-3xl uppercase">
                        Active
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                          c.isJoined
                            ? 'bg-orange-500 text-black'
                            : 'bg-zinc-800 text-orange-500'
                        }`}
                      >
                        {c.isJoined ? (
                          <CheckCircle2 size={28} />
                        ) : (
                          <Trophy size={28} />
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-black/40 px-3 py-1 rounded-full border border-zinc-800">
                        {c.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-2 tracking-tight">
                      {c.title}
                    </h3>
                    <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold mb-6">
                      <div className="flex items-center gap-1">
                        <Users size={14} /> {c.participants.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame size={14} className="text-orange-500" />{' '}
                        {c.difficulty}
                      </div>
                    </div>
                    <div className="space-y-3 mb-8">
                      <div className="w-full bg-black h-2 rounded-full border border-zinc-800 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full transition-all duration-1000"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-black ${
                          c.daysLeft <= 3
                            ? 'text-red-500 animate-pulse'
                            : 'text-zinc-400'
                        }`}
                      >
                        {c.daysLeft} Days Left
                      </span>
                      <button
                        onClick={() => toggleChallenge(c.id)}
                        className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          c.isJoined
                            ? 'bg-zinc-800 text-zinc-400 hover:text-red-500'
                            : 'bg-white text-black hover:bg-orange-500 hover:text-white'
                        }`}
                      >
                        {c.isJoined ? 'Leave' : 'Join'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR - DYNAMIC LEADERBOARD */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 sticky top-8 transition-all duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <Trophy size={16} className="text-orange-500" /> Leaderboard
              </h3>
              {showFullLeaderboard && (
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest animate-pulse">
                  Live
                </span>
              )}
            </div>

            <div className="space-y-6">
              {displayedUsers.map((user) => (
                <div
                  key={user.rank}
                  className="flex justify-between items-center group animate-in fade-in slide-in-from-right-4 duration-300"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-black w-5 ${
                        user.rank === 1
                          ? 'text-orange-500'
                          : user.rank === 2
                          ? 'text-zinc-400'
                          : 'text-zinc-600'
                      }`}
                    >
                      {user.rank}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm group-hover:text-orange-500 transition-colors">
                        {user.name}
                      </span>
                      {showFullLeaderboard && (
                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-tighter">
                          Athlete
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-black text-zinc-400 bg-black/40 px-3 py-1 rounded-lg border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                    {user.points}{' '}
                    <span className="text-[8px] text-zinc-600">XP</span>
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
              className={`w-full mt-8 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                showFullLeaderboard
                  ? 'border-orange-500 text-orange-500 bg-orange-500/5'
                  : 'border-zinc-800 text-zinc-500 hover:border-orange-500 hover:text-white'
              }`}
            >
              {showFullLeaderboard ? 'Close Rankings' : 'View Full Board'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
