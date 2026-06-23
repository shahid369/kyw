import React from 'react';

export const metadata = {
  title: 'Privacy Policy | knowyourwomen App',
  description: 'Privacy Policy for the knowyourwomen mobile application.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h1 style={{ marginBottom: '24px' }}>Privacy Policy</h1>
      <p style={{ marginBottom: '16px' }}><strong>Last Updated:</strong> June 20, 2026</p>
      
      <p style={{ marginBottom: '24px' }}>
        Welcome to knowyourwomen ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the "App"). Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the application.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: '16px' }}>We may collect information about you in a variety of ways. The information we may collect via the App includes:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}><strong>Personal Data:</strong> Demographics, such as age and gender, and personal interests, which you voluntarily give to us when you register with the App.</li>
        <li style={{ marginBottom: '8px' }}><strong>Health Data:</strong> Cycle lengths, dates, and related symptoms that you choose to log within the application. This data is processed to provide you with insights regarding cycle phases.</li>
        <li style={{ marginBottom: '8px' }}><strong>Derivative Data:</strong> Information our servers automatically collect when you access the App, such as your IP address, browser type, your operating system, and access times.</li>
      </ul>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>2. Use of Your Information</h2>
      <p style={{ marginBottom: '16px' }}>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the App to:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}>Provide cycle tracking and related insights.</li>
        <li style={{ marginBottom: '8px' }}>Create and manage your account.</li>
        <li style={{ marginBottom: '8px' }}>Improve the functionality and user experience of the App.</li>
        <li style={{ marginBottom: '8px' }}>Deliver targeted advertising, newsletters, and other information regarding promotions and the App to you (if applicable).</li>
      </ul>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>3. Disclosure of Your Information</h2>
      <p style={{ marginBottom: '16px' }}>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
        <li style={{ marginBottom: '8px' }}><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
      </ul>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>4. Security of Your Information</h2>
      <p style={{ marginBottom: '24px' }}>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>5. Account Deletion and Data Erasure</h2>
      <p style={{ marginBottom: '16px' }}>
        You have the right to request the deletion of your account and all associated data at any time. To request deletion, you can visit our dedicated <a href="/delete-account" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Account Deletion Request Page</a> and follow the instructions to generate an account erasure email. Once received, our team will permanently delete your cycle history, partner profile details, symptoms tracking, and personal settings within 24 to 48 hours.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>6. Contact Us</h2>
      <p style={{ marginBottom: '16px' }}>If you have questions or comments about this Privacy Policy, please contact us at:</p>
      <p>
        <strong>Email:</strong> knowyourwomenapp@gmail.com
      </p>
    </div>
  );
}
