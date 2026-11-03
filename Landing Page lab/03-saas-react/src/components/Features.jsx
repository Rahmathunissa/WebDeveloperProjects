
const features = [
  {
    icon: "📋",
    title: "Task Management",
    description: "Organize tasks, set priorities and track every project from one place."
  },
  {
    icon: "🤝",
    title: "Team Collaboration",
    description: "Bring your team together with shared workspaces and clear communication."
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description: "Monitor project progress and understand your team's productivity."
  },
  {
    icon: "⚡",
    title: "Smart Automation",
    description: "Reduce repetitive work and focus on what really matters."
  },
  {
    icon: "📅",
    title: "Project Planning",
    description: "Plan deadlines, manage schedules and stay ahead of your goals."
  },
  {
    icon: "🔒",
    title: "Secure Workspace",
    description: "Keep your project information organized and protected."
  }
];

function Features() {
  return (
    <section className="features section" id="features">
      <div className="section-heading">
        <span className="eyebrow">WHY TASKFLOW?</span>
        <h2>Everything you need to work better</h2>
        <p>Simple tools, powerful features and one organized workspace.</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <article className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;
