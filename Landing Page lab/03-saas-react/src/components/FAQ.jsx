
import { useState } from "react";

const questions = [
  {
    question: "What is TaskFlow?",
    answer: "TaskFlow is a project management platform that helps individuals and teams organize tasks, collaborate and track progress."
  },
  {
    question: "Can I use TaskFlow for free?",
    answer: "Yes! TaskFlow offers a free plan with basic project and task management features."
  },
  {
    question: "Can I change my plan later?",
    answer: "Absolutely. You can upgrade or change your subscription whenever your needs change."
  },
  {
    question: "Is TaskFlow suitable for teams?",
    answer: "Yes. TaskFlow includes collaboration features that help teams organize projects and work together."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes. You can cancel your subscription at any time. Your access will continue according to your billing period."
  }
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="faq section" id="faq">
      <div className="section-heading">
        <span className="eyebrow">GOT QUESTIONS?</span>
        <h2>Frequently asked questions</h2>
        <p>Everything you need to know about TaskFlow.</p>
      </div>

      <div className="faq-list">
        {questions.map((item, index) => (
          <article className="faq-item" key={index}>
            <button
              className="faq-question"
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              aria-expanded={activeIndex === index}
            >
              {item.question}
              <span>{activeIndex === index ? "−" : "+"}</span>
            </button>

            {activeIndex === index && (
              <p className="faq-answer">{item.answer}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
