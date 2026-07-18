import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-container">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last Updated: July 18, 2026</p>

      <section className="legal-section">
        <p>At BGCleaner, accessible from bgcleaner.online, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by BGCleaner and how we use it.</p>
        <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at support@bgcleaner.online.</p>
      </section>

      <section className="legal-section">
        <h2>Client-Side Image Processing Commitment</h2>
        <p>Unlike standard online background remover services, BGCleaner operates entirely client-side. When you choose an image to remove its background, the AI model processes the image directly within your browser window using WebAssembly and WebGL/WebGPU. Your files are never uploaded, stored, or processed on our remote web servers. We do not have access to, nor do we keep copies of, any graphics or photos you feed into the tool.</p>
      </section>

      <section className="legal-section">
        <h2>Log Files</h2>
        <p>BGCleaner follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the info is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>
      </section>

      <section className="legal-section">
        <h2>Cookies and Web Beacons</h2>
        <p>Like any other website, BGCleaner uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
      </section>

      <section className="legal-section">
        <h2>Google DoubleClick DART Cookie</h2>
        <p>Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a></p>
      </section>

      <section className="legal-section">
        <h2>Our Advertising Partners</h2>
        <p>Some of the advertisers on our site may use cookies and web beacons. Our advertising partners include:</p>
        <ul>
          <li><strong>Google AdSense:</strong> Their privacy policies can be reviewed at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>.</li>
        </ul>
        <p>These third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on BGCleaner, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
        <p>Note that BGCleaner has no access to or control over these cookies that are used by third-party advertisers.</p>
      </section>

      <section className="legal-section">
        <h2>Third Party Privacy Policies</h2>
        <p>BGCleaner's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
        <p>You can choose to disable cookies through your individual browser options. To know more detailed info about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
      </section>

      <section className="legal-section">
        <h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
        <p>Under the CCPA, among other rights, California consumers have the right to:</p>
        <ul>
          <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
          <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
          <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at contact@bgcleaner.online.</p>
      </section>

      <section className="legal-section">
        <h2>GDPR Data Protection Rights</h2>
        <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
        <ul>
          <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
          <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
          <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li><strong>The right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
          <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
      </section>

      <section className="legal-section">
        <h2>Children's Information</h2>
        <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
        <p>BGCleaner does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
      </section>
    </div>
  );
};
