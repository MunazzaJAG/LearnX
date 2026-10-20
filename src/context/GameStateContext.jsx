import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import { soundEngine } from "../utils/audio";
import { LEVELS_DATA } from "../data/curriculum";
import { supabase } from "../lib/supabaseClient";

const GameStateContext = createContext(null);

const STORAGE_KEY = "learnx_game_state_v1";

const INITIAL_STATE = {
  activeView: "dashboard",
  currentMissionId: 2,
  completedMissions: [1],
  xp: 50,
  streakDays: 2,
  badges: ["first_line"],

  badgeDates: {
    first_line: "2026-09-09",
  },

  profile: {
    name: "Alex",
    email: "alex@nexa.dev",
    studentId: "NEXA-001",
    role: "Aspiring Developer",
    level: 2,
    avatarInitials: "AL",
  },

  expeditionLog: [
    {
      id: 1,
      title: "First Day",
      date: "2026-09-09",
      xp: 50,
    },
  ],

  soundEnabled: true,
  filterBiome: "all",

  underseaProgress: {
    completedSublevels: [],
    currentSublevel: 1,
    restorationPercent: 0,
    diverCustomization: {
      suitColor: "#1b8a7a",
      accentColor: "#52e3c2",
      visorColor: "#20d3d3",
      tankColor: "#e2e8f0",
      finsColor: "#0f766e",
    },
    unlockedEquipment: [],
    collectibles: [],
  },
};

