import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// In-memory fallback storage for WebView edge cases
let memoryStorage = {};

// Safe storage adapter with optimized error handling
const safeStorage = {
  getItem: (name) => {
    if (typeof window !== 'undefined') {
      try {
        const value = window.localStorage.getItem(name);
        if (value !== null) {
          return value;
        }
      } catch (e) {
        // Silent fallback to memory storage
      }
      // Fallback to memory storage
      return memoryStorage[name] || null;
    }
    return null;
  },
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(name, value);
      } catch (e) {
        // Fallback to memory storage
        memoryStorage[name] = value;
      }
    } else {
      memoryStorage[name] = value;
    }
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(name);
      } catch (e) {
        // Silent error handling
      }
      delete memoryStorage[name];
    } else {
      delete memoryStorage[name];
    }
  },
};

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      spaiPoints: 0,
      agentTickets: [],
      agentPasses: [],
      earningtimer: {
        isActive: false,
        timeRemaining: 0,
        startTimestamp: null,
        hasAwardedPoints: false,
      },
      hasCompletedTwitterFollow: false,
      tasks: {
        dailyReward: { completed: false, lastCompleted: null },
        rtPost: { completed: false },
        followX: { completed: false },
        inviteFive: { completed: false },
      },
      invitationCode: null,
      invitedUsers: 0,

      // RandomLotto specific actions
      setUser: (user) => {
        const code = user?.id ? `RL-${user.id}-${Math.random().toString(36).slice(2, 8)}` : null;
        set({ user, invitationCode: code });
      },
      
      addTicket: (ticket) =>
        set((state) => ({
          agentTickets: [...state.agentTickets, ticket]
        })),
      
      addPass: (pass) =>
        set((state) => ({
          agentPasses: [...state.agentPasses, pass]
        })),
      
      addSpaiPoints: (points) =>
        set((state) => ({ spaiPoints: state.spaiPoints + points })),
      
      completeTask: (taskName, points) => {
        const today = new Date().toDateString();
        set((state) => {
          const tasks = { ...state.tasks };
          if (taskName === 'dailyReward') {
            if (tasks.dailyReward.lastCompleted !== today) {
              tasks.dailyReward = { completed: true, lastCompleted: today };
              return { tasks, spaiPoints: state.spaiPoints + points };
            }
          } else if (!tasks[taskName].completed) {
            tasks[taskName] = { completed: true };
            return { tasks, spaiPoints: state.spaiPoints + points };
          }
          return state;
        });
      },
      
      addReferral: () => {
        set((state) => ({
          invitedUsers: state.invitedUsers + 1,
          spaiPoints: state.spaiPoints + 1000
        }));
      },
    }),
    {
      name: 'RandomLotto-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        user: state.user,
        spaiPoints: state.spaiPoints,
        agentTickets: state.agentTickets,
        agentPasses: state.agentPasses,
        earningtimer: state.earningtimer,
        hasCompletedTwitterFollow: state.hasCompletedTwitterFollow,
        tasks: state.tasks,
        invitationCode: state.invitationCode,
        invitedUsers: state.invitedUsers,
      }),
    }
  )
);
