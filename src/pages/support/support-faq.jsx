import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import styles from "./support.module.css";

export function SupportFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "Go to Account Settings > Security, enter your current password, then type your new one and click 'Update Password'.",
    },
    {
      question: "Where can I find my API key?",
      answer:
        "API keys are located in your Developer Settings. Navigate there from your dashboard and select 'Generate New Key'.",
    },
    {
      question: "Can I access the platform on mobile devices?",
      answer:
        "Yes, our platform is fully responsive and works well on all major modern mobile browsers.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "You can delete your account under Account Settings > Danger Zone. Be aware this action is permanent.",
    },
    {
      question: "How do I update my email address?",
      answer:
        "To update your email, visit Account Settings > Profile, update your address and click 'Save Changes'.",
    },
    {
      question: "What browsers are supported?",
      answer:
        "We support the latest versions of Chrome, Firefox, Safari, and Edge for optimal performance.",
    },
    {
      question: "Can I invite team members to collaborate?",
      answer:
        "Yes, administrators can invite new users under the Team Settings panel from the dashboard.",
    },
    {
      question: "Is my data backed up?",
      answer:
        "We back up all data daily and store encrypted versions on secure servers to prevent data loss.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className={styles["support-page"]}>
      <div className={styles["support-header"]} style={{ marginBottom: "2rem" }}>
        <p className={styles["breadcrumb"]}>Home / Support / FAQ</p>
        <h1>Frequently Asked Questions</h1>
        <p className={styles["support-subtitle"]}>
          Find answers to the most commonly asked questions about using the
          Curio Collection platform. Browse categories, expand questions, and
          learn more instantly.
        </p>
      </div>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaQuestionCircle size={20} />
          <h2>Help Topics</h2>
        </div>

        <div className={styles["faq-list"]}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={styles["faq-item"]}
              onClick={() => toggleFaq(index)}
            >
              <strong>{faq.question}</strong>
              {openIndex === index && (
                <p>{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
