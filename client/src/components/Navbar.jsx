function Navbar({ authenticated, onLogin, onLogout }) {
  return (
    <header className="navbar">
      <div>
        <h1>Salesforce CRUD Manager</h1>
        <span>Salesforce REST API Integration</span>
      </div>

      <div>
        {authenticated ? (
          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="login-button"
            onClick={onLogin}
          >
            Login with Salesforce
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;