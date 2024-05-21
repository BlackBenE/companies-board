import "../styles/navbar.css";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="navbar">
        <a href="/" className="nav-link">
          Eco-companies board
        </a>
        <Link to="/travel-carbon-simulator" className="nav-link">
          Travel carbon simulator
        </Link>
      </div>
      <Outlet />
      <hr />
      <div>React, the (type) safe way ©</div>
    </>
  ),
});
