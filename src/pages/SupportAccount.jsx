import { Link } from "wouter";
import { FaUserEdit, FaKey, FaUserSlash } from "react-icons/fa";

export function SupportAccount() {
  return (
    <div className="support-page container" style={{ paddingTop: '120px' }}>
      <div className="support-header">
        <p className="breadcrumb">Home / Support / Account Settings</p>
        <h1>Managing Your Account</h1>
        <p className="support-subtitle">
          Learn how to manage your profile, password, and account preferences to personalize your experience.
        </p>
      </div>

      <section className="support-section card">
        <div className="icon-header">
          <FaUserEdit size={24} />
          <h2>Update Your Profile</h2>
        </div>
        <p>
          You can change your name, email address, and other profile details by navigating to the profile settings from your dashboard.
        </p>
        <ul className="styled-list">
          <li>Click on your avatar in the dashboard top-right corner.</li>
          <li>Select <strong>"Account Settings"</strong>.</li>
          <li>Edit your information and click <strong>"Save Changes"</strong>.</li>
        </ul>
      </section>

      <section className="support-section card">
        <div className="icon-header">
          <FaKey size={24} />
          <h2>Change Your Password</h2>
        </div>
        <p>To change your password:</p>
        <ul className="styled-list">
          <li>Go to <strong>Account Settings</strong>.</li>
          <li>Select <strong>"Security"</strong>.</li>
          <li>Enter your current password and choose a new one.</li>
          <li>Click <strong>"Update Password"</strong>.</li>
        </ul>
      </section>

      <section className="support-section card">
        <div className="icon-header">
          <FaUserSlash size={24} />
          <h2>Deactivate or Delete Account</h2>
        </div>
        <p>
          If you no longer wish to use the platform, you may choose to deactivate or permanently delete your account. To do this:
        </p>
        <ul className="styled-list">
          <li>Navigate to <strong>Account Settings</strong>.</li>
          <li>Scroll to the bottom and click <strong>"Delete Account"</strong>.</li>
          <li>Follow the confirmation steps to complete the process.</li>
        </ul>
        <p className="warning">
          <strong>Warning:</strong> Deleting your account is irreversible and all associated data will be permanently removed.
        </p>
      </section>

      {/* Extra section to lengthen the page */}
      <section className="support-section card">
        <h2>Additional Resources</h2>
        <p>
          Explore more ways to customize and manage your account experience:
        </p>
        <ul className="styled-list">
          <li>Set up two-factor authentication</li>
          <li>Manage notification preferences</li>
          <li>Connect third-party login providers</li>
          <li>Set up backup email or recovery codes</li>
          <li>Enable activity logs and access tracking</li>
        </ul>
      </section>

      <footer className="support-footer">
        <p>
          Need help updating your account? <Link href="/support-contact">Contact Support</Link> or visit the <Link href="/support-knowledge">Knowledge Base</Link>.
        </p>
      </footer>

    </div>
  );
}
