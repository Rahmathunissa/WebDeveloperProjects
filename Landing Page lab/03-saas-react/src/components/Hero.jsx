
function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          ✨ Your productivity, simplified
        </div>

        <h1>
          Work smarter.
          <br />
          <span>Achieve more.</span>
        </h1>

        <p>
          Bring your projects, tasks and team together.
          TaskFlow helps you stay organized and get your
          best work done.
        </p>

        <div className="hero-actions">
          <a href="#pricing" className="primary-btn">Start for free →</a>
          <a href="#features" className="secondary-btn">Explore features</a>
        </div>

        <div className="hero-note">
          ✓ No credit card required &nbsp; ✓ Free plan available
        </div>
      </div>

      <div className="hero-visual">
        <div className="dashboard">
          <div className="dashboard-top">
            <strong>My Workspace</strong>
            <span>•••</span>
          </div>

          <div className="dashboard-stats">
            <div>
              <small>Total tasks</small>
              <h2>24</h2>
            </div>
            <div>
              <small>Completed</small>
              <h2>18</h2>
            </div>
            <div>
              <small>Progress</small>
              <h2>75%</h2>
            </div>
          </div>

          <div className="task-heading">Today's tasks</div>

          <div className="task-item">
            <span className="task-check">✓</span>
            <span>Design landing page</span>
            <small className="task-done">Done</small>
          </div>

          <div className="task-item">
            <span className="task-check">✓</span>
            <span>Prepare project proposal</span>
            <small className="task-done">Done</small>
          </div>

          <div className="task-item">
            <span className="task-pending"></span>
            <span>Review team feedback</span>
            <small className="task-progress">In progress</small>
          </div>

          <div className="task-item">
            <span className="task-pending"></span>
            <span>Plan next sprint</span>
            <small className="task-upcoming">Upcoming</small>
          </div>

          <div className="progress-label">
            <span>Weekly progress</span>
            <strong>75%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
