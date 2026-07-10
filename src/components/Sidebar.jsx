import { motion } from "framer-motion";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  StickyNote,
  Target,
} from "lucide-react";

const navigationItems = [
  {
    id: "overview",
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    id: "calendar",
    icon: CalendarDays,
    label: "Calendar",
  },
  {
    id: "notes",
    icon: StickyNote,
    label: "Notes",
  },
  {
    id: "focus",
    icon: Target,
    label: "Focus",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
  },
];

export default function Sidebar({
  active,
  onChange,
  user,
  onSignOut,
  onQuickAdd,
}) {
  const displayName =
    user?.user_metadata?.full_name ||
    "Lumina User";

  const displayEmail =
    user?.email || "preview mode";

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>

          <span>Lumina</span>
        </div>

        <div className="profile">
          <img
            src="/default-avatar.svg"
            alt="Lumina profile avatar"
          />

          <div>
            <strong>
              {displayName}
            </strong>

            <small>
              {displayEmail}
            </small>
          </div>
        </div>

        <button
          type="button"
          className="quick-add"
          onClick={onQuickAdd}
        >
          <Plus size={17} />
          Quick add
        </button>

        <nav>
          {navigationItems.map(
            ({
              id,
              icon: Icon,
              label,
            }) => (
              <button
                type="button"
                key={id}
                className={`nav-item ${
                  active === id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onChange(id)
                }
              >
                {active === id && (
                  <motion.span
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <Icon size={18} />

                <span>{label}</span>
              </button>
            )
          )}
        </nav>
      </div>

      <button
        type="button"
        className="signout-btn"
        onClick={onSignOut}
      >
        <LogOut size={17} />
        Sign out
      </button>
    </aside>
  );
}