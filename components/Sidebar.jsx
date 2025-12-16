import "./sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <a href="/" className="sidebar-btn">🏠</a>
        <a href="/search" className="sidebar-btn">🔍</a>
        <a href="/notifications" className="sidebar-btn">🔔</a>
        <a href="/dm" className="sidebar-btn">💬</a>
        <a href="/profile" className="sidebar-btn profile">
          <img
            src="https://cdn2.scratch.mit.edu/get_image/user/YOUR_SCRATCH_ID_60x60.png"
            alt="profile"
          />
        </a>
      </nav>

      <a href="/settings" className="sidebar-btn settings">⚙️</a>
    </aside>
  );
}
