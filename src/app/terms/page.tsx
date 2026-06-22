import React from 'react';

export const metadata = {
  title: 'Terms of Service | knowyourwomen App',
  description: 'Terms of Service for the knowyourwomen mobile application.',
};

export default function TermsOfService() {
  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h1 style={{ marginBottom: '24px' }}>Terms of Service</h1>
      <p style={{ marginBottom: '16px' }}><strong>Last Updated:</strong> June 20, 2026</p>
      
      <p style={{ marginBottom: '24px' }}>
        These Terms of Service ("Terms") govern your use of the knowyourwomen mobile application (the "App"). By using the App, you agree to be bound by these Terms.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>1. Not Medical Advice</h2>
      <p style={{ marginBottom: '24px' }}>
        The knowyourwomen App is designed for educational and informational purposes only. The information provided through the App is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>2. User Accounts</h2>
      <p style={{ marginBottom: '24px' }}>
        You may be required to create an account to use certain features of the App. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>3. Subscriptions and Payments</h2>
      <p style={{ marginBottom: '24px' }}>
        Certain features of the App may require a paid subscription. By purchasing a subscription, you agree to the pricing and payment terms presented to you at the time of purchase. Subscriptions may automatically renew unless cancelled in accordance with the terms of the App Store or Google Play Store.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>4. User Conduct</h2>
      <p style={{ marginBottom: '16px' }}>You agree not to:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}>Use the App for any illegal purpose or in violation of any local, state, national, or international law.</li>
        <li style={{ marginBottom: '8px' }}>Violate or encourage others to violate the rights of third parties, including intellectual property rights.</li>
        <li style={{ marginBottom: '8px' }}>Interfere with or disrupt the operation of the App or any server or network used to make the App available.</li>
      </ul>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>5. Limitation of Liability</h2>
      <p style={{ marginBottom: '24px' }}>
        To the maximum extent permitted by law, knowyourwomen and its affiliates, directors, employees, or agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the App.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>6. Changes to Terms</h2>
      <p style={{ marginBottom: '24px' }}>
        We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the top of these Terms and, where appropriate, providing additional notice.
      </p>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>7. Contact Us</h2>
      <p style={{ marginBottom: '16px' }}>If you have any questions about these Terms, please contact us at:</p>
      <p>
        <strong>Email:</strong> knowyourwomenapp@gmail.com
      </p>
    </div>
  );
}
