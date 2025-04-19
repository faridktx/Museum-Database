import "./MembershipPerks.css";
import { FaGift, FaClock, FaUserFriends, FaTags, FaCrown, FaStar } from "react-icons/fa";

export function MembershipPerks() {
  const perks = [
    { icon: <FaClock />, title: "Early Exhibit Access" },
    { icon: <FaGift />, title: "Free Guest Passes" },
    { icon: <FaUserFriends />, title: "Member-Only Events" },
    { icon: <FaTags />, title: "10% Off Gift Shop" },
    { icon: <FaCrown />, title: "VIP Tour Options" },
    { icon: <FaStar />, title: "Exclusive Newsletters" },
  ];

  return (
    <section className="membership-perks-section">
      <h2 className="section-title">Membership Perks</h2>
      <div className="perks-grid">
        {perks.map((perk, index) => (
          <div className="perk-card" key={index}>
            <div className="perk-icon">{perk.icon}</div>
            <h3 className="perk-title">{perk.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}