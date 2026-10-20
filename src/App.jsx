import React from "react";
import { GameStateProvider, useGameState } from "./context/GameStateContext";
import { Sidebar } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import { DashboardView } from "./views/DashboardView";
import { QuestMapView } from "./views/QuestMapView";
import { MissionLabView } from "./views/MissionLabView";
import { AchievementsView } from "./views/AchievementsView";
import { ProfileView } from "./views/ProfileView";
import { AuthView } from "./views/AuthView";

import { UnderseaReefView } from "./views/UnderseaReefView";
import { Level1JumpingGameView } from "./views/Level1JumpingGameView";
import { UnderseaMissionView } from "./views/UnderseaMissionView";
import { EcoWoodsView } from "./views/EcoWoodsView";
import { EcoWoodsMissionView } from "./views/EcoWoodsMissionView";
import { EcoWoods3DView } from "./views/EcoWoods3DView";

function MainContent() {
  const { activeView, currentMissionId, completedMissions } = useGameState();

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "quest_map":
        return <QuestMapView />;
      case "undersea_reef":
        return <UnderseaReefView />;
      case "level1_game":
        return <Level1JumpingGameView />;
      case "eco_woods":
        return <EcoWoodsView />;
      case "living_forest":
      case "eco_woods_3d":
        return <EcoWoods3DView />;
      case "mission_lab":
        if (currentMissionId === 1) {
          return <Level1JumpingGameView />;
        }
        if (currentMissionId === 2) {
          return <UnderseaReefView />;
        }
        if (currentMissionId === 3) {
          return <EcoWoodsView />;
        }
        if (currentMissionId === 4) {
          return <EcoWoods3DView />;
        }
        return <MissionLabView />;
      case "achievements":
        return <AchievementsView />;
      case "profile":
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-x-hidden bg-[#F8F9F5]">
      <TopHeader />
      <main className={`flex-1 ${activeView === "undersea_reef" || activeView === "living_forest" || activeView === "eco_woods_3d" ? "pb-0 overflow-hidden" : "pb-16"}`}>
        {renderView()}
      </main>
    </div>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, activeView, currentMissionId } = useGameState();

  if (!isAuthenticated) {
    return <AuthView />;
  }

  // True Full-Screen 3D Game Mode for Undersea Reef & Living Forest 3D exploration
  if (activeView === "undersea_reef") {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#031525] z-50">
        <UnderseaReefView />
      </div>
    );
  }

  if (activeView === "eco_woods" || (activeView === "mission_lab" && currentMissionId === 3)) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#07160f] z-50">
        <EcoWoodsView />
      </div>
    );
  }

  if (activeView === "living_forest" || activeView === "eco_woods_3d" || (activeView === "mission_lab" && currentMissionId === 4)) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#07160f] z-50">
        <EcoWoods3DView />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9F5]">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <AuthenticatedApp />
    </GameStateProvider>
  );
}
