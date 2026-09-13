import type { Metadata } from "next";
import { PravnaStranka, Doplnit, Overit } from "../../pravne";

export const metadata: Metadata = {
  title: "Complaints procedure | AQUAPRIME",
  description:
    "The AQUAPRIME complaints procedure — liability for defects, how to make a complaint, deadlines and remedies for cabinets and aquariums.",
  alternates: {
    canonical: "/en/reklamacny-poriadok",
    languages: { sk: "/reklamacny-poriadok", en: "/en/reklamacny-poriadok" },
  },
};

export default function ComplaintsProcedure() {
  return (
    <PravnaStranka
      titul="Complaints procedure"
      aktualizovane="11 September 2026"
      jazyk="en"
    >
      <h2>1. Introductory provisions</h2>
      <p>
        This complaints procedure governs how rights arising from defective performance are
        exercised for goods bought from <Doplnit en co="business name" /> through the
        aquaprime.sk shop. It forms an inseparable part of the{" "}
        <a href="/en/obchodne-podmienky">terms and conditions</a>.
      </p>
      <p>
        The rights and obligations are governed by Act No. 40/1964 Coll. (the Civil Code)
        and Act No. 108/2024 Coll. on consumer protection. Where the buyer is a business,
        liability for defects is governed by the Commercial Code.
      </p>

      <h2>2. Liability for defects</h2>
      <p>
        <Overit
          en
          co="sections 2 to 5 — have the exact deadlines, the wording of the rights from defective performance and the statutory references reviewed by a lawyer"
        />
      </p>
      <p>
        The seller is liable for defects the goods have when the buyer takes delivery and
        for defects that appear within 24 months of receipt. If a defect appears within the
        first 12 months of receipt, the goods are presumed to have been defective on
        receipt unless the seller proves otherwise.
      </p>
      <p>Liability for defects does not cover, in particular:</p>
      <ul>
        <li>normal wear and tear corresponding to the manner and length of use,</li>
        <li>mechanical damage arising after the goods were received,</li>
        <li>
          damage caused by incorrect assembly or by use contrary to the seller&rsquo;s
          instructions, in particular placing the cabinet on an uneven or insufficiently
          solid surface without levelling it with the adjustable feet,
        </li>
        <li>
          damage caused by loading beyond the range agreed for the particular product, or
          by a tank that overhangs the footprint of the cabinet,
        </li>
        <li>defects for which a discount on the price was granted.</li>
      </ul>

      <h2>3. Making a complaint</h2>
      <p>
        A complaint can be made by e-mail to{" "}
        <a href="mailto:ahoj@aquaprime.sk">ahoj@aquaprime.sk</a> or in writing to{" "}
        <Doplnit en co="address for making complaints" />. It helps to state the order
        number, a description of the defect and when it appeared, and to attach
        photographs. These details speed up the process; not providing them is not a reason
        to reject a complaint.
      </p>
      <p>
        A complaint can be made at any time during the period under section 2. If a
        shipment is damaged in transit, we recommend having the courier record the damage on
        receipt and reporting it to the seller as soon as possible — it makes proving
        transport damage easier. Reporting it later does not automatically mean losing the
        rights arising from defective performance.
      </p>

      <h2>4. Handling a complaint</h2>
      <p>
        The seller confirms receipt of the complaint and issues the buyer a confirmation
        that it has been made. The seller decides on the way it will be handled without
        undue delay and settles the complaint within 30 days of it being made at the latest,
        unless a longer period is agreed with the buyer. If that period passes without
        result, the buyer is entitled to withdraw from the contract or to demand replacement
        goods.
      </p>
      <p>
        A justified complaint is handled free of charge. The buyer is entitled to have the
        defect remedied by repair or replacement; if no remedy is possible, the buyer is
        entitled to an appropriate discount on the price or to withdraw from the contract.
        The choice of remedy takes into account the nature of the defect and the cost the
        remedy would require.
      </p>
      <p>
        The seller informs the buyer of the outcome of the complaint by e-mail and issues a
        written record of how it was settled.
      </p>

      <h2>5. Costs</h2>
      <p>
        For a justified complaint the seller bears the cost of transporting the goods. If a
        complaint proves unjustified, the buyer bears the transport costs. For bulky goods
        the method of transport must be agreed in advance.
      </p>

      <h2>6. Alternative dispute resolution</h2>
      <p>
        If a buyer who is a consumer is not satisfied with the way a complaint was handled,
        they may ask the seller for redress. If the seller rejects the request or does not
        reply within 30 days, the consumer may file a proposal for alternative dispute
        resolution under Act No. 391/2015 Coll. The competent body is the Slovak Trade
        Inspection (
        <a href="https://www.soi.sk" rel="noreferrer" target="_blank">
          soi.sk
        </a>
        ) or another authorised legal entity on the list kept by the Ministry of Economy of
        the Slovak Republic. The European ODR platform was discontinued on 20 July 2025.
      </p>
      <p>
        This complaints procedure takes effect on <Doplnit en co="effective date" />.
      </p>
    </PravnaStranka>
  );
}
