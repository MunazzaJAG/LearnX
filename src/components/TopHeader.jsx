import React from "react";
import { Flame, Zap, Volume2, VolumeX, ChevronRight, LogOut } from "lucide-react";
import { useGameState } from "../context/GameStateContext";

export function TopHeader() {
  const { activeView, navigateTo, xp, streakDays, soundEnabled, toggleSound, profile, currentMissionId, logout } = useGameState();

  const renderBreadcrumbs = () => {
    if (activeView === "dashboard") {
      return <span className="font-semibold text-[#253D32]">Dashboard</span>;
    }
    if (activeView === "quest_map") {
      return <span className="font-semibold text-[#253D32]">The Python Expedition</span>;
    }
    if (activeView === "undersea_reef") {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigateTo("quest_map")}
            className="hover:text-[#172E26] hover:underline transition-colors"
          >
            The Python Expedition
          </button>
          <ChevronRight className="w-3 h-3 text-[#9EB0A5]" />
          <span className="font-semibold text-[#253D32]">Undersea Reef</span>
        </div>
      );
    }
    if (activeView === "eco_woods") {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigateTo("quest_map")}
            className="hover:text-[#172E26] hover:underline transition-colors"
          >
            The Python Expedition
          </button>
          <ChevronRight className="w-3 h-3 text-[#9EB0A5]" />
          <span className="font-semibold text-[#253D32]">Eco Woods</span>
        </div>
      );
    }
    if (activeView === "mission_lab") {
      if (currentMissionId === 1 || currentMissionId === 2) {
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateTo("quest_map")}
              className="hover:text-[#172E26] hover:underline transition-colors"
            >
              The Python Expedition
            </button>
            <ChevronRight className="w-3 h-3 text-[#9EB0A5]" />
            <button
              onClick={() => navigateTo("undersea_reef")}
              className="hover:text-[#172E26] hover:underline transition-colors"
            >
              Undersea Reef
            </button>
            <ChevronRight className="w-3 h-3 text-[#9EB0A5]" />
            <span className="font-semibold text-[#253D32]">
              Mission {currentMissionId}: {currentMissionId === 1 ? "First Day" : "Identity"}
            </span>
          </div>
        );
      }
      if (currentMissionId === 3 || currentMissionId === 4) {
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateTo("quest_map")}
              className="hover:text-[#172E26] hover:underline transition-colors"
            >
              The Python Expedition
            </button>
            <ChevronRight className="w-3 h-3 text-[#9EB0A5]" />
            <button
              onClick={() => navigateTo("eco_woods")}
              className="hover:text-[#172E26] hover:underline transition-colors"
            >
              Eco Woods
            </button>
            <ChevronRight className="w-3 h-3 text-[#9EB0A5]" />
            <span className="font-semibold text-[#253D32]">
              Mission {currentMissionId}: {currentMissionId === 3 ? "Security Gate" : "User Terminal"}
            </span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigateTo("quest_map")}
            className="hover:text-[#172E26] hover:underline transition-colors"
          >
            The Python Expedition
          </button>
          <ChevronRight className="w-3 h-3 text-[#9EB0A5]" />
          <span className="font-semibold text-[#253D32]">Mission {currentMissionId}</span>
        </div>
      );
    }
    if (activeView === "achievements") {
      return <span className="font-semibold text-[#253D32]">Achievements</span>;
    }
    if (activeView === "profile") {
      return <span className="font-semibold text-[#253D32]">My profile</span>;
    }
    return <span className="font-semibold text-[#253D32]">Dashboard</span>;
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of your expedition session?")) {
      logout();
    }
  };

  return (
    <header className="h-16 border-b border-[#E6EDE6] bg-[#F8F9F5] px-8 flex items-center justify-between select-none">
      {/* Breadcrumb trail */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#73877C]">
        <button
          onClick={() => navigateTo("dashboard")}
          className="hover:text-[#172E26] transition-colors"
        >
          Your learning journey
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#9EB0A5]" />
        {renderBreadcrumbs()}
      </div>

      {/* Stats and Profile Badges */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Streak */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#A85822]">
          <Flame className="w-4 h-4 text-[#D96B27] fill-[#D96B27]" />
          <span>{streakDays} day streak</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A6B53]">
          <Zap className="w-4 h-4 text-[#2A6B53] fill-[#2A6B53]" />
          <span>{xp} XP</span>
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? "Mute audio sound effects" : "Enable cozy audio sound effects"}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#687C71] hover:text-[#172E26] hover:bg-[#EEF4F0] transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#98A89F]" />
          )}
        </button>

        {/* User Avatar Circle */}
        <button
          onClick={() => navigateTo("profile")}
          title="View explorer profile"
          className="w-8 h-8 rounded-full bg-[#E8DDD1] text-[#7A5B3D] flex items-center justify-center font-bold text-xs shadow-sm hover:ring-2 hover:ring-[#2A6B53] transition-all"
        >
          {profile.avatarInitials}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Log out of session"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#7C9084] hover:text-[#C55038] hover:bg-[#FDF2F0] transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
