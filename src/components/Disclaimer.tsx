import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="legal-container">
      <h1>Disclaimer</h1>
      <p className="last-updated">Last Updated: July 18, 2026</p>

      <section className="legal-section">
        <h2>General Website Disclaimer</h2>
        <p>The information provided by BGCleaner (accessible via bgcleaner.online) is for general informational and educational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
        <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>
      </section>

      <section className="legal-section">
        <h2>Professional Financial and Tax Disclaimer</h2>
        <p><strong>BGCleaner does not provide financial, investment, legal, or tax advice.</strong></p>
        <p>Any financial, investment, tax, or legal details, calculations, and simulations published in our blog posts (such as articles dealing with Medicare IRMAA brackets, HYSA tax drags, CD returns, or retirement accounts) are provided strictly for educational and illustrative purposes. They do not constitute professional advice, and should not be treated as a substitute for professional consultations.</p>
        <p>The rules governing taxes, retirement plans, Medicare premiums, and investment assets are subject to change and vary greatly based on individual circumstances. Before making any financial decisions or taking action based on information on our blog, you are strongly urged to consult with a certified tax professional, CPA, or registered investment advisor who is qualified to analyze your specific circumstances.</p>
      </section>

      <section className="legal-section">
        <h2>External Links Disclaimer</h2>
        <p>The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
        <p>We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.</p>
      </section>

      <section className="legal-section">
        <h2>Errors and Omissions Disclaimer</h2>
        <p>While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, BGCleaner is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in this site is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied.</p>
      </section>
    </div>
  );
};
