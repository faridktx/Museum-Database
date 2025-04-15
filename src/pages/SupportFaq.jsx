import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

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
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="support-page container" style={{ paddingTop: "120px", maxWidth: "860px", margin: "0 auto" }}>
      <div className="support-header" style={{ marginBottom: '2rem' }}>
        <p className="breadcrumb">Home / Support / FAQ</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700' }}>Frequently Asked Questions</h1>
        <p className="support-subtitle" style={{ fontSize: '1.1rem', color: '#555' }}>
          Find answers to the most commonly asked questions about using the Curio Collection platform. Browse categories, expand questions, and learn more instantly.
        </p>
      </div>

      <section className="support-section card hover-card" style={{ padding: '2rem' }}>
        <div className="icon-header" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Help Topics</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item"
              style={{
                marginBottom: "1rem",
                cursor: "pointer",
                backgroundColor: "#fdfdfd",
                borderRadius: "10px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                padding: "1.2rem 1.5rem",
                transition: "all 0.25s ease",
              }}
              onClick={() => toggleFaq(index)}
            >
              <strong style={{ fontSize: '1.05rem' }}>{faq.question}</strong>
              {openIndex === index && (
                <p style={{ marginTop: "0.75rem", fontSize: '0.95rem', color: '#333' }}>{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}