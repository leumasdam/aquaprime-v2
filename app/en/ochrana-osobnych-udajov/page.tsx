import type { Metadata } from "next";
import { PravnaStranka, Doplnit, Overit } from "../../pravne";

export const metadata: Metadata = {
  title: "Personal data protection | AQUAPRIME",
  description:
    "What personal data AQUAPRIME processes, on what legal basis, how long it keeps them, who it passes them to and what rights you have.",
  alternates: {
    canonical: "/en/ochrana-osobnych-udajov",
    languages: { sk: "/ochrana-osobnych-udajov", en: "/en/ochrana-osobnych-udajov" },
  },
};

export default function PrivacyPolicy() {
  return (
    <PravnaStranka
      titul="Personal data protection"
      aktualizovane="11 September 2026"
      jazyk="en"
    >
      <h2>1. The controller</h2>
      <p>
        The controller determining the purposes and means of processing personal data is{" "}
        <Doplnit en co="business name" />, with its registered office at{" "}
        <Doplnit en co="registered office" />, company ID{" "}
        <Doplnit en co="company ID (IČO)" /> (the &bdquo;controller&ldquo;).
      </p>
      <p>
        Contact for exercising your rights:{" "}
        <a href="mailto:patrikranda225@gmail.com">patrikranda225@gmail.com</a>,{" "}
        <Doplnit en co="postal address for exercising rights" />.{" "}
        <Doplnit
          en
          co="data protection officer, if one is appointed — otherwise delete this item"
        />
      </p>
      <p>
        We process data in accordance with Regulation (EU) 2016/679 (GDPR) and Act
        No. 18/2018 Coll. on personal data protection.
      </p>

      <h2>2. What data we process and why</h2>
      <h3>Enquiries and the contact form</h3>
      <p>
        <strong>Data:</strong> name, e-mail, phone (if you provide it), the content of your
        message and details of the product you are asking about.
        <br />
        <strong>Purpose:</strong> replying to the enquiry and preparing a quote.
        <br />
        <strong>Legal basis:</strong> steps taken at the request of the data subject prior
        to entering into a contract (Art. 6(1)(b) GDPR).
        <br />
        <strong>Retention period:</strong>{" "}
        <Doplnit en co="retention period for enquiries" />.
      </p>

      <h3>Orders</h3>
      <p>
        <strong>Data:</strong> name, billing and delivery address, e-mail, phone, the goods
        ordered, payment and delivery details; for company purchases also the business name,
        company ID, tax ID and VAT ID.
        <br />
        <strong>Purpose:</strong> concluding and performing the purchase contract,
        fulfilling the order, invoicing and bookkeeping.
        <br />
        <strong>Legal basis:</strong> performance of a contract (Art. 6(1)(b)) and
        compliance with legal obligations (Art. 6(1)(c)).
        <br />
        <strong>Retention period:</strong> accounting documents for 10 years under Act
        No. 431/2002 Coll. on accounting; other order data for as long as is needed to
        fulfil the order and to exercise rights under the contract.
      </p>

      <h3>Complaints</h3>
      <p>
        <strong>Data:</strong> identification and contact details, description of the
        defect, photographs, proof of purchase.
        <br />
        <strong>Purpose:</strong> handling the complaint and documenting how it proceeded.
        <br />
        <strong>Legal basis:</strong> performance of a contract and of legal obligations.
        <br />
        <strong>Retention period:</strong>{" "}
        <Doplnit en co="retention period for complaint documentation" />.
      </p>

      <h3>Traffic measurement</h3>
      <p>
        Analytics tools (Google Analytics 4, possibly Google Tag Manager) load on the site
        only when a measurement code is configured for the particular environment.{" "}
        <Overit
          en
          co="the state of analytics before launch — if the measurement code is deployed, add a consent banner and the details below"
        />{" "}
        If the measurement code is active, data about the use of the site (pages visited,
        approximate location, device type) are processed on the basis of your consent
        (Art. 6(1)(a) GDPR), which you can withdraw at any time.
      </p>

      <h2>3. Data that stay in your browser</h2>
      <p>
        The site stores the contents of your cart and unfinished form text in your
        browser&rsquo;s local storage so that you do not lose them when you close the page.
        These data are not sent to the server and stay on your device until you delete them
        or until you submit the order or the message. You can delete them in your browser
        settings (clearing site data).
      </p>

      <h2>4. Who we pass the data to</h2>
      <p>The following processors handle data on our behalf:</p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — running and hosting the site, including server
          logs.
        </li>
        <li>
          <strong>Resend</strong> — sending e-mails from the forms and order confirmations.
        </li>
        <li>
          <strong>Stripe</strong> — processing card payments if you choose that method. You
          enter card details directly with the payment gateway provider; the controller has
          no access to them.
        </li>
        <li>
          <strong>Google Ireland Ltd.</strong> — traffic measurement, only if the
          measurement code is deployed and you have given consent.
        </li>
        <li>
          <Doplnit en co="domain and mailbox provider" /> — running the domain and e-mail.
        </li>
        <li>
          <Doplnit en co="carrier / courier company" /> — delivering the order.
        </li>
        <li>
          <Doplnit en co="accountant or accounting firm, if they process the documents" />.
        </li>
      </ul>
      <p>
        Some of these providers may process data outside the European Economic Area. In
        that case the transfer is secured by standard contractual clauses approved by the
        European Commission or by another appropriate safeguard.{" "}
        <Overit
          en
          co="the actual list of processors and the contracts concluded under Art. 28 GDPR"
        />
      </p>
      <p>
        We do not pass data to third parties for marketing purposes and we do not carry out
        automated decision-making or profiling with legal effects.
      </p>

      <h2>5. Cookies</h2>
      <p>
        The site uses technically necessary cookies and local storage needed for it to
        work — for example to keep the contents of your cart. These do not require consent.
      </p>
      <p>
        Analytics and marketing cookies are only deployed after consent is given through a
        consent banner, together with the measurement code. You can withdraw consent at any
        time by clearing the site data in your browser.{" "}
        <Overit
          en
          co="before launching analytics, add a consent banner and a list of the specific cookies with their lifetimes"
        />
      </p>

      <h2>6. Your rights</h2>
      <p>As a data subject you have the right:</p>
      <ul>
        <li>to access your data and to obtain a copy of them,</li>
        <li>to have inaccurate data corrected and incomplete data completed,</li>
        <li>to have data erased where there is no longer a reason to process them,</li>
        <li>to restrict processing,</li>
        <li>to the portability of the data you provided to us,</li>
        <li>to object to processing based on a legitimate interest,</li>
        <li>to withdraw consent at any time where processing is based on consent.</li>
      </ul>
      <p>
        You can exercise these rights by e-mail at{" "}
        <a href="mailto:patrikranda225@gmail.com">patrikranda225@gmail.com</a>. We reply within one month
        of receiving the request; in justified cases we may extend the period and will let
        you know.
      </p>
      <p>
        If you believe that processing your data has breached the rules, you have the right
        to lodge a complaint with the Office for Personal Data Protection of the Slovak
        Republic, Hraničná 12, 820 07 Bratislava (
        <a href="https://dataprotection.gov.sk" rel="noreferrer" target="_blank">
          dataprotection.gov.sk
        </a>
        ).
      </p>

      <h2>7. Providing the data</h2>
      <p>
        Providing the data needed to conclude and perform the contract is a contractual
        requirement — without them we cannot fulfil an order. Providing data for analytics
        is voluntary and based on consent.
      </p>

      <h2>8. Changes to this document</h2>
      <p>
        We may update this document if the processing operations or the legislation change.
        The current wording is always published on this page with the date it was last
        updated.
      </p>
    </PravnaStranka>
  );
}
