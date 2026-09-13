import type { Metadata } from "next";
import { PravnaStranka, Doplnit, Overit } from "../../pravne";

export const metadata: Metadata = {
  title: "Terms and conditions | AQUAPRIME",
  description:
    "Terms and conditions for buying aquarium cabinets and aquariums on aquaprime.sk — ordering, prices, delivery, withdrawal from the contract and complaints.",
  alternates: {
    canonical: "/en/obchodne-podmienky",
    languages: { sk: "/obchodne-podmienky", en: "/en/obchodne-podmienky" },
  },
};

export default function TermsAndConditions() {
  return (
    <PravnaStranka
      titul="Terms and conditions"
      aktualizovane="11 September 2026"
      jazyk="en"
    >
      <h2>1. Introductory provisions</h2>
      <p>
        These terms and conditions govern the rights and obligations of the contracting
        parties when goods are sold through the online shop at aquaprime.sk. They form an
        inseparable part of the purchase contract concluded between the seller and the
        buyer.
      </p>
      <p>
        Matters not covered by these terms are governed by the law of the Slovak Republic,
        in particular Act No. 40/1964 Coll. (the Civil Code), Act No. 108/2024 Coll. on
        consumer protection and Act No. 22/2004 Coll. on electronic commerce. Where the
        buyer is a business, the relationship is governed by Act No. 513/1991 Coll. (the
        Commercial Code) and the consumer-protection provisions do not apply.
      </p>

      <h2>2. The seller</h2>
      <p>
        The operator of the online shop and the seller is{" "}
        <Doplnit en co="business name" />, with its registered office at{" "}
        <Doplnit en co="registered office" />, company ID{" "}
        <Doplnit en co="company ID (IČO)" />, tax ID{" "}
        <Doplnit en co="tax ID (DIČ)" />,{" "}
        <Doplnit en co="VAT ID, or a note that the seller is not a VAT payer" />,
        registered in <Doplnit en co="register and registration number" /> (the
        &bdquo;seller&ldquo;).
      </p>
      <p>
        Contact details: e-mail <a href="mailto:ahoj@aquaprime.sk">ahoj@aquaprime.sk</a>,
        phone <Doplnit en co="phone" />, delivery address{" "}
        <Doplnit en co="address for correspondence and returns" />.
      </p>
      <p>
        Supervisory authority: the Slovak Trade Inspection, the inspectorate for{" "}
        <Doplnit en co="region according to the seller's registered office" />,{" "}
        <a href="https://www.soi.sk" rel="noreferrer" target="_blank">
          soi.sk
        </a>
        .
      </p>

      <h2>3. Orders and conclusion of the contract</h2>
      <p>
        The buyer orders goods by submitting an order through the shopping cart. Before
        submitting it, the buyer can check and change the details entered. Submitting an
        order is an act carrying an obligation to pay, and by doing so the buyer confirms
        having read these terms and conditions.
      </p>
      <p>
        The seller confirms receipt of the order by e-mail. The purchase contract comes
        into existence when the seller binding-ly confirms the order; an automatic
        acknowledgement of delivery of the order is not an acceptance. For made-to-measure
        goods, the seller agrees the dimensions and the finish with the buyer before
        confirming.
      </p>
      <p>
        A free enquiry sent through the form or the configurator is not an order, and
        neither a contract nor an obligation to pay arises from it.
      </p>

      <h2>4. Prices</h2>
      <p>
        The prices shown with the goods are in euros and are final,{" "}
        <Doplnit en co="including VAT / the seller is not a VAT payer" />. The price does
        not include delivery costs, which are shown in the cart before the order is
        submitted.
      </p>
      <p>
        The price applicable to an order is the price shown at the moment the order is
        submitted. The seller reserves the right to change prices; a change does not affect
        orders already confirmed. For made-to-measure goods the price is set individually
        and communicated to the buyer in a quote before the order is confirmed.
      </p>

      <h2>5. Payment terms</h2>
      <p>
        <Overit
          en
          co="the whole of section 5 — confirm the actual payment process, the deposit amount and the available payment methods"
        />
      </p>
      <p>
        The buyer may pay the price by the methods offered in the order form. For goods
        made to order, after the order is confirmed the buyer pays a deposit of{" "}
        <Doplnit en co="deposit amount in %" /> of the price; production starts once it is
        credited. The buyer pays the remainder{" "}
        <Doplnit en co="method and timing of the balance payment" />.
      </p>
      <p>
        Card payments are processed by the payment gateway provider; the seller does not
        store card details. The seller sends the tax document electronically to the
        buyer&rsquo;s e-mail. The goods remain the property of the seller until the price is
        paid in full.
      </p>

      <h2>6. Delivery</h2>
      <p>
        <Overit
          en
          co="the whole of section 6 — confirm the carrier, the delivery price list, the pickup location and the scope of installation"
        />
      </p>
      <p>
        Goods are made to order. The seller states the expected delivery date in the order
        confirmation; it depends on the product and the current production capacity. If the
        date cannot be met, the seller informs the buyer without delay and agrees an
        alternative date or cancellation of the order with a refund of the amount paid.
      </p>
      <p>
        The delivery method and its price are shown in the cart before the order is
        submitted. Personal pickup is possible at{" "}
        <Doplnit en co="pickup address" /> once a time is agreed. Carrying the goods to an
        upper floor and installing the cabinet are separate services; their availability and
        price must be agreed in advance.
      </p>
      <p>
        The buyer must inspect the shipment on receipt. Visible damage to the packaging or
        to the goods must be noted in the transport document and reported to the seller
        without delay.
      </p>

      <h2>7. Withdrawal from the contract by a consumer</h2>
      <p>
        <Overit
          en
          co="section 7 — have the exact wording and the references to Act No. 108/2024 Coll. reviewed by a lawyer"
        />
      </p>
      <p>
        A consumer has the right to withdraw from a distance contract without giving a
        reason within 14 days of taking delivery of the goods. The deadline is met if the
        consumer sends the notice of withdrawal before it expires.
      </p>
      <p>
        Withdrawal can be notified by e-mail to{" "}
        <a href="mailto:ahoj@aquaprime.sk">ahoj@aquaprime.sk</a> or in writing to the
        registered office. The model form below may also be used. The seller confirms
        receipt of the withdrawal without undue delay.
      </p>
      <p>
        The goods must be sent back within 14 days of withdrawal at the latest. The
        consumer bears the direct cost of returning the goods; for bulky goods that cannot
        be sent by ordinary post these costs may be higher and are estimated at{" "}
        <Doplnit en co="estimated cost of returning bulky goods" />.
      </p>
      <p>
        The seller refunds all payments received, including delivery costs (up to the
        amount of the cheapest delivery method offered), within 14 days of receiving the
        withdrawal, using the same means of payment the consumer used, unless agreed
        otherwise. The seller may withhold the refund until the goods are returned or until
        the consumer proves they have been sent. The consumer is liable for any diminished
        value of the goods resulting from handling beyond what is necessary to establish
        their nature and functioning.
      </p>
      <p>
        <strong>When the right of withdrawal does not arise.</strong> The right to withdraw
        does not apply to goods made to the consumer&rsquo;s specific requirements, made to
        measure or clearly personalised. This covers aquariums and cabinets in atypical
        sizes or finishes ordered through the configurator or an individual enquiry. For
        goods in catalogue sizes and standard finishes the right of withdrawal is retained.
        The seller points this out for the specific order before it is submitted.
      </p>

      <h3>Model withdrawal form</h3>
      <p className="pravne__formular">
        To: <Doplnit en co="business name, registered office, e-mail" />
        <br />
        I hereby give notice that I withdraw from the contract for the following goods: …
        <br />
        Date of order / receipt: …
        <br />
        Consumer&rsquo;s name: …
        <br />
        Consumer&rsquo;s address: …
        <br />
        Order number: …
        <br />
        Date: …
        <br />
        Signature (only if this form is submitted on paper): …
      </p>

      <h2>8. Liability for defects and complaints</h2>
      <p>
        The seller is liable for defects the goods have on receipt and for defects that
        appear within the statutory period. The procedure for making and handling a
        complaint is set out in the{" "}
        <a href="/en/reklamacny-poriadok">complaints procedure</a>, which forms part of
        these terms.
      </p>

      <h2>9. Alternative dispute resolution</h2>
      <p>
        If a consumer is not satisfied with the way a complaint was handled, or believes
        the seller has infringed their rights, they may ask the seller for redress. If the
        seller rejects the request or does not reply within 30 days of it being sent, the
        consumer may file a proposal to start alternative dispute resolution under Act
        No. 391/2015 Coll.
      </p>
      <p>
        The competent body is the Slovak Trade Inspection (
        <a href="https://www.soi.sk" rel="noreferrer" target="_blank">
          soi.sk
        </a>
        ) or another authorised legal entity on the list kept by the Ministry of Economy of
        the Slovak Republic. The European online dispute resolution (ODR) platform operated
        until 20 July 2025 and is no longer available.
      </p>

      <h2>10. Final provisions</h2>
      <p>
        The processing of personal data is covered by a separate document,{" "}
        <a href="/en/ochrana-osobnych-udajov">Personal data protection</a>. The contract is
        concluded in the Slovak language and the seller archives it electronically.
      </p>
      <p>
        The seller reserves the right to amend these terms. Contracts already concluded are
        governed by the wording in force when the order was submitted. These terms take
        effect on <Doplnit en co="effective date" />.
      </p>
    </PravnaStranka>
  );
}
