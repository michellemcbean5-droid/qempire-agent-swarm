// Plain-language agreement templates shown before a customer starts.
// These are generic starting points — have a lawyer review before production use.

export interface LegalDoc {
  id: string;
  title: string;
  summary: string;
  body: string[];
}

const COMPANY = "Q-Empire Automation Division";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "nda",
    title: "Mutual NDA (NNDA)",
    summary: "You and Q-Empire agree to keep each other's private information confidential, and not to go around each other to work directly with introduced partners.",
    body: [
      `This Mutual Non-Disclosure & Non-Circumvention Agreement ("NNDA") is between you ("Client") and ${COMPANY} ("Company").`,
      "1. Confidential Information. Each party may share private business information (ideas, plans, contacts, pricing, methods, the automation formula). Both parties agree to keep it confidential and use it only to work together.",
      "2. Non-Circumvention. For 24 months, neither party will bypass the other to transact directly with partners, vendors, or clients introduced through this relationship without written consent.",
      "3. Exclusions. Information that is already public, already known, or independently developed is not covered.",
      "4. Ownership. Sharing information does not transfer ownership of it.",
      "5. Term. Confidentiality obligations last 3 years from the date accepted.",
      "By signing below you agree to this NNDA.",
    ],
  },
  {
    id: "terms",
    title: "Terms of Service",
    summary: "The rules for using the Q-Empire app and Q-Bot: what you can do, what you're responsible for, and how billing works.",
    body: [
      `These Terms govern your use of the ${COMPANY} platform and the Q-Bot agent ("Service").`,
      "1. Your account. You're responsible for your login, your API keys, the connectors you enable, and the content Q-Bot creates on your instruction.",
      "2. Acceptable use. Don't use the Service for anything illegal, deceptive, or that violates a third party's rights or a connector's terms.",
      "3. Credits & billing. Paid plans and credit packs are billed through Stripe. Credits are consumed by task usage. Subscriptions renew until canceled.",
      "4. Your content & deliverables. You own the business assets Q-Bot builds for you. You grant us permission to process your inputs to provide the Service.",
      "5. Availability. The Service is provided 'as is'. We aim for high uptime but don't guarantee uninterrupted service.",
      "6. Limitation of liability. To the maximum extent allowed by law, our liability is limited to the amount you paid in the prior 3 months.",
      "7. Changes. We may update these Terms; continued use means you accept the updates.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    summary: "What data we collect, how we use it, and your control over it.",
    body: [
      "We collect the info you give us (email, business details, inputs to Q-Bot) and basic usage data to run and improve the Service.",
      "We use it to build your deliverables, run your automations, process payments (Stripe), and support you.",
      "We share data only with the connectors and providers you enable (e.g., your model provider, Stripe, the apps you connect) — never sold.",
      "Your API keys are stored to operate the Service on your behalf and can be removed at any time.",
      "You can request access to, or deletion of, your data by contacting support.",
    ],
  },
  {
    id: "earnings",
    title: "Earnings Disclaimer",
    summary: "The Millionaire Formula is a system and a set of tools — not a guarantee of income. Results depend on you.",
    body: [
      "The Millionaire Formula, the Path-to-a-Million simulator, and any figures shown (including $1,000,000) are illustrations and educational projections — not promises or guarantees of income.",
      "Any income examples are potential outcomes, not typical results. Most new businesses take time and effort, and many do not reach these figures.",
      "Projections in the simulator are generated from the numbers YOU enter. They are estimates only and assume consistent effort, market demand, and execution.",
      `${COMPANY} does not guarantee any specific financial result. Your results depend on your work, your market, your offer, and factors outside our control.`,
      "Nothing here is financial, legal, or tax advice. Consider consulting a professional before making business decisions.",
    ],
  },
  {
    id: "refund",
    title: "Refund & Cancellation",
    summary: "How subscriptions, credits, and refunds work.",
    body: [
      "Subscriptions can be canceled anytime from your account; access continues until the end of the paid period.",
      "Credits and one-off credit packs are consumed by usage and are generally non-refundable once used.",
      "If something goes wrong on our side, contact support and we'll make it right.",
    ],
  },
];
