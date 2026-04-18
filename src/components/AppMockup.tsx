import React from 'react';

export const AppMockup = () => {
  return (
    <div className="relative z-10 w-full max-w-[1200px] px-6 py-20">
      <div className="relative flex items-center justify-center">
        {/* Central Mockup */}
        <div className="relative z-20 w-[320px] h-[640px] bg-[#1a1a1a] rounded-[48px] border-[8px] border-neutral-800 shadow-2xl overflow-hidden p-6 font-google">
          {/* Phone Top Bar */}
          <div className="flex justify-between items-center mb-8 px-2">
            <span className="text-white text-[11px] font-bold">Mon, 07:32</span>
            <div className="w-14 h-5 bg-black rounded-full" />
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-white/10" />
              <div className="w-4 h-4 rounded-full bg-white/10" />
            </div>
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-1 font-stack">Today Task</h2>
          <p className="text-white/40 text-xs mb-8">3 of 8 habits done</p>

          {/* Habit Cards */}
          <div className="space-y-4">
            {[
              { title: "Morning walk", time: "At least 15 minutes", progress: "85%", color: "bg-orange-400", subColor: "bg-orange-400/20", checked: false },
              { title: "Drink 3 glasses of water", time: "Before 11:00 am", progress: "100%", color: "bg-emerald-400", subColor: "bg-emerald-400/20", checked: true },
              { title: "Read 10 pages", time: "Evening focus block", progress: "67%", color: "bg-cyan-400", subColor: "bg-cyan-400/20", checked: false },
            ].map((habit, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center ${habit.checked ? 'bg-emerald-400 border-none' : ''}`}>
                    {habit.checked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold">{habit.title}</h4>
                    <p className="text-white/40 text-[10px]">{habit.time}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-white/60 text-[9px] font-medium">{habit.progress}</span>
                  <div className={`w-12 h-1 ${habit.subColor} rounded-full overflow-hidden`}>
                    <div className={`h-full ${habit.color}`} style={{ width: habit.progress }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Card */}
          <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/60 text-xs font-bold uppercase tracking-wider">This week</span>
              <div className="flex gap-1 items-end h-6">
                {[4, 7, 5, 8, 4, 6, 9].map((h, i) => (
                  <div key={i} className="w-1.5 bg-emerald-400/60 rounded-full" style={{ height: `${h * 2}px` }} />
                ))}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white text-base font-bold">21 check-ins</p>
                <p className="text-emerald-400 text-[10px] font-bold">+42% vs last week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Floating Card */}
        <div className="absolute left-8 md:left-32 top-[40%] z-10 w-[200px] p-6 bg-[#1a1a1a]/90 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl hidden lg:block transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-orange-500/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 15l-2 3h4l-2-3zM12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z" />
            </svg>
          </div>
          <p className="text-white font-bold text-base text-center font-stack leading-tight">7-day streak <br /> unlocked</p>
        </div>

        {/* Right Floating Card */}
        <div className="absolute right-8 md:right-32 top-[55%] z-10 w-[200px] p-6 bg-[#1a1a1a]/90 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl hidden lg:block transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <p className="text-white/60 text-[11px] font-bold text-center mb-6 uppercase tracking-wider">Today's goal: <br /> Complete 3 habits</p>
          <div className="flex justify-center gap-3">
            {[
              { p: 65, icon: "🏃" },
              { p: 87, icon: "🧹" },
              { p: 94, icon: "📵" }
            ].map((item, i) => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5" style={{ top: `${100 - item.p}%` }} />
                <span className="text-white text-lg relative z-10">{item.icon}</span>
                <div className="absolute inset-0 border-2 border-emerald-400 rounded-full clip-path-progress" style={{ clipPath: `inset(${100 - item.p}% 0 0 0)` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Top-Right Label */}
        <div className="absolute right-12 md:right-24 top-[30%] z-30 bg-white px-4 py-2 rounded-xl shadow-2xl hidden md:flex items-center gap-3 transform -rotate-6">
          <span className="text-black text-xs font-bold uppercase tracking-tight">Get it for FREE</span>
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