export function GameStateProvider({ children }) {
  // -----------------------------
  // Authentication State
  // -----------------------------

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // -----------------------------
  // Main Game State
  // -----------------------------

  const [state, setState] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          profile: {
            ...INITIAL_STATE.profile,
            ...(parsed.profile || {}),
          },
          underseaProgress: {
            ...INITIAL_STATE.underseaProgress,
            ...(parsed.underseaProgress || {}),
          },
        };
      }
    } catch (e) {
      console.warn("Failed to read local game state:", e);
    }
    return INITIAL_STATE;
  });

  // Prevents saving before Supabase
  // data has finished loading.
  const hydratedUserId = useRef(null);

  // Prevents unnecessary overlapping saves.
  const saveTimer = useRef(null);

  // -----------------------------
  // Check Supabase Session
  // -----------------------------

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;

        const sessionData = {
          id: user.id,
          name: user.user_metadata?.name || "LearnX User",
          email: user.email,
          role:
            user.user_metadata?.role ||
            "Aspiring Developer",
          studentId:
            user.user_metadata?.studentId || "",
        };

        setCurrentUser(sessionData);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        hydratedUserId.current = null;
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const user = session.user;

          const sessionData = {
            id: user.id,
            name:
              user.user_metadata?.name ||
              "LearnX User",
            email: user.email,
            role:
              user.user_metadata?.role ||
              "Aspiring Developer",
            studentId:
              user.user_metadata?.studentId || "",
          };

          setCurrentUser(sessionData);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
          hydratedUserId.current = null;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // -----------------------------
  // LOAD GAME STATE FROM SUPABASE
  // -----------------------------

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    let cancelled = false;

    const loadGameState = async () => {
      console.log(
        "Loading LearnX progress for:",
        currentUser.email
      );

      const { data, error } = await supabase
        .from("game_progress")
        .select("game_state")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(
          "Failed to load game progress:",
          error
        );

        // Allow the application to work even if
        // Supabase loading fails.
        hydratedUserId.current = currentUser.id;
        return;
      }

      if (data?.game_state) {
        console.log(
          "Existing LearnX progress loaded."
        );

        setState({
          ...INITIAL_STATE,
          ...data.game_state,
          profile: {
            ...INITIAL_STATE.profile,
            ...(data.game_state.profile || {}),
          },
        });
      } else {
        console.log(
          "No saved progress found. Creating new progress."
        );

        setState({
          ...INITIAL_STATE,

          profile: {
            ...INITIAL_STATE.profile,

            name:
              currentUser.name ||
              "LearnX User",

            email:
              currentUser.email ||
              "",

            studentId:
              currentUser.studentId ||
              "NEXA-001",

            role:
              currentUser.role ||
              "Aspiring Developer",

            avatarInitials:
              (currentUser.name || "LU")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .toUpperCase()
                .slice(0, 2),
          },
        });
      }

      // Only start saving AFTER loading is finished.
      hydratedUserId.current = currentUser.id;
    };

    loadGameState();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  // -----------------------------
  // KEEP SOUND ENGINE IN SYNC
  // -----------------------------

  useEffect(() => {
    soundEngine.enabled = state.soundEnabled;
  }, [state.soundEnabled]);

  // -----------------------------
  // SAVE GAME STATE TO SUPABASE
  // -----------------------------

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    // Don't save until this user's data
    // has finished loading.
    if (hydratedUserId.current !== currentUser.id) {
      return;
    }

    // Clear previous pending save.
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    // Small delay so multiple quick state changes
    // don't create many database requests.
    saveTimer.current = setTimeout(async () => {
      const { error } = await supabase
        .from("game_progress")
        .upsert(
          {
            user_id: currentUser.id,
            game_state: state,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (error) {
        console.error(
          "Failed to save game progress:",
          error
        );
      } else {
        console.log(
          "LearnX progress saved to Supabase."
        );
      }
    }, 500);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [state, currentUser]);

  // -----------------------------
  // LOCAL BACKUP
  // -----------------------------

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch (e) {
      console.warn(
        "Failed to write local backup:",
        e
      );
    }
  }, [state]);

  // -----------------------------
  // SYNC PROFILE
  // -----------------------------

  useEffect(() => {
    if (currentUser && currentUser.name) {
      const initials =
        currentUser.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "AL";

      setState((prev) => ({
        ...prev,

        profile: {
          ...prev.profile,
          name: currentUser.name,
          email: currentUser.email,
          studentId:
            currentUser.studentId ||
            prev.profile.studentId,
          role:
            currentUser.role ||
            prev.profile.role,
          avatarInitials: initials,
        },
      }));
    }
  }, [currentUser]);

  // -----------------------------
  // LOGIN - SUPABASE
  // -----------------------------

  const login = async (email, password) => {
    const cleanEmail = (email || "")
      .trim()
      .toLowerCase();

    const cleanPass = (password || "").trim();

    if (!cleanEmail || !cleanPass) {
      return {
        success: false,
        error: "Please enter email and password.",
      };
    }

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Login failed. Please try again.",
        };
      }

      const user = data.user;

      const sessionData = {
        id: user.id,
        name:
          user.user_metadata?.name ||
          "LearnX User",
        email: user.email,
        role:
          user.user_metadata?.role ||
          "Aspiring Developer",
        studentId:
          user.user_metadata?.studentId || "",
      };

      setCurrentUser(sessionData);
      setIsAuthenticated(true);

      soundEngine.playClick();

      return {
        success: true,
      };
    } catch (e) {
      console.error("Login error:", e);

      return {
        success: false,
        error:
          "Something went wrong during login.",
      };
    }
  };

  // -----------------------------
  // SIGNUP - SUPABASE
  // -----------------------------

  const signup = async ({
    name,
    email,
    password,
  }) => {
    const cleanName = (name || "").trim();

    const cleanEmail = (email || "")
      .trim()
      .toLowerCase();

    const cleanPass = (password || "").trim();

    if (!cleanName) {
      return {
        success: false,
        error: "Please enter your name.",
      };
    }

    if (!cleanEmail.includes("@")) {
      return {
        success: false,
        error:
          "Please enter a valid email address.",
      };
    }

    if (cleanPass.length < 6) {
      return {
        success: false,
        error:
          "Password must be at least 6 characters.",
      };
    }

    try {
      const studentId = `NEXA-${Math.floor(
        100 + Math.random() * 900
      )}`;

      const { data, error } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPass,

          options: {
            data: {
              name: cleanName,
              role: "Aspiring Developer",
              studentId: studentId,
            },
          },
        });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user && data.session) {
        const sessionData = {
          id: data.user.id,
          name: cleanName,
          email: cleanEmail,
          role: "Aspiring Developer",
          studentId: studentId,
        };

        setCurrentUser(sessionData);
        setIsAuthenticated(true);

        soundEngine.playVictory();

        return {
          success: true,
        };
      }

      return {
        success: true,
        message:
          "Account created! Please check your email to confirm your account.",
      };
    } catch (e) {
      console.error("Signup error:", e);

      return {
        success: false,
        error:
          "Something went wrong during signup.",
      };
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------

  const logout = async () => {
    soundEngine.playClick();

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Logout error:", e);
    }

    hydratedUserId.current = null;

    setCurrentUser(null);
    setIsAuthenticated(false);
    setState(INITIAL_STATE);
  };

  // -----------------------------
  // NAVIGATION
  // -----------------------------

  const navigateTo = (
    view,
    missionId = null
  ) => {
    soundEngine.playClick();

    setState((prev) => ({
      ...prev,

      activeView: view,

      ...(missionId
        ? {
            currentMissionId: missionId,
          }
        : {}),
    }));
  };

  // -----------------------------
  // SELECT MISSION
  // -----------------------------

  const selectMission = (missionId) => {
    setState((prev) => ({
      ...prev,
      currentMissionId: missionId,
    }));
  };

  // -----------------------------
  // FILTER BIOME
  // -----------------------------

  const setFilterBiome = (biomeKey) => {
    soundEngine.playClick();

    setState((prev) => ({
      ...prev,
      filterBiome: biomeKey,
    }));
  };

  // -----------------------------
  // SOUND
  // -----------------------------

  const toggleSound = () => {
    setState((prev) => {
      const nextVal = !prev.soundEnabled;

      soundEngine.enabled = nextVal;

      if (nextVal) {
        soundEngine.playClick();
      }

      return {
        ...prev,
        soundEnabled: nextVal,
      };
    });
  };

  // -----------------------------
  // UPDATE PROFILE
  // -----------------------------

  const updateProfile = ({
    name,
    studentId,
  }) => {
    const cleanName =
      (name || "").trim() || "Alex";

    const cleanStudentId =
      (studentId || "").trim() ||
      "NEXA-001";

    const initials =
      cleanName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "AL";

    setState((prev) => ({
      ...prev,

      profile: {
        ...prev.profile,
        name: cleanName,
        studentId: cleanStudentId,
        avatarInitials: initials,
      },
    }));

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: cleanName,
        studentId: cleanStudentId,
      };

      setCurrentUser(updatedUser);

      supabase.auth
        .updateUser({
          data: {
            name: cleanName,
            studentId: cleanStudentId,
          },
        })
        .catch((error) => {
          console.warn(
            "Failed to update Supabase profile:",
            error
          );
        });
    }
  };

  // -----------------------------
  // COMPLETE MISSION
  // -----------------------------

  const completeMission = (
    missionId,
    rewardXP,
    badgeObj
  ) => {
    const mission = LEVELS_DATA.find(
      (m) => m.level === missionId
    );

    const today = new Date()
      .toISOString()
      .split("T")[0];

    setState((prev) => {
      const alreadyCompleted =
        prev.completedMissions.includes(
          missionId
        );

      const newCompleted = alreadyCompleted
        ? prev.completedMissions
        : [
            ...prev.completedMissions,
            missionId,
          ];

      const newXP = alreadyCompleted
        ? prev.xp
        : prev.xp + rewardXP;

      let newBadges = [...prev.badges];

      let newBadgeDates = {
        ...prev.badgeDates,
      };

      if (
        badgeObj &&
        !newBadges.includes(badgeObj.id)
      ) {
        newBadges.push(badgeObj.id);
        newBadgeDates[badgeObj.id] = today;
      }

      const newLog = alreadyCompleted
        ? prev.expeditionLog
        : [
            ...prev.expeditionLog,
            {
              id: missionId,
              title:
                mission?.title ||
                `Mission ${missionId}`,
              date: today,
              xp: rewardXP,
            },
          ];

      const nextMissionId = Math.min(
        12,
        missionId + 1
      );

      return {
        ...prev,

        completedMissions: newCompleted,
        xp: newXP,
        badges: newBadges,
        badgeDates: newBadgeDates,
        expeditionLog: newLog,
        currentMissionId: nextMissionId,
      };
    });
  };

  // -----------------------------
  // COMPLETE UNDERSEA SUBLEVEL
  // -----------------------------

  const completeUnderseaSublevel = ({
    sublevelNum,
    rewardXP = 50,
    equipmentUnlock = null,
    badgeUnlock = null,
    restorationDelta = 8,
  }) => {
    const today = new Date().toISOString().split("T")[0];

    setState((prev) => {
      const currentUndersea = prev.underseaProgress || {
        completedSublevels: [],
        currentSublevel: 1,
        restorationPercent: 0,
        diverCustomization: {
          suitColor: "#1b8a7a",
          accentColor: "#52e3c2",
          visorColor: "#20d3d3",
          tankColor: "#e2e8f0",
          finsColor: "#0f766e",
        },
        unlockedEquipment: [],
        collectibles: [],
      };

      const alreadyCompleted =
        currentUndersea.completedSublevels.includes(sublevelNum);

      const newCompleted = alreadyCompleted
        ? currentUndersea.completedSublevels
        : [...currentUndersea.completedSublevels, sublevelNum].sort((a, b) => a - b);

      const newXP = alreadyCompleted ? prev.xp : prev.xp + rewardXP;

      // Badges
      let newBadges = [...prev.badges];
      let newBadgeDates = { ...prev.badgeDates };
      if (badgeUnlock && !newBadges.includes(badgeUnlock.id)) {
        newBadges.push(badgeUnlock.id);
        newBadgeDates[badgeUnlock.id] = today;
      }

      // Equipment
      let newEquipment = [...currentUndersea.unlockedEquipment];
      if (
        equipmentUnlock &&
        !newEquipment.some((e) => e.id === equipmentUnlock.id)
      ) {
        newEquipment.push(equipmentUnlock);
      }

      // Restoration: each sublevel contributes directly to 100% total
      const newRestoration = Math.min(100, Math.round((newCompleted.length / 6) * 100));

      // Advance current sublevel monotonically
      const nextSublevel = Math.min(6, Math.max(currentUndersea.currentSublevel || 1, sublevelNum + 1));

      // Also mark mission 1 complete in overall progression when all 6 Undersea sublevels are finished
      let newCompletedMissions = [...prev.completedMissions];
      if (newCompleted.length >= 6 && !newCompletedMissions.includes(1)) {
        newCompletedMissions.push(1);
      }

      const newLog = alreadyCompleted
        ? prev.expeditionLog
        : [
            ...prev.expeditionLog,
            {
              id: `reef_${sublevelNum}`,
              title: `Undersea Reef - Sublevel ${sublevelNum}`,
              date: today,
              xp: rewardXP,
            },
          ];

      return {
        ...prev,
        xp: newXP,
        badges: newBadges,
        badgeDates: newBadgeDates,
        expeditionLog: newLog,
        completedMissions: newCompletedMissions,
        underseaProgress: {
          ...currentUndersea,
          completedSublevels: newCompleted,
          currentSublevel: nextSublevel,
          restorationPercent: newRestoration,
          unlockedEquipment: newEquipment,
        },
      };
    });
  };

  // -----------------------------
  // UPDATE DIVER CUSTOMIZATION
  // -----------------------------

  const updateDiverCustomization = (customization) => {
    setState((prev) => ({
      ...prev,
      underseaProgress: {
        ...(prev.underseaProgress || {}),
        diverCustomization: {
          ...((prev.underseaProgress &&
            prev.underseaProgress.diverCustomization) ||
            {}),
          ...customization,
        },
      },
    }));
  };

  // -----------------------------
  // RESET PROGRESS
  // -----------------------------

  const resetProgress = () => {
    soundEngine.playClick();

    setState({
      ...INITIAL_STATE,

      profile: {
        ...INITIAL_STATE.profile,

        name:
          currentUser?.name ||
          INITIAL_STATE.profile.name,

        email:
          currentUser?.email ||
          INITIAL_STATE.profile.email,

        studentId:
          currentUser?.studentId ||
          INITIAL_STATE.profile.studentId,

        role:
          currentUser?.role ||
          INITIAL_STATE.profile.role,

        avatarInitials:
          currentUser?.name
            ?.split(" ")
            .map((p) => p[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ||
          INITIAL_STATE.profile.avatarInitials,
      },
    });
  };

  // -----------------------------
  // PROVIDER
  // -----------------------------

  return (
    <GameStateContext.Provider
      value={{
        ...state,

        isAuthenticated,
        currentUser,

        login,
        signup,
        logout,

        navigateTo,
        selectMission,
        setFilterBiome,
        toggleSound,
        updateProfile,
        completeMission,
        completeUnderseaSublevel,
        updateDiverCustomization,
        resetProgress,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);

  if (!ctx) {
    throw new Error(
      "useGameState must be used within GameStateProvider"
    );
  }

  return ctx;
}