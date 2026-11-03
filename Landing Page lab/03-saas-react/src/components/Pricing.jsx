
import { useState } from "react";

const plans = [
  {
    name: "Free",
    description: "For individuals getting started.",
    monthly: 0,
    yearly: 0,
    features: ["Up to 3 projects", "Basic task management", "1 user", "Community support"],
    button: "Get Started"
  },
  {
    name: "Pro",
    description: "For professionals and growing teams.",
    monthly: 12,
    yearly: 9,
    features: ["Unlimited projects", "Advanced task management", "Up to 10 users", "Priority support", "Progress analytics"],
    button: "Choose Pro",
    popular: true
  },
  {
    name: "Business",
    description: "For teams that need more control.",
    monthly: 29,
    yearly: 24,
    features: ["Everything in Pro", "Unlimited team members", "Advanced reports", "Team collaboration", "Dedicated support"],
    button: "Choose Business"
  }
];

function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="pricing section" id="pricing">
      <div className="section-heading">
        <span className="eyebrow">SIMPLE PRICING</span>
        <h2>Plans that grow with you</h2>
        <p>Start free and upgrade whenever you're ready.</p>
      </div>

      <div className="billing-toggle">
        <button
          className={!yearly ? "selected" : ""}
          onClick={() => setYearly(false)}
        >
          Monthly
        </button>

        <button
          className={yearly ? "selected" : ""}
          onClick={() => setYearly(true)}
        >
          Yearly <span>Save up to 25%</span>
        </button>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article
            className={`pricing-card ${plan.popular ? "popular" : ""}`}
            key={plan.name}
          >
            {plan.popular && <div className="popular-label">MOST POPULAR</div>}

            <h3>{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>

            <div className="plan-price">
              <strong>${yearly ? plan.yearly : plan.monthly}</strong>
              <span>/ user / month</span>
            </div>

            {yearly && plan.monthly > 0 && (
              <p className="billing-note">Billed annually</p>
            )}

            <a href="#contact" className="plan-button">
              {plan.button}
            </a>

            <div className="plan-features">
              <strong>What's included:</strong>
              {plan.features.map((feature) => (
                <div key={feature}>✓ {feature}</div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
