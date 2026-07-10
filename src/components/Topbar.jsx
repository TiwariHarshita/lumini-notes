import { Search, Bell, Command, Menu } from "lucide-react";

export default function Topbar({ title, search, setSearch, onMobileMenu }) {
  return (
    <header className="topbar">
      <button className="mobile-menu-btn" onClick={onMobileMenu}><Menu size={20}/></button>
      <div>
        <p className="eyebrow">Your personal workspace</p>
        <h1>{title}</h1>
      </div>

      <div className="topbar-actions">
        <label className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes and events"
          />
          <span><Command size={12}/> K</span>
        </label>
        <button className="icon-btn"><Bell size={18} /><i /></button>
      </div>
    </header>
  );
}
