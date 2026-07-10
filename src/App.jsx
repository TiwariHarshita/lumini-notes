import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  supabase,
  isSupabaseConfigured,
} from "./lib/supabase";

import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Modal from "./components/Modal";
import EventForm from "./components/EventForm";

import Overview from "./pages/Overview";
import CalendarPage from "./pages/CalendarPage";
import NotesPage from "./pages/NotesPage";
import FocusPage from "./pages/FocusPage";
import SettingsPage from "./pages/SettingsPage";

const demoUser = {
  id: "demo-user",
  email: "preview@lumina.app",
  user_metadata: {},
};

const initialDemoEvents = [
  {
    id: "e1",
    title: "Project planning",
    event_date: new Date().toISOString().slice(0, 10),
    start_time: "09:30",
    end_time: "10:30",
    color: "plum",
    description:
      "Choose the next milestone and define the first task.",
  },
  {
    id: "e2",
    title: "Study block",
    event_date: new Date().toISOString().slice(0, 10),
    start_time: "15:00",
    end_time: "16:30",
    color: "mint",
    description:
      "Review notes and solve two practice problems.",
  },
  {
    id: "e3",
    title: "Weekly reset",
    event_date: new Date(
      Date.now() + 86400000 * 2
    )
      .toISOString()
      .slice(0, 10),
    start_time: "18:00",
    end_time: "18:30",
    color: "rose",
    description:
      "Clear inbox, review calendar and set priorities.",
  },
];

const initialDemoNotes = [
  {
    id: "n1",
    title: "A simpler weekly reset",
    content:
      "Clear the desk, review open loops, then choose three outcomes for the week.",
    color: "cream",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "n2",
    title: "Project idea",
    content:
      "Build a calm planning system that feels lighter than a full workspace tool.",
    color: "lavender",
    created_at: new Date(
      Date.now() - 86400000
    ).toISOString(),
    updated_at: new Date(
      Date.now() - 86400000
    ).toISOString(),
  },
  {
    id: "n3",
    title: "Books to revisit",
    content:
      "Deep Work, The Creative Act, and Make Time.",
    color: "sage",
    created_at: new Date(
      Date.now() - 172800000
    ).toISOString(),
    updated_at: new Date(
      Date.now() - 172800000
    ).toISOString(),
  },
];

