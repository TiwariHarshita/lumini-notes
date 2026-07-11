import { Database, ShieldCheck, Palette, UserRound } from "lucide-react";

export default function SettingsPage({ user, configured }) {
  return (
    <div className="settings-page">
      <section className="settings-hero">
        <div className="settings-avatar">
          <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/9.x/thumbs/svg?seed=Guest`} alt="" />
        </div>
        <div>
          <p className="eyebrow">Account</p>
          <h2>{user?.user_metadata?.full_name || "Guest Planner"}</h2>
          <p>{user?.email || "Preview mode"}</p>
        </div>
      </section>

      <section className="settings-grid">
        <article>
          <span><UserRound size={19}/></span>
          <div><h4>Profile</h4><p></p></div>
        </article>
        <article>
          <span><Database size={19}/></span>
          <div><h4>Database</h4><p>{configured ? "Connected to Supabase." : "Demo mode. Add environment keys to connect."}</p></div>
        </article>
        <article>
          <span><ShieldCheck size={19}/></span>
          <div><h4>Private by design</h4><p>Row-level security keeps each user’s data separate.</p></div>
        </article>
        <article>
          <span><Palette size={19}/></span>
          <div><h4>Features</h4><p>Coming Soon</p></div>
        </article>
      </section>
    </div>
  );
}