export default function App() {
  const [session, setSession] = useState(null);
  const [demo, setDemo] = useState(false);
  const [demoName, setDemoName] =
    useState("Lumina User");

  const [loading, setLoading] = useState(
    isSupabaseConfigured
  );

  const [active, setActive] =
    useState("overview");

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);

  const [eventModal, setEventModal] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const user = demo
    ? {
        ...demoUser,
        user_metadata: {
          full_name: demoName,
        },
      }
    : session?.user;

  /*
   * Load the current authentication session.
   */
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function getCurrentSession() {
      const { data, error } =
        await supabase.auth.getSession();

      if (error) {
        console.error(
          "Could not load session:",
          error.message
        );
      }

      if (mounted) {
        setSession(data?.session || null);
        setLoading(false);
      }
    }

    getCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * After the user opens the email login link,
   * save the name entered on the login page.
   */
  useEffect(() => {
    if (
      !session?.user ||
      demo ||
      !isSupabaseConfigured
    ) {
      return;
    }

    const pendingName = localStorage.getItem(
      "lumina_pending_name"
    );

    if (!pendingName) {
      return;
    }

    let cancelled = false;

    async function saveUserName() {
      const { data, error } =
        await supabase.auth.updateUser({
          data: {
            full_name: pendingName,
          },
        });

      if (error) {
        console.error(
          "Could not save user name:",
          error.message
        );
        return;
      }

      localStorage.removeItem(
        "lumina_pending_name"
      );

      if (!cancelled && data?.user) {
        setSession((currentSession) => {
          if (!currentSession) {
            return currentSession;
          }

          return {
            ...currentSession,
            user: data.user,
          };
        });
      }
    }

    saveUserName();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, demo]);

  /*
   * Load events and notes after authentication.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    if (demo) {
      setEvents(initialDemoEvents);
      setNotes(initialDemoNotes);
      return;
    }

    loadData();
  }, [user?.id, demo]);

  async function loadData() {
    if (!supabase) {
      return;
    }

    const [
      { data: eventData, error: eventsError },
      { data: noteData, error: notesError },
    ] = await Promise.all([
      supabase
        .from("events")
        .select("*")
        .order("event_date", {
          ascending: true,
        }),

      supabase
        .from("notes")
        .select("*")
        .order("updated_at", {
          ascending: false,
        }),
    ]);

    if (eventsError) {
      console.error(
        "Could not load events:",
        eventsError.message
      );
    }

    if (notesError) {
      console.error(
        "Could not load notes:",
        notesError.message
      );
    }

    setEvents(eventData || []);
    setNotes(noteData || []);
  }

  /*
   * Send a passwordless email login link.
   */
  async function loginWithEmail(name, email) {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      throw new Error("Please enter your name.");
    }

    if (!cleanEmail) {
      throw new Error(
        "Please enter your email address."
      );
    }

    /*
     * When Supabase is not configured,
     * open the local demo using the entered name.
     */
    if (!isSupabaseConfigured) {
      setDemoName(cleanName);
      setDemo(true);
      return;
    }

    /*
     * Store the name temporarily because the page
     * reloads when the email login link is opened.
     */
    localStorage.setItem(
      "lumina_pending_name",
      cleanName
    );

    const { error } =
      await supabase.auth.signInWithOtp({
        email: cleanEmail,

        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: true,

          data: {
            full_name: cleanName,
          },
        },
      });

    if (error) {
      localStorage.removeItem(
        "lumina_pending_name"
      );

      throw error;
    }
  }

  async function signOut() {
    if (demo) {
      setDemo(false);
      setDemoName("Lumina User");
      setEvents([]);
      setNotes([]);
      setActive("overview");
      return;
    }

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Could not sign out:",
        error.message
      );
    }

    setSession(null);
    setEvents([]);
    setNotes([]);
    setActive("overview");
  }

  async function addEvent(payload) {
    if (demo) {
      const newEvent = {
        ...payload,
        id: crypto.randomUUID(),
      };

      setEvents((previousEvents) => [
        ...previousEvents,
        newEvent,
      ]);

      setEventModal(false);
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert({
        ...payload,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Could not create event:",
        error.message
      );
      return;
    }

    if (data) {
      setEvents((previousEvents) => [
        ...previousEvents,
        data,
      ]);
    }

    setEventModal(false);
  }

  async function deleteEvent(id) {
    if (demo) {
      setEvents((previousEvents) =>
        previousEvents.filter(
          (event) => event.id !== id
        )
      );

      return;
    }

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Could not delete event:",
        error.message
      );
      return;
    }

    setEvents((previousEvents) =>
      previousEvents.filter(
        (event) => event.id !== id
      )
    );
  }

  async function createNote(payload) {
    const now = new Date().toISOString();

    if (demo) {
      const newNote = {
        ...payload,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
      };

      setNotes((previousNotes) => [
        newNote,
        ...previousNotes,
      ]);

      return newNote;
    }

    const { data, error } = await supabase
      .from("notes")
      .insert({
        ...payload,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Could not create note:",
        error.message
      );
      return null;
    }

    if (data) {
      setNotes((previousNotes) => [
        data,
        ...previousNotes,
      ]);
    }

    return data;
  }

  async function updateNote(id, changes) {
    const updatedAt = new Date().toISOString();

    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...changes,
              updated_at: updatedAt,
            }
          : note
      )
    );

    if (demo) {
      return;
    }

    const { error } = await supabase
      .from("notes")
      .update({
        ...changes,
        updated_at: updatedAt,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Could not update note:",
        error.message
      );
    }
  }

  async function deleteNote(id) {
    if (!demo) {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(
          "Could not delete note:",
          error.message
        );
        return;
      }
    }

    setNotes((previousNotes) =>
      previousNotes.filter(
        (note) => note.id !== id
      )
    );
  }

  const titles = {
    overview: "Overview",
    calendar: "Calendar",
    notes: "Notes",
    focus: "Focus",
    settings: "Settings",
  };

  const page = useMemo(() => {
    const sharedProperties = {
      month,
      setMonth,
      selectedDate,
      setSelectedDate,
      events,
    };

    if (active === "calendar") {
      return (
        <CalendarPage
          {...sharedProperties}
          onAdd={() => setEventModal(true)}
          onDelete={deleteEvent}
        />
      );
    }

    if (active === "notes") {
      return (
        <NotesPage
          notes={notes}
          search={search}
          onCreate={createNote}
          onUpdate={updateNote}
          onDelete={deleteNote}
        />
      );
    }

    if (active === "focus") {
      return <FocusPage />;
    }

    if (active === "settings") {
      return (
        <SettingsPage
          user={user}
          configured={
            isSupabaseConfigured && !demo
          }
        />
      );
    }

    return (
      <Overview
        {...sharedProperties}
        user={user}
        notes={notes}
        onAddEvent={() =>
          setEventModal(true)
        }
        onOpenNotes={() =>
          setActive("notes")
        }
      />
    );
  }, [
    active,
    month,
    selectedDate,
    events,
    notes,
    search,
    user,
    demo,
  ]);

  /*
   * Command/Ctrl + K focuses the search box.
   */
  useEffect(() => {
    function handleKeyboardShortcut(event) {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k";

      if (!isSearchShortcut) {
        return;
      }

      event.preventDefault();

      document
        .querySelector(".search-box input")
        ?.focus();
    }

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut
      );
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />

        <span>
          Opening your planner...
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginScreen
        onEmailLogin={loginWithEmail}
        demoMode={!isSupabaseConfigured}
        onDemo={(name) => {
          setDemoName(
            name?.trim() || "Lumina User"
          );

          setDemo(true);
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <div
        className={`sidebar-wrap ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <Sidebar
          active={active}
          onChange={(pageName) => {
            setActive(pageName);
            setSidebarOpen(false);
          }}
          user={user}
          onSignOut={signOut}
          onQuickAdd={() =>
            setEventModal(true)
          }
        />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="mobile-overlay"
          aria-label="Close navigation menu"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <main className="main-area">
        <Topbar
          title={titles[active]}
          search={search}
          setSearch={setSearch}
          onMobileMenu={() =>
            setSidebarOpen(true)
          }
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="page-container"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -6,
            }}
            transition={{
              duration: 0.28,
            }}
          >
            {page}
          </motion.div>
        </AnimatePresence>
      </main>

      <Modal
        open={eventModal}
        onClose={() =>
          setEventModal(false)
        }
        title="Add a new event"
      >
        <EventForm
          selectedDate={selectedDate}
          onSave={addEvent}
          onCancel={() =>
            setEventModal(false)
          }
        />
      </Modal>
    </div>
  );
}