// Color palettes + detailed product primers for the top Philippine life
// insurers. The company `id` doubles as the `data-theme` key (see globals.css).
//
// Each product carries a full "primer" — overview, benefits, coverage, riders,
// eligibility, premium terms and FAQs — so a Financial Advisor can study what
// they sell the way they'd find it on the carrier's brochure / website.

export type ProductCategory =
  | "VUL"
  | "Life"
  | "Health"
  | "Education"
  | "Retirement"
  | "Income"
  | "Group";

export interface ProductFAQ {
  q: string;
  a: string;
}

export interface InsuranceProduct {
  name: string;
  category: ProductCategory;
  tagline: string;
  /** 2–3 sentence plain-language summary. */
  overview: string;
  /** Short chips shown on the card & hero. */
  highlights: string[];
  /** Detailed selling benefits. */
  benefits: string[];
  /** What the plan covers / inclusions. */
  coverage: string[];
  /** Optional attachable riders / add-ons. */
  riders?: string[];
  /** Entry-age and qualification notes. */
  eligibility: string[];
  /** Premium payment terms, modes and indicative entry premium. */
  premium: string;
  /** Fund choices — VUL/investment-linked plans only. */
  fundOptions?: string[];
  idealFor: string;
  faqs: ProductFAQ[];
}

export interface InsuranceCompany {
  id: string; // matches [data-theme="…"]
  name: string;
  short: string;
  tagline: string;
  /** One-liner about the company for the picker / hero. */
  about: string;
  founded: string;
  /** Representative brand color (matches the theme hue). */
  color: string;
  onColor: string;
  products: InsuranceProduct[];
}

export const COMPANIES: InsuranceCompany[] = [
  {
    id: "sunlife",
    name: "Sun Life of Canada (Philippines), Inc.",
    short: "Sun Life",
    tagline: "Brighter life — the country's #1 life insurer",
    about:
      "The oldest and consistently #1 life insurer in the Philippines, known for its VUL line-up and the largest agency force in the country.",
    founded: "1895 (PH operations)",
    color: "#fdb813",
    onColor: "#1a1a2e",
    products: [
      {
        name: "Sun MaxiLink Prime",
        category: "VUL",
        tagline: "Flagship 10-year-pay investment + life plan",
        overview:
          "Sun MaxiLink Prime is a peso-denominated variable universal life (VUL) plan that bundles life insurance with professionally managed investment funds. You pay premiums for a limited period (commonly 10 years) yet stay covered and invested for life.",
        highlights: ["10-pay option", "Life + investing", "Loyalty bonuses"],
        benefits: [
          "Life insurance coverage of up to 500% of your annual premium, plus the fund value",
          "Money is invested in Sun Life's managed funds for long-term growth",
          "Loyalty bonuses credited the longer you stay invested",
          "Withdraw part of your fund value for emergencies or milestones",
          "Death benefit is generally tax-free to your beneficiaries",
        ],
        coverage: [
          "Death benefit (face amount or fund value, whichever applies)",
          "Built-in accidental death & disablement option",
          "Living benefits via attachable health riders",
        ],
        riders: [
          "Total Disability Benefit (waiver of premium)",
          "Critical Illness Benefit",
          "Accidental Death Benefit",
          "Hospital Income Benefit",
        ],
        eligibility: [
          "Entry age: 0–70 years old",
          "Medical underwriting may apply for higher coverage",
        ],
        premium:
          "Regular pay (typically 5 or 10 years). Annual, semi-annual, quarterly or monthly modes. Indicative entry premium from ~₱30,000/year.",
        fundOptions: [
          "Sun Life Prosperity Peso Balanced Fund",
          "Equity Fund (aggressive growth)",
          "Bond Fund (conservative)",
          "Dynamic / Index funds",
        ],
        idealFor:
          "Young professionals and families who want protection that also builds long-term wealth.",
        faqs: [
          {
            q: "What happens after I finish paying?",
            a: "Your coverage and investment continue for life; you simply stop paying premiums while the fund value keeps working.",
          },
          {
            q: "Can I lose money?",
            a: "Fund values move with the market and are not guaranteed, so values can rise or fall. It's designed for the long term (10+ years).",
          },
          {
            q: "Is the death benefit taxable?",
            a: "Life insurance proceeds paid to named beneficiaries are generally exempt from estate tax in the Philippines.",
          },
        ],
      },
      {
        name: "Sun FlexiLink",
        category: "VUL",
        tagline: "Flexible regular-pay VUL you can adjust",
        overview:
          "Sun FlexiLink is a flexible VUL that lets you adjust your insurance coverage and investment as your needs change. You can top up your investment, switch funds, or change your face amount over time.",
        highlights: ["Adjustable cover", "Top-ups anytime", "Fund switching"],
        benefits: [
          "Increase or decrease your insurance coverage as life changes",
          "Add extra investment (top-ups) whenever you have surplus",
          "Switch between funds based on your risk appetite",
          "Access fund value through partial withdrawals",
        ],
        coverage: [
          "Life insurance coverage plus fund value",
          "Optional accident and health riders",
        ],
        riders: [
          "Critical Illness Benefit",
          "Total Disability Waiver",
          "Accidental Death Benefit",
        ],
        eligibility: ["Entry age: 0–70 years old", "Simplified issue for smaller cover"],
        premium:
          "Regular pay with flexible top-ups. Annual to monthly modes. Indicative from ~₱20,000/year.",
        fundOptions: [
          "Peso Balanced Fund",
          "Peso Equity Fund",
          "Peso Bond Fund",
        ],
        idealFor:
          "Clients who want a single plan that grows and flexes with their changing goals.",
        faqs: [
          {
            q: "What's the difference vs MaxiLink Prime?",
            a: "FlexiLink emphasizes flexibility (adjust cover/top-ups anytime); MaxiLink Prime emphasizes a fixed limited-pay schedule with loyalty bonuses.",
          },
          {
            q: "Can I pause payments?",
            a: "If your fund value is sufficient, premium holidays may be possible, subject to charges.",
          },
        ],
      },
      {
        name: "Sun MaxiLink One",
        category: "VUL",
        tagline: "Single-pay: invest a lump sum, stay covered for life",
        overview:
          "Sun MaxiLink One is a single-premium VUL — you pay once and immediately get life insurance plus an invested fund. Ideal for putting idle savings to work while gaining protection.",
        highlights: ["One-time premium", "Instant cover", "Lump-sum growth"],
        benefits: [
          "Pay only once, no recurring premiums to manage",
          "Immediate life insurance coverage from day one",
          "Lump sum is invested for long-term compounding",
          "Partial withdrawals available when needed",
        ],
        coverage: [
          "Life insurance benefit equal to face amount or fund value",
          "Optional riders for accident/health",
        ],
        eligibility: ["Entry age: 0–70 years old", "Higher minimum due to single-pay"],
        premium:
          "Single premium, indicative minimum from ~₱100,000 (one-time).",
        fundOptions: ["Peso Balanced Fund", "Peso Equity Fund", "Dollar funds (selected)"],
        idealFor:
          "Clients with a lump sum (bonus, inheritance, maturing plan) seeking protection + growth.",
        faqs: [
          {
            q: "Do I ever pay again?",
            a: "No — it's a one-time premium. You may choose to top up voluntarily later.",
          },
        ],
      },
      {
        name: "Sun FIT and Well",
        category: "Health",
        tagline: "Critical illness & wellness protection",
        overview:
          "Sun FIT and Well is a health-focused plan offering critical illness coverage with cash benefits on diagnosis, plus wellness perks that reward healthy living. It can stand alone or complement a VUL base plan.",
        highlights: ["100+ conditions", "Cash on diagnosis", "Wellness rewards"],
        benefits: [
          "Lump-sum cash benefit upon diagnosis of covered critical illnesses",
          "Covers early to advanced stages of many conditions",
          "Rewards and discounts for healthy habits",
          "Benefit can be used freely — treatment, income replacement, or debt",
        ],
        coverage: [
          "Major critical illnesses (cancer, heart attack, stroke, etc.)",
          "Multiple-stage / multiple-claim options on selected versions",
        ],
        eligibility: ["Entry age commonly 18–60", "Health questionnaire / underwriting"],
        premium: "Regular pay; indicative from ~₱15,000/year depending on age and cover.",
        idealFor:
          "Breadwinners worried about the financial impact of a major illness.",
        faqs: [
          {
            q: "Do I still get the benefit if I recover?",
            a: "Yes — the cash benefit is paid on diagnosis regardless of recovery or actual medical spend.",
          },
        ],
      },
      {
        name: "Sun Safer Life",
        category: "Life",
        tagline: "Affordable guaranteed protection",
        overview:
          "Sun Safer Life is a traditional life insurance plan offering high guaranteed coverage at an affordable premium, with guaranteed cash values that build over time. No market risk.",
        highlights: ["Guaranteed values", "High cover, low cost", "No market risk"],
        benefits: [
          "Large life insurance coverage for a low premium",
          "Guaranteed cash values you can borrow against",
          "Fixed, predictable premiums",
          "Peace of mind without investment volatility",
        ],
        coverage: ["Guaranteed death benefit", "Guaranteed cash value", "Optional riders"],
        riders: ["Accidental Death Benefit", "Waiver of Premium"],
        eligibility: ["Entry age: 0–70 years old"],
        premium: "Limited or regular pay; indicative from ~₱12,000/year.",
        idealFor: "First-time buyers and the budget-conscious wanting pure protection.",
        faqs: [
          {
            q: "Is this a VUL?",
            a: "No — it's traditional insurance with guaranteed values and no investment-market exposure.",
          },
        ],
      },
      {
        name: "Sun MaxiLink Bright",
        category: "Education",
        tagline: "Education-focused VUL for your child's future",
        overview:
          "Sun MaxiLink Bright is a VUL designed around education goals — it provides life protection on the paying parent while building an investment fund timed to a child's schooling milestones.",
        highlights: ["Education fund", "Parent protection", "Goal-timed payouts"],
        benefits: [
          "Builds a fund you can draw for tuition milestones",
          "Protects the child's future even if the parent passes away",
          "Investment growth potential over the education horizon",
          "Flexible withdrawals aligned to school years",
        ],
        coverage: ["Life insurance on the payor-parent", "Fund value for education"],
        riders: ["Payor waiver of premium on death/disability"],
        eligibility: ["Parent entry age typically 18–55"],
        premium: "Regular pay; indicative from ~₱25,000/year.",
        fundOptions: ["Balanced Fund", "Equity Fund"],
        idealFor: "Parents who want to guarantee a child's education fund.",
        faqs: [
          {
            q: "What if the parent dies early?",
            a: "With the payor waiver, future premiums are waived and the education fund stays on track.",
          },
        ],
      },
      {
        name: "Sun MaxiLink 100",
        category: "VUL",
        tagline: "Lifetime VUL with coverage guaranteed to age 100",
        overview:
          "Sun MaxiLink 100 is a peso VUL engineered for lifelong protection — your insurance coverage is guaranteed up to age 100 regardless of how the funds perform, while your money still gets invested for growth.",
        highlights: ["Cover to age 100", "Guaranteed protection", "Limited pay"],
        benefits: [
          "Life coverage guaranteed up to age 100 even if fund value dips",
          "Limited premium-paying period (commonly 5 or 10 years)",
          "Invested in Sun Life managed funds for long-term growth",
          "Partial withdrawals available for milestones or emergencies",
        ],
        coverage: [
          "Guaranteed death benefit to age 100",
          "Fund value on top of the face amount",
          "Optional living benefits via riders",
        ],
        riders: [
          "Critical Illness Benefit",
          "Total Disability Waiver",
          "Accidental Death Benefit",
        ],
        eligibility: ["Entry age: 0–70 years old", "Medical underwriting may apply"],
        premium:
          "Limited pay (5 or 10 years). Annual to monthly modes. Indicative entry premium from ~₱30,000/year.",
        fundOptions: [
          "Sun Life Prosperity Peso Balanced Fund",
          "Equity Fund",
          "Bond Fund",
        ],
        idealFor:
          "Clients who want the certainty of lifelong coverage plus the upside of investing.",
        faqs: [
          {
            q: "How is this different from MaxiLink Prime?",
            a: "MaxiLink 100 emphasizes guaranteed coverage all the way to age 100; Prime emphasizes a limited-pay schedule with loyalty bonuses.",
          },
        ],
      },
      {
        name: "Sun Income Maximizer",
        category: "Income",
        tagline: "Single-pay plan that pays you regular cash benefits",
        overview:
          "Sun Income Maximizer is a single-premium investment-linked plan that converts a lump sum into regular cash payouts, giving clients an income stream while keeping life protection in force.",
        highlights: ["Single pay", "Regular income", "Life cover"],
        benefits: [
          "Pay once and receive periodic cash benefits",
          "Life insurance protection alongside the payouts",
          "Remaining fund value continues to be invested",
          "Lump-sum and withdrawal flexibility",
        ],
        coverage: [
          "Life insurance benefit",
          "Scheduled cash payouts from fund value",
        ],
        eligibility: ["Entry age: 0–70 years old", "Higher minimum due to single-pay"],
        premium: "Single premium; indicative minimum from ~₱250,000 (one-time).",
        fundOptions: ["Peso Balanced Fund", "Peso Bond Fund"],
        idealFor:
          "Retirees or clients with a lump sum who want a recurring income stream plus protection.",
        faqs: [
          {
            q: "Are the payouts guaranteed?",
            a: "Payouts depend on fund performance and policy terms; they are designed to be regular but values are not guaranteed.",
          },
        ],
      },
    ],
  },
  {
    id: "prulife",
    name: "Pru Life Insurance Corporation of U.K.",
    short: "Pru Life UK",
    tagline: "We DO Wealth — a top VUL innovator",
    about:
      "A subsidiary of British financial giant Prudential plc, Pru Life UK pioneered VUL in the Philippines and is consistently a top-2 insurer by premium income.",
    founded: "1996 (PH operations)",
    color: "#ed1b2e",
    onColor: "#ffffff",
    products: [
      {
        name: "PRUMillionaire",
        category: "VUL",
        tagline: "Single-pay plan aimed at building your first million",
        overview:
          "PRUMillionaire is a single-premium investment-linked plan built for wealth accumulation. A one-time payment buys lifelong life insurance and access to professionally managed, even globally themed, funds.",
        highlights: ["Single pay", "Wealth focus", "Global funds"],
        benefits: [
          "One-time premium for lifelong coverage",
          "Access to local and globally themed investment funds",
          "Strong wealth-accumulation orientation with light insurance charges",
          "Withdraw fund value when goals or emergencies arise",
        ],
        coverage: ["Life insurance benefit", "Fund value payable on death"],
        eligibility: ["Entry age commonly 0–70", "Higher minimum for single-pay"],
        premium: "Single premium; indicative minimum from ~₱100,000.",
        fundOptions: [
          "PRULink Peso Bond Fund",
          "PRULink Equity Fund",
          "PRULink Proactive Fund",
          "PRULink Global themed funds",
        ],
        idealFor: "Clients with a lump sum who prioritize investment growth.",
        faqs: [
          {
            q: "Why 'Millionaire'?",
            a: "It's positioned to grow a lump sum toward seven-figure goals over the long term — values are not guaranteed.",
          },
        ],
      },
      {
        name: "PRULink Assurance Account",
        category: "VUL",
        tagline: "Regular-pay protection + investment workhorse",
        overview:
          "The PRULink Assurance Account (PAA) is Pru Life UK's core regular-pay VUL, balancing solid life protection with fund growth and the flexibility to add riders and top-ups.",
        highlights: ["Regular pay", "Rider-ready", "Top-ups"],
        benefits: [
          "Life protection plus invested fund value",
          "Wide rider menu for health, accident and disability",
          "Top-up your investment anytime",
          "Switch funds as your goals evolve",
        ],
        coverage: ["Death benefit", "Living benefits via riders"],
        riders: [
          "Crisis Cover (critical illness)",
          "PRUHospital Income",
          "Accidental Death & Disablement",
          "Waiver of premium",
        ],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱18,000–₱24,000/year.",
        fundOptions: ["Peso Bond Fund", "Equity Fund", "Managed Fund", "Proactive Fund"],
        idealFor: "Clients wanting one flexible plan for protection and investing.",
        faqs: [
          {
            q: "How many riders can I add?",
            a: "Several — advisors typically stack critical illness, hospital income and waiver riders onto the base plan.",
          },
        ],
      },
      {
        name: "PRULife Your Term",
        category: "Life",
        tagline: "Maximum pure protection per peso",
        overview:
          "PRULife Your Term is affordable term life insurance giving the highest coverage for the lowest cost. It's renewable and can often be converted to a permanent plan later.",
        highlights: ["High cover, low cost", "Renewable", "Convertible"],
        benefits: [
          "Very high life coverage at a low premium",
          "Ideal income-replacement for young families",
          "Renewable terms as your needs continue",
          "Convertible to permanent/VUL plans without new medical exams (subject to terms)",
        ],
        coverage: ["Pure life insurance death benefit"],
        riders: ["Accidental Death", "Critical Illness add-on"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Low regular premium; indicative from ~₱6,000/year for sizeable cover.",
        idealFor: "Young breadwinners needing big protection on a tight budget.",
        faqs: [
          {
            q: "Do I get money back?",
            a: "Pure term has no cash value — you pay only for protection, which is why it's cheap.",
          },
        ],
      },
      {
        name: "PRUHealth",
        category: "Health",
        tagline: "Critical illness & hospital protection",
        overview:
          "PRUHealth bundles health-focused benefits — hospital income and critical illness cash — that can be attached to a base plan to cushion the cost of getting sick.",
        highlights: ["Hospital cash", "Critical illness", "Attachable"],
        benefits: [
          "Daily cash while hospitalized",
          "Lump-sum benefit on diagnosis of covered critical illnesses",
          "Helps cover income lost during treatment",
          "Simple, affordable add-on to a base policy",
        ],
        coverage: ["Hospital income benefit", "Critical illness benefit"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Rider premium varies by age and benefit level.",
        idealFor: "Anyone wanting medical-cost cushioning on top of life cover.",
        faqs: [
          {
            q: "Is this an HMO?",
            a: "No — it pays cash benefits to you, which you can use any way you like, rather than paying hospitals directly.",
          },
        ],
      },
      {
        name: "PRUWealth (PHP)",
        category: "VUL",
        tagline: "Wealth-building plan with guaranteed elements",
        overview:
          "PRUWealth is a long-horizon VUL geared toward wealth accumulation, blending market-linked growth with structured features for clients focused on building capital over time.",
        highlights: ["Long-term growth", "Capital build-up", "Flexible"],
        benefits: [
          "Disciplined long-term wealth accumulation",
          "Life protection alongside investing",
          "Flexible top-ups and partial withdrawals",
          "Fund choices across risk levels",
        ],
        coverage: ["Life insurance benefit", "Fund value"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        fundOptions: ["Peso Bond Fund", "Equity Fund", "Proactive Fund"],
        idealFor: "Clients prioritizing capital growth with insurance attached.",
        faqs: [
          {
            q: "How long should I hold it?",
            a: "VUL is a long-term commitment — typically 10 years or more to ride out market cycles.",
          },
        ],
      },
      {
        name: "PRULink Investor Account",
        category: "VUL",
        tagline: "Single-pay plan built for serious investors",
        overview:
          "The PRULink Investor Account (PIA) is a single-premium investment-linked plan that maximizes investment exposure with lighter insurance charges, ideal for clients who prioritize growing a lump sum.",
        highlights: ["Single pay", "Investment-led", "Fund switching"],
        benefits: [
          "One-time premium deployed into your chosen funds",
          "Lower insurance charges mean more money stays invested",
          "Free fund switches as markets and goals change",
          "Partial withdrawals when you need liquidity",
        ],
        coverage: ["Life insurance benefit", "Fund value payable on death"],
        eligibility: ["Entry age commonly 0–70", "Higher single-pay minimum"],
        premium: "Single premium; indicative minimum from ~₱100,000.",
        fundOptions: [
          "PRULink Bond Fund",
          "PRULink Equity Fund",
          "PRULink Proactive Fund",
          "PRULink Global themed funds",
        ],
        idealFor: "Investment-minded clients with a lump sum seeking growth with light cover.",
        faqs: [
          {
            q: "Is most of my money invested?",
            a: "Yes — PIA is structured so a large share of the single premium goes to investment, with minimal insurance cost.",
          },
        ],
      },
      {
        name: "PRUVantage Life",
        category: "VUL",
        tagline: "Regular-pay VUL with welcome bonuses",
        overview:
          "PRUVantage Life is a regular-pay investment-linked plan that rewards consistency with welcome and loyalty add-ons, balancing protection with disciplined long-term investing.",
        highlights: ["Welcome bonus", "Regular pay", "Loyalty add-ons"],
        benefits: [
          "Extra units credited early to boost your fund",
          "Life protection plus market-linked growth",
          "Loyalty bonuses the longer you stay invested",
          "Top-ups and fund switching supported",
        ],
        coverage: ["Death benefit", "Fund value", "Living benefits via riders"],
        riders: ["Crisis Cover (critical illness)", "PRUHospital Income", "Waiver of premium"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        fundOptions: ["Peso Bond Fund", "Equity Fund", "Proactive Fund"],
        idealFor: "Clients who can commit to regular premiums and want bonus-boosted growth.",
        faqs: [
          {
            q: "What is the welcome bonus?",
            a: "Additional fund units are credited in the early years to jump-start your investment, subject to the plan's terms.",
          },
        ],
      },
    ],
  },
  {
    id: "axa",
    name: "AXA Philippines (Philippine AXA Life Insurance Corp.)",
    short: "AXA",
    tagline: "Know You Can — global protection expertise",
    about:
      "A partnership of the global AXA Group and the Metrobank Group (GT Capital), AXA Philippines is a top insurer strong in both life and health, including international health cover.",
    founded: "1999 (PH operations)",
    color: "#00008f",
    onColor: "#ffffff",
    products: [
      {
        name: "Asset Master",
        category: "VUL",
        tagline: "Wealth-building investment life plan",
        overview:
          "Asset Master is AXA's flagship regular-pay VUL focused on growing wealth while keeping you protected. It offers a range of funds and optional riders to customize coverage.",
        highlights: ["Wealth growth", "Fund choices", "Customizable"],
        benefits: [
          "Life insurance plus market-linked fund growth",
          "Choose funds matched to your risk appetite",
          "Add health and accident riders as needed",
          "Partial withdrawals for milestones",
        ],
        coverage: ["Death benefit", "Fund value", "Optional living benefits"],
        riders: ["Critical Illness", "Hospital Cash", "Waiver of premium"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱20,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Peso Bond", "Dollar funds"],
        idealFor: "Wealth accumulators who want flexible protection.",
        faqs: [
          {
            q: "Can I invest in dollars?",
            a: "Selected AXA plans offer USD-denominated funds for currency diversification.",
          },
        ],
      },
      {
        name: "Global Health Access",
        category: "Health",
        tagline: "International, comprehensive health insurance",
        overview:
          "Global Health Access is a premium international health plan covering hospitalization and treatment locally and abroad, with high annual limits and cashless access to a wide hospital network.",
        highlights: ["Worldwide cover", "High limits", "Cashless network"],
        benefits: [
          "In-patient and selected out-patient cover internationally",
          "Very high annual benefit limits",
          "Cashless admission at accredited hospitals",
          "Access to treatment in top facilities abroad",
        ],
        coverage: [
          "Hospitalization & surgery",
          "Cancer and major illness treatment",
          "Selected out-patient and wellness benefits",
        ],
        eligibility: ["Entry age varies by plan tier", "Medical underwriting applies"],
        premium: "Higher annual premium reflecting comprehensive cover; varies by area of cover.",
        idealFor: "Executives, OFWs and families wanting world-class medical access.",
        faqs: [
          {
            q: "Does it work overseas?",
            a: "Yes — depending on the chosen area of cover (e.g., Asia, worldwide ex-US, worldwide).",
          },
        ],
      },
      {
        name: "Life Basix",
        category: "VUL",
        tagline: "Affordable starter VUL with essential cover",
        overview:
          "Life Basix is an entry-level VUL that makes protection-plus-investment accessible at a lower premium, letting first-timers start building coverage and a fund early.",
        highlights: ["Affordable entry", "Protection + fund", "Scales up"],
        benefits: [
          "Lower premium entry into VUL",
          "Life cover plus invested fund value",
          "Increase coverage as income grows",
          "Optional riders for health and accident",
        ],
        coverage: ["Death benefit", "Fund value"],
        riders: ["Critical Illness", "Accident"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱15,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity"],
        idealFor: "First-time policyholders easing into VUL.",
        faqs: [
          {
            q: "Can I upgrade later?",
            a: "Yes — you can increase coverage or top up the investment as your earnings grow.",
          },
        ],
      },
      {
        name: "Health Max",
        category: "Health",
        tagline: "Critical illness cover with cash benefits",
        overview:
          "Health Max provides lump-sum cash on diagnosis of major critical illnesses, helping clients face treatment costs and income disruption without draining savings.",
        highlights: ["Lump-sum cash", "Major illnesses", "Income shield"],
        benefits: [
          "Cash benefit on diagnosis of covered conditions",
          "Use the money for treatment, income or debt",
          "Pairs with a life base plan",
          "Renewable protection",
        ],
        coverage: ["Major critical illnesses", "Optional multi-stage cover"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; varies by age and benefit level.",
        idealFor: "Clients worried about cancer/heart/stroke costs.",
        faqs: [
          {
            q: "When is it paid?",
            a: "Upon confirmed diagnosis of a covered illness per the policy definitions.",
          },
        ],
      },
      {
        name: "AXA Academ Assist",
        category: "Education",
        tagline: "Education funding with parent protection",
        overview:
          "Academ Assist is an education-oriented plan that secures a child's schooling fund while protecting the paying parent, so studies continue even if the unexpected happens.",
        highlights: ["Education fund", "Parent waiver", "Milestone payouts"],
        benefits: [
          "Builds a fund for tuition and school milestones",
          "Premiums waived if the parent dies or is disabled",
          "Investment growth over the education horizon",
          "Flexible withdrawals by school year",
        ],
        coverage: ["Life cover on parent", "Education fund value"],
        riders: ["Payor waiver of premium"],
        eligibility: ["Parent entry age typically 18–55"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        fundOptions: ["Balanced", "Equity"],
        idealFor: "Parents securing a child's education.",
        faqs: [
          {
            q: "What if I can't keep paying?",
            a: "With the payor waiver active, premiums are waived on death/disability and the fund continues.",
          },
        ],
      },
      {
        name: "AXA Retire Happy",
        category: "Retirement",
        tagline: "Build a comfortable, self-funded retirement",
        overview:
          "AXA Retire Happy is a retirement-focused investment-linked plan that helps clients accumulate a fund for their non-earning years, with the flexibility to draw a regular income at retirement.",
        highlights: ["Retirement fund", "Income at retirement", "Investment growth"],
        benefits: [
          "Disciplined long-term saving toward retirement",
          "Market-linked growth over your working years",
          "Option to convert the fund into regular income later",
          "Life protection while you accumulate",
        ],
        coverage: ["Fund value for retirement", "Life insurance benefit"],
        riders: ["Waiver of premium", "Critical Illness"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Dollar funds"],
        idealFor: "Professionals who want to fund their own comfortable retirement.",
        faqs: [
          {
            q: "When can I start drawing income?",
            a: "Typically at your chosen retirement age, when the accumulated fund can be structured into regular withdrawals.",
          },
        ],
      },
      {
        name: "AXA MyLifeChoice",
        category: "VUL",
        tagline: "Protection-first VUL with premium payback option",
        overview:
          "MyLifeChoice is a flexible VUL focused on high protection, with options that can return a portion of premiums if no claim is made — pairing security with a savings-style payback.",
        highlights: ["High protection", "Premium payback", "Flexible"],
        benefits: [
          "Large life coverage for income replacement",
          "Optional payback of premiums when you reach a milestone",
          "Adjustable coverage and top-ups",
          "Attachable health and accident riders",
        ],
        coverage: ["Death benefit", "Fund value", "Optional living benefits"],
        riders: ["Critical Illness", "Hospital Cash", "Waiver of premium"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity"],
        idealFor: "Breadwinners who want strong protection with a savings element.",
        faqs: [
          {
            q: "Do I get premiums back?",
            a: "Selected configurations include a payback feature; the exact terms depend on the plan option chosen.",
          },
        ],
      },
    ],
  },
  {
    id: "manulife",
    name: "The Manufacturers Life Insurance Co. (Phils.), Inc.",
    short: "Manulife",
    tagline: "Every Day Better — decisions made easier",
    about:
      "A subsidiary of Canada's Manulife Financial, one of the world's largest insurers, offering protection, health and investment-linked solutions in the Philippines.",
    founded: "1907 (PH operations)",
    color: "#00a758",
    onColor: "#ffffff",
    products: [
      {
        name: "ManuOne",
        category: "VUL",
        tagline: "All-in-one protection & investment",
        overview:
          "ManuOne is a single, customizable VUL that combines life protection and investment so clients can pursue multiple goals through one simple plan with flexible top-ups and withdrawals.",
        highlights: ["One plan, many goals", "Flexible", "Built-in cover"],
        benefits: [
          "Life insurance with invested fund value",
          "Top up or withdraw as needs change",
          "Customize cover with riders",
          "Simple to manage — everything in one policy",
        ],
        coverage: ["Death benefit", "Fund value", "Optional living benefits"],
        riders: ["Critical illness", "Accident", "Waiver of premium"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Peso Bond"],
        idealFor: "Busy clients who want simplicity without sacrificing flexibility.",
        faqs: [
          {
            q: "Why 'one'?",
            a: "It consolidates protection and investing in one policy, reducing the number of plans to track.",
          },
        ],
      },
      {
        name: "Manulife iInvest",
        category: "VUL",
        tagline: "Single-pay investment plan",
        overview:
          "Manulife iInvest is a single-premium VUL that puts a lump sum to work in diversified funds while providing immediate life coverage — convenient for clients with idle savings.",
        highlights: ["One-time premium", "Diversified funds", "Instant cover"],
        benefits: [
          "Pay once, invest for the long term",
          "Immediate life insurance protection",
          "Diversified fund choices",
          "Partial withdrawals available",
        ],
        coverage: ["Life benefit", "Fund value"],
        eligibility: ["Entry age commonly 0–70", "Higher single-pay minimum"],
        premium: "Single premium; indicative from ~₱100,000.",
        fundOptions: ["Balanced", "Equity", "Bond"],
        idealFor: "Clients with idle cash seeking growth plus protection.",
        faqs: [
          { q: "Recurring payments?", a: "None — it's a one-time premium with optional voluntary top-ups." },
        ],
      },
      {
        name: "Affluence Builder",
        category: "Education",
        tagline: "Goal & education funding with guarantees",
        overview:
          "Affluence Builder targets milestone goals like education, providing scheduled payouts and a premium waiver so the plan stays on track even if the payor is gone.",
        highlights: ["Milestone payouts", "Disability waiver", "Goal-based"],
        benefits: [
          "Guaranteed cash payouts at set milestones",
          "Waiver of premium on disability/death of payor",
          "Disciplined saving toward big goals",
          "Life protection included",
        ],
        coverage: ["Scheduled milestone benefits", "Life cover on payor"],
        riders: ["Payor waiver of premium"],
        eligibility: ["Payor entry age typically 18–55"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        idealFor: "Parents funding college and milestone goals.",
        faqs: [
          { q: "Are payouts guaranteed?", a: "The scheduled milestone benefits include guaranteed components per the plan terms." },
        ],
      },
      {
        name: "Manulife HealthFlex",
        category: "Health",
        tagline: "Critical illness protection that flexes",
        overview:
          "HealthFlex provides critical illness coverage with a lump-sum payout on diagnosis across many conditions, giving clients financial breathing room during treatment.",
        highlights: ["Many conditions", "Lump-sum payout", "Renewable"],
        benefits: [
          "Covers dozens of critical conditions",
          "Cash on diagnosis to use freely",
          "Renewable coverage",
          "Attachable to a base plan",
        ],
        coverage: ["Major critical illnesses", "Early-stage options on selected versions"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; varies by age and cover.",
        idealFor: "Health-conscious professionals managing illness risk.",
        faqs: [
          { q: "Multiple claims?", a: "Selected versions allow multiple/stage-based claims — check the specific plan." },
        ],
      },
      {
        name: "Manulife Income Protect",
        category: "Income",
        tagline: "Replace income for your family",
        overview:
          "Income Protect is built to replace lost income for dependents, paying out a benefit that helps a family maintain its lifestyle if the breadwinner passes away or is disabled.",
        highlights: ["Income replacement", "Family safety net", "Disability cover"],
        benefits: [
          "Provides ongoing income support to dependents",
          "Disability protection options",
          "Helps maintain household lifestyle",
          "Affordable protection focus",
        ],
        coverage: ["Death benefit as income stream/lump sum", "Disability options"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱12,000/year.",
        idealFor: "Sole breadwinners protecting dependents.",
        faqs: [
          { q: "Lump sum or monthly?", a: "Depending on the configuration, benefits can be structured as income or lump sum." },
        ],
      },
      {
        name: "Manulife FutureGenius",
        category: "Education",
        tagline: "Education plan with guaranteed milestone payouts",
        overview:
          "Manulife FutureGenius is an education-focused plan delivering guaranteed cash benefits aligned to a child's school years, with a premium waiver that keeps the fund intact if the payor passes away or is disabled.",
        highlights: ["Guaranteed payouts", "School-year timing", "Payor waiver"],
        benefits: [
          "Guaranteed education benefits timed to college milestones",
          "Premiums waived on death/disability of the payor",
          "Optional investment component for extra growth",
          "Life protection on the paying parent",
        ],
        coverage: ["Scheduled education payouts", "Life cover on payor"],
        riders: ["Payor waiver of premium"],
        eligibility: ["Payor entry age typically 18–55"],
        premium: "Regular pay; indicative from ~₱30,000/year.",
        idealFor: "Parents who want a guaranteed, milestone-based education fund.",
        faqs: [
          {
            q: "Are the education payouts guaranteed?",
            a: "Yes — FutureGenius provides guaranteed milestone benefits, with optional investment top-ups for added growth.",
          },
        ],
      },
      {
        name: "Manulife Heirloom",
        category: "Life",
        tagline: "Legacy whole-life plan for wealth transfer",
        overview:
          "Manulife Heirloom is a high-coverage whole-life plan designed for estate planning and legacy creation, helping affluent clients pass on wealth to the next generation tax-efficiently.",
        highlights: ["Legacy planning", "High coverage", "Wealth transfer"],
        benefits: [
          "Large guaranteed life coverage for estate creation",
          "Tax-efficient transfer of wealth to heirs",
          "Builds guaranteed cash value over time",
          "Limited premium-paying period options",
        ],
        coverage: ["Guaranteed death benefit", "Guaranteed cash value"],
        riders: ["Waiver of premium", "Accidental Death"],
        eligibility: ["Entry age commonly 18–70", "Financial underwriting for large cover"],
        premium: "Limited or regular pay; premium scales with the legacy amount.",
        idealFor: "High-net-worth clients focused on estate and legacy planning.",
        faqs: [
          {
            q: "Why use insurance for legacy?",
            a: "Life insurance proceeds to named beneficiaries are generally estate-tax exempt in the Philippines, making it an efficient transfer tool.",
          },
        ],
      },
    ],
  },
  {
    id: "aia",
    name: "AIA Philippines Life and General Insurance Co. (formerly Philam Life)",
    short: "AIA Philippines",
    tagline: "Healthier, Longer, Better Lives",
    about:
      "Formerly Philam Life and now part of the pan-Asian AIA Group, a long-established giant known for its AIA Vitality wellness program and broad protection range.",
    founded: "1947 (as Philam Life)",
    color: "#d31145",
    onColor: "#ffffff",
    products: [
      {
        name: "AIA Health Cover",
        category: "Health",
        tagline: "Comprehensive health with AIA Vitality rewards",
        overview:
          "AIA Health Cover pairs hospitalization and critical illness protection with AIA Vitality — a science-backed wellness program that rewards healthy living with discounts and perks.",
        highlights: ["Hospital + CI", "AIA Vitality", "Premium discounts"],
        benefits: [
          "Hospitalization and critical illness coverage",
          "Earn rewards and premium discounts for healthy habits",
          "Partner perks (gyms, gadgets, travel)",
          "Encourages prevention, not just treatment",
        ],
        coverage: ["Hospital benefits", "Critical illness", "Wellness rewards"],
        riders: ["Accident", "Waiver of premium"],
        eligibility: ["Entry age varies by plan", "Vitality enrollment included"],
        premium: "Regular pay; varies by cover and Vitality status.",
        idealFor: "Clients who value wellness perks and prevention.",
        faqs: [
          { q: "What is AIA Vitality?", a: "A membership program that tracks healthy actions (exercise, check-ups) and rewards you, potentially lowering premiums." },
        ],
      },
      {
        name: "AIA Money Tree",
        category: "VUL",
        tagline: "Investment-linked life plan for growth",
        overview:
          "Money Tree is a VUL that grows wealth through market-linked funds while keeping clients protected, with flexible fund choices and partial withdrawals.",
        highlights: ["Wealth growth", "Fund choices", "Withdrawals"],
        benefits: [
          "Protection plus market-linked growth",
          "Multiple funds across risk levels",
          "Partial withdrawals for needs",
          "Long-term compounding potential",
        ],
        coverage: ["Death benefit", "Fund value"],
        riders: ["Critical illness", "Accident"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱20,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Dollar funds"],
        idealFor: "Long-term wealth builders.",
        faqs: [
          { q: "Guaranteed returns?", a: "No — fund values are market-linked and not guaranteed." },
        ],
      },
      {
        name: "AIA Future Cover",
        category: "Education",
        tagline: "Secure your child's education",
        overview:
          "Future Cover guarantees an education fund for a child while protecting the parent, ensuring schooling can continue regardless of life's surprises.",
        highlights: ["Education fund", "Parent waiver", "Flexible payouts"],
        benefits: [
          "Guaranteed education fund build-up",
          "Premium waiver on parent's death/disability",
          "Flexible payout scheduling",
          "Life protection on the parent",
        ],
        coverage: ["Education fund", "Parent life cover"],
        riders: ["Payor waiver"],
        eligibility: ["Parent entry age typically 18–55"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        idealFor: "Parents securing a child's future.",
        faqs: [
          { q: "Is the fund guaranteed?", a: "It includes guaranteed components depending on the chosen structure." },
        ],
      },
      {
        name: "AIA Critical Protect 100",
        category: "Health",
        tagline: "Critical illness cover up to age 100",
        overview:
          "Critical Protect 100 offers long-duration critical illness protection covering 100+ conditions, with the possibility of multiple claims, extending peace of mind to age 100.",
        highlights: ["100+ conditions", "Multiple claims", "To age 100"],
        benefits: [
          "Covers a very wide list of critical conditions",
          "Multiple payouts on selected versions",
          "Long protection horizon up to age 100",
          "Cash benefit to use as needed",
        ],
        coverage: ["Critical illnesses (early to advanced)", "Multi-claim options"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; varies by age and cover.",
        idealFor: "Clients with family illness history wanting long cover.",
        faqs: [
          { q: "Can I claim more than once?", a: "Yes — selected configurations allow multiple claims across condition groups." },
        ],
      },
      {
        name: "AIA Income Protect",
        category: "Income",
        tagline: "Income protection for your loved ones",
        overview:
          "AIA Income Protect focuses on replacing a breadwinner's income for dependents, helping a family stay financially stable through difficult transitions.",
        highlights: ["Income replacement", "Family security", "Affordable"],
        benefits: [
          "Provides income support to dependents",
          "Helps cover everyday living costs",
          "Affordable protection focus",
          "Optional disability features",
        ],
        coverage: ["Death/disability benefit as income or lump sum"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱12,000/year.",
        idealFor: "Breadwinners protecting dependents.",
        faqs: [
          { q: "Who receives the benefit?", a: "Your named beneficiaries, per the policy." },
        ],
      },
      {
        name: "AIA Wealth Builder",
        category: "VUL",
        tagline: "Regular-pay VUL focused on accumulation",
        overview:
          "AIA Wealth Builder is a regular-pay investment-linked plan geared toward long-term wealth accumulation, pairing market-linked fund growth with life protection and AIA Vitality wellness perks.",
        highlights: ["Wealth accumulation", "AIA Vitality", "Fund choices"],
        benefits: [
          "Disciplined long-term investing with life cover",
          "Earn rewards and discounts via AIA Vitality",
          "Choose funds across risk levels",
          "Top-ups and partial withdrawals supported",
        ],
        coverage: ["Death benefit", "Fund value", "Wellness rewards"],
        riders: ["Critical Illness", "Accident", "Waiver of premium"],
        eligibility: ["Entry age commonly 0–70", "Vitality enrollment available"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Dollar funds"],
        idealFor: "Clients building long-term wealth who value wellness rewards.",
        faqs: [
          {
            q: "How does Vitality help?",
            a: "Healthy actions earn points that unlock rewards and can improve your benefits over time.",
          },
        ],
      },
      {
        name: "AIA Family First Protect",
        category: "Life",
        tagline: "High-cover protection for your loved ones",
        overview:
          "Family First Protect is a protection-focused plan giving substantial life coverage at an accessible premium, prioritizing income replacement and family security over investment.",
        highlights: ["High cover", "Affordable", "Family security"],
        benefits: [
          "Large life coverage to replace lost income",
          "Affordable premiums focused on protection",
          "Optional critical illness and accident riders",
          "Peace of mind for dependents",
        ],
        coverage: ["Life insurance death benefit", "Optional living benefits"],
        riders: ["Critical Illness", "Accidental Death", "Waiver of premium"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱10,000/year for sizeable cover.",
        idealFor: "Young families needing maximum protection on a budget.",
        faqs: [
          {
            q: "Is there an investment component?",
            a: "This plan focuses on protection; pair it with a VUL like Wealth Builder if you also want investment growth.",
          },
        ],
      },
    ],
  },
  {
    id: "insular",
    name: "The Insular Life Assurance Company, Ltd.",
    short: "Insular Life",
    tagline: "The largest Filipino life insurer — since 1910",
    about:
      "The first and largest Filipino-owned life insurance company, mutualized and locally rooted, offering traditional and investment-linked plans.",
    founded: "1910",
    color: "#0033a0",
    onColor: "#ffffff",
    products: [
      {
        name: "Wealth Secure",
        category: "VUL",
        tagline: "Investment-linked protection, locally managed",
        overview:
          "Wealth Secure is Insular Life's VUL combining life protection with locally managed funds, appealing to clients who prefer a Filipino insurer with a long heritage.",
        highlights: ["Local insurer", "Protection + funds", "Top-ups"],
        benefits: [
          "Life cover plus fund growth",
          "Locally managed investment funds",
          "Flexible premium top-ups",
          "Partial withdrawals",
        ],
        coverage: ["Death benefit", "Fund value"],
        riders: ["Critical illness", "Accident", "Waiver"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Peso Fixed Income"],
        idealFor: "Clients who prefer a Filipino-owned insurer.",
        faqs: [
          { q: "Who manages the funds?", a: "Insular Life's in-house investment team manages the peso funds." },
        ],
      },
      {
        name: "I-Assure",
        category: "Life",
        tagline: "Whole-life guaranteed protection",
        overview:
          "I-Assure is a traditional whole-life plan with lifetime coverage, guaranteed cash values and limited-pay options — certainty without market risk.",
        highlights: ["Lifetime cover", "Guaranteed values", "Limited pay"],
        benefits: [
          "Coverage for your whole life",
          "Guaranteed cash values that grow",
          "Limited payment period options",
          "Borrow against cash value",
        ],
        coverage: ["Guaranteed death benefit", "Guaranteed cash value"],
        riders: ["Accidental death", "Waiver of premium"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Limited or regular pay; indicative from ~₱15,000/year.",
        idealFor: "Clients wanting guarantees and certainty.",
        faqs: [
          { q: "Is there market risk?", a: "No — values are guaranteed, unlike VUL." },
        ],
      },
      {
        name: "Educapital",
        category: "Education",
        tagline: "College fund builder",
        overview:
          "Educapital is designed to fund a child's college education through scheduled payouts, with a premium waiver protecting the plan if the payor is gone.",
        highlights: ["College payouts", "Premium waiver", "Disciplined saving"],
        benefits: [
          "Scheduled education benefit payouts",
          "Waiver of premium on payor death/disability",
          "Encourages disciplined saving",
          "Life protection included",
        ],
        coverage: ["Education benefits", "Life cover on payor"],
        riders: ["Payor waiver"],
        eligibility: ["Payor entry age typically 18–55"],
        premium: "Regular pay; indicative from ~₱20,000/year.",
        idealFor: "Parents with young children.",
        faqs: [
          { q: "When do payouts start?", a: "Around the child's college years, per the chosen schedule." },
        ],
      },
      {
        name: "I-Care",
        category: "Health",
        tagline: "Health & critical illness rider",
        overview:
          "I-Care adds hospital income and critical illness benefits to a base policy, helping families absorb medical costs and income loss during illness.",
        highlights: ["Hospital income", "Critical illness", "Attachable"],
        benefits: [
          "Daily cash while hospitalized",
          "Critical illness cash benefit",
          "Attachable to base plans",
          "Flexible benefit use",
        ],
        coverage: ["Hospital income", "Critical illness"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Rider premium varies by age and cover.",
        idealFor: "Families needing medical backup.",
        faqs: [
          { q: "Standalone?", a: "It's designed as a rider on an Insular Life base plan." },
        ],
      },
      {
        name: "I-Secure",
        category: "Life",
        tagline: "Affordable term protection",
        overview:
          "I-Secure is term life insurance giving high coverage at low cost for a set period — efficient income protection for young families.",
        highlights: ["High cover", "Low cost", "Term period"],
        benefits: [
          "Big life cover for a low premium",
          "Income replacement for dependents",
          "Renewable terms",
          "Simple and affordable",
        ],
        coverage: ["Pure life death benefit"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Low regular premium; indicative from ~₱6,000/year.",
        idealFor: "Young breadwinners on a budget.",
        faqs: [
          { q: "Cash value?", a: "Term insurance has no cash value — it's pure, low-cost protection." },
        ],
      },
      {
        name: "InLife Wealth Set Go",
        category: "VUL",
        tagline: "Affordable starter VUL from a Filipino insurer",
        overview:
          "Wealth Set Go is Insular Life's accessible entry-level VUL, letting first-timers start protection plus investing at a lower premium and scale up as their income grows.",
        highlights: ["Affordable entry", "Protection + fund", "Scales up"],
        benefits: [
          "Lower premium entry into VUL investing",
          "Life cover with market-linked fund growth",
          "Increase coverage and top up as you earn more",
          "Partial withdrawals when needed",
        ],
        coverage: ["Death benefit", "Fund value"],
        riders: ["Critical illness", "Accident", "Waiver"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱15,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity"],
        idealFor: "First-time policyholders who want a Filipino-owned VUL.",
        faqs: [
          {
            q: "Can I upgrade later?",
            a: "Yes — you can raise coverage or top up the investment as your earnings grow.",
          },
        ],
      },
      {
        name: "InLife Sheroes Flexi",
        category: "Health",
        tagline: "Protection designed for Filipino women",
        overview:
          "InLife Sheroes is a plan built around women's needs, combining life and health protection with benefits for female-specific conditions and access to a supportive community of women.",
        highlights: ["Women-focused", "Female condition cover", "Community perks"],
        benefits: [
          "Coverage for female-specific illnesses and conditions",
          "Life and health protection in one plan",
          "Maternity and wellness-related benefits on selected versions",
          "Access to the Sheroes community and events",
        ],
        coverage: ["Life cover", "Female critical illnesses", "Selected health benefits"],
        riders: ["Critical illness", "Hospital income"],
        eligibility: ["For women; entry age commonly 18–60"],
        premium: "Regular pay; varies by age and benefit level.",
        idealFor: "Women who want protection tailored to their specific health needs.",
        faqs: [
          {
            q: "What makes it women-focused?",
            a: "It covers female-specific conditions and bundles wellness and community benefits aimed at women.",
          },
        ],
      },
    ],
  },
  {
    id: "fwd",
    name: "FWD Life Insurance Corporation",
    short: "FWD Insurance",
    tagline: "Celebrate Living — insurance, reimagined",
    about:
      "A fast-growing, digital-first insurer backed by Pacific Century Group, known for simple products, modern branding and a customer-friendly experience.",
    founded: "2014 (PH operations)",
    color: "#e87722",
    onColor: "#ffffff",
    products: [
      {
        name: "Set for Life",
        category: "VUL",
        tagline: "Investment-linked life plan, made simple",
        overview:
          "Set for Life is FWD's flagship VUL pairing life protection with investment in a clean, easy-to-understand package that you can manage online.",
        highlights: ["Protection + investing", "Digital-first", "Flexible funds"],
        benefits: [
          "Life insurance plus invested fund value",
          "Manage and monitor online",
          "Flexible fund allocation and top-ups",
          "Optional riders for health and accident",
        ],
        coverage: ["Death benefit", "Fund value", "Optional living benefits"],
        riders: ["Critical illness", "Accident", "Waiver"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Peso Fixed Income"],
        idealFor: "Digital-savvy millennials wanting a modern plan.",
        faqs: [
          { q: "Can I manage it on an app?", a: "Yes — FWD emphasizes online and app-based servicing." },
        ],
      },
      {
        name: "Manifest Investments",
        category: "VUL",
        tagline: "Single-pay wealth plan",
        overview:
          "Manifest Investments is a single-premium VUL deploying a lump sum into curated funds with immediate life cover — fast wealth deployment for clients with capital.",
        highlights: ["One-time premium", "Curated funds", "Instant cover"],
        benefits: [
          "Pay once, invest for growth",
          "Immediate life protection",
          "Curated fund line-up",
          "Partial withdrawals available",
        ],
        coverage: ["Life benefit", "Fund value"],
        eligibility: ["Entry age commonly 0–70", "Higher single-pay minimum"],
        premium: "Single premium; indicative from ~₱100,000.",
        fundOptions: ["Balanced", "Equity", "Fixed Income"],
        idealFor: "Clients with lump-sum capital.",
        faqs: [
          { q: "Future payments?", a: "None required — it's single pay." },
        ],
      },
      {
        name: "Big 3 Critical Illness",
        category: "Health",
        tagline: "Focused cover for cancer, heart attack & stroke",
        overview:
          "Big 3 zeroes in on the three most common critical illnesses — cancer, heart attack and stroke — delivering targeted, affordable protection with quick payouts.",
        highlights: ["Cancer/heart/stroke", "Affordable", "Fast payout"],
        benefits: [
          "Targets the most common critical illnesses",
          "Lower premium for focused cover",
          "Lump-sum cash on diagnosis",
          "Simple to understand and buy",
        ],
        coverage: ["Cancer", "Heart attack", "Stroke"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Affordable regular premium; varies by age.",
        idealFor: "Budget-conscious clients prioritizing the big risks.",
        faqs: [
          { q: "Only three illnesses?", a: "Yes — it focuses cover (and cost) on the three most frequent critical illnesses." },
        ],
      },
      {
        name: "All-Set Income Protection",
        category: "Income",
        tagline: "Replace your income, protect your family",
        overview:
          "All-Set Income Protection provides an income safety net for dependents, with disability features so a family keeps cash flow if the breadwinner can't work.",
        highlights: ["Income replacement", "Disability cover", "Family net"],
        benefits: [
          "Replaces lost income for dependents",
          "Disability protection",
          "Maintains household stability",
          "Affordable focus",
        ],
        coverage: ["Death/disability benefit"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱12,000/year.",
        idealFor: "Sole breadwinners.",
        faqs: [
          { q: "Disability included?", a: "Income protection configurations include disability features — confirm the specific plan." },
        ],
      },
      {
        name: "Set for Tomorrow",
        category: "Retirement",
        tagline: "Savings & retirement build-up",
        overview:
          "Set for Tomorrow helps clients accumulate funds for future goals like retirement, blending disciplined saving with investment growth and life protection.",
        highlights: ["Retirement saving", "Growth", "Protection"],
        benefits: [
          "Build a fund for future goals",
          "Investment growth potential",
          "Life protection included",
          "Flexible contributions",
        ],
        coverage: ["Fund value", "Life cover"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Balanced", "Equity"],
        idealFor: "Clients saving toward retirement.",
        faqs: [
          { q: "Is this a pension?", a: "It's a savings/VUL approach to retirement — values depend on contributions and fund performance." },
        ],
      },
      {
        name: "FWD Set for Health",
        category: "Health",
        tagline: "Health protection that also invests",
        overview:
          "FWD Set for Health is an investment-linked plan with a strong health focus — it covers critical illness while building a fund, so you're protected against major medical events and still growing money.",
        highlights: ["Critical illness", "Investment growth", "Digital-first"],
        benefits: [
          "Lump-sum cash on diagnosis of covered critical illnesses",
          "Investment fund that grows alongside protection",
          "Manage and monitor everything online",
          "Flexible top-ups and withdrawals",
        ],
        coverage: ["Critical illness benefit", "Death benefit", "Fund value"],
        riders: ["Hospital cash", "Accident", "Waiver of premium"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱20,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity"],
        idealFor: "Health-conscious clients who want cover and investment in one plan.",
        faqs: [
          {
            q: "Do I keep the fund if I claim?",
            a: "The critical illness benefit is paid on diagnosis; remaining fund value stays invested per the plan terms.",
          },
        ],
      },
      {
        name: "FWD Set for Goals",
        category: "VUL",
        tagline: "Savings-style VUL for your life goals",
        overview:
          "FWD Set for Goals is a flexible investment-linked plan aimed at funding specific milestones — a home, a business, travel — by combining disciplined investing with life protection.",
        highlights: ["Goal-based", "Flexible funds", "Protection"],
        benefits: [
          "Build a fund toward specific life goals",
          "Life protection while you save",
          "Switch funds as your risk appetite changes",
          "Withdraw partially when a goal arrives",
        ],
        coverage: ["Death benefit", "Fund value"],
        riders: ["Critical illness", "Accident"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Peso Fixed Income"],
        idealFor: "Millennials saving toward concrete goals with protection attached.",
        faqs: [
          {
            q: "Can I have more than one goal?",
            a: "Yes — many advisors use top-ups and withdrawals to manage several milestones within one plan.",
          },
        ],
      },
    ],
  },
  {
    id: "allianz",
    name: "Allianz PNB Life Insurance, Inc.",
    short: "Allianz PNB",
    tagline: "We Secure Your Future — global strength",
    about:
      "A partnership between global insurer Allianz SE and the Philippine National Bank, combining international expertise with a strong local bancassurance network.",
    founded: "2016 (Allianz–PNB partnership)",
    color: "#003781",
    onColor: "#ffffff",
    products: [
      {
        name: "Allianz Well!",
        category: "Health",
        tagline: "Health-focused investment plan",
        overview:
          "Allianz Well! blends health protection with investment, giving clients medical cover and wellness benefits alongside the growth potential of a VUL.",
        highlights: ["Health + investing", "Wellness perks", "Flexible riders"],
        benefits: [
          "Health cover with investment growth",
          "Wellness-oriented benefits",
          "Flexible rider options",
          "Partial withdrawals for needs",
        ],
        coverage: ["Health benefits", "Death benefit", "Fund value"],
        riders: ["Critical illness", "Hospital cash"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱20,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity"],
        idealFor: "Clients wanting health and wealth in one plan.",
        faqs: [
          { q: "Is it mainly health or investment?", a: "It balances both — health protection with VUL-style growth." },
        ],
      },
      {
        name: "Allianz Optimal Care",
        category: "Health",
        tagline: "Critical illness protection",
        overview:
          "Optimal Care provides broad critical illness coverage with lump-sum payouts on diagnosis, helping clients meet treatment costs across many conditions.",
        highlights: ["Wide cover", "Lump-sum", "Renewable"],
        benefits: [
          "Covers a wide range of critical illnesses",
          "Lump-sum cash on diagnosis",
          "Renewable terms",
          "Use the benefit freely",
        ],
        coverage: ["Major critical illnesses", "Early-stage options"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; varies by age and cover.",
        idealFor: "Clients prioritizing illness risk.",
        faqs: [
          { q: "Early stages covered?", a: "Selected versions cover early-stage conditions — confirm the plan." },
        ],
      },
      {
        name: "Allianz Sulong",
        category: "Education",
        tagline: "Education & savings plan",
        overview:
          "Allianz Sulong is a goal-based plan that builds a fund for education and milestones with flexible premiums and life protection on the payor.",
        highlights: ["Goal-based", "Milestone payouts", "Flexible"],
        benefits: [
          "Builds a fund for education goals",
          "Milestone payouts",
          "Premium flexibility",
          "Life protection included",
        ],
        coverage: ["Education/milestone fund", "Life cover"],
        riders: ["Payor waiver"],
        eligibility: ["Payor entry age typically 18–55"],
        premium: "Regular pay; indicative from ~₱20,000/year.",
        fundOptions: ["Balanced", "Equity"],
        idealFor: "Parents planning ahead.",
        faqs: [
          { q: "What does 'Sulong' mean?", a: "It evokes moving forward — the plan funds future milestones." },
        ],
      },
      {
        name: "eAZy Health",
        category: "Health",
        tagline: "Simple online health cover",
        overview:
          "eAZy Health is a no-fuss, digitally bought health plan offering hospital cash benefits at an affordable premium — perfect for first-time buyers.",
        highlights: ["Buy online", "Affordable", "Hospital cash"],
        benefits: [
          "Fast digital application",
          "Affordable premiums",
          "Hospital cash benefit",
          "Straightforward coverage",
        ],
        coverage: ["Hospital income benefit", "Selected health benefits"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Low regular premium; varies by cover.",
        idealFor: "First-time, digital-first buyers.",
        faqs: [
          { q: "Do I need a medical exam?", a: "Simplified plans often need only a health questionnaire — confirm at application." },
        ],
      },
      {
        name: "Allianz Maginhawa",
        category: "Retirement",
        tagline: "Comfortable retirement income build-up",
        overview:
          "Allianz Maginhawa focuses on accumulating funds for a comfortable retirement, combining investment growth with life protection for long-term security.",
        highlights: ["Retirement", "Growth", "Protection"],
        benefits: [
          "Build a retirement nest egg",
          "Investment growth potential",
          "Life protection included",
          "Flexible contributions",
        ],
        coverage: ["Fund value", "Life cover"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Balanced", "Equity"],
        idealFor: "Clients building toward retirement.",
        faqs: [
          { q: "Guaranteed pension?", a: "Values are investment-linked; the goal is a comfortable retirement fund, not a fixed pension." },
        ],
      },
      {
        name: "Allianz Future Builder",
        category: "VUL",
        tagline: "Flagship regular-pay VUL with bonuses",
        overview:
          "Allianz Future Builder is a regular-pay investment-linked plan combining global investment expertise with life protection, rewarding long-term holders with loyalty bonuses and flexible fund choices.",
        highlights: ["Loyalty bonuses", "Global expertise", "Flexible funds"],
        benefits: [
          "Life protection plus market-linked fund growth",
          "Loyalty bonuses credited for staying invested",
          "Wide fund choices managed with Allianz expertise",
          "Top-ups, switches and partial withdrawals",
        ],
        coverage: ["Death benefit", "Fund value", "Living benefits via riders"],
        riders: ["Critical illness", "Hospital cash", "Waiver of premium"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Dollar funds"],
        idealFor: "Clients wanting a globally-backed VUL for long-term wealth.",
        faqs: [
          {
            q: "What are the loyalty bonuses?",
            a: "Extra fund units credited at set intervals for keeping the policy in force, subject to terms.",
          },
        ],
      },
      {
        name: "Allianz Secure Life",
        category: "Life",
        tagline: "Affordable, high-cover term protection",
        overview:
          "Allianz Secure Life is a straightforward term protection plan offering high life coverage at a low premium, focused on income replacement for families during their most vulnerable years.",
        highlights: ["High cover", "Low cost", "Renewable"],
        benefits: [
          "Big life coverage for a small premium",
          "Income replacement for dependents",
          "Renewable terms as needs continue",
          "Optional critical illness add-on",
        ],
        coverage: ["Pure life death benefit", "Optional living benefits"],
        riders: ["Critical illness", "Accidental death"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Low regular premium; indicative from ~₱8,000/year for sizeable cover.",
        idealFor: "Breadwinners needing maximum protection at minimum cost.",
        faqs: [
          {
            q: "Any cash value?",
            a: "No — term protection is pure cover, which is why the premium is low.",
          },
        ],
      },
    ],
  },
  {
    id: "bpiaia",
    name: "BPI AIA Life Assurance Corporation",
    short: "BPI AIA",
    tagline: "Bancassurance backed by BPI and AIA",
    about:
      "A strategic alliance between the Bank of the Philippine Islands and AIA, distributing insurance conveniently through BPI's vast branch network.",
    founded: "2009 (as BPI-Philam)",
    color: "#a6192e",
    onColor: "#ffffff",
    products: [
      {
        name: "Build Up Plan",
        category: "VUL",
        tagline: "Bank-linked investment life plan",
        overview:
          "Build Up Plan is a VUL distributed through BPI that pairs protection with investment, with the convenience of bank auto-debit and BPI-managed fund access.",
        highlights: ["Bank-linked", "Auto-debit", "Protection + funds"],
        benefits: [
          "Life cover plus invested fund value",
          "Convenient BPI auto-debit payments",
          "Fund choices via the bank",
          "Top-ups and withdrawals",
        ],
        coverage: ["Death benefit", "Fund value"],
        riders: ["Critical illness", "Accident"],
        eligibility: ["Entry age commonly 0–70", "BPI account convenient for billing"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Peso Bond"],
        idealFor: "BPI clients who want to invest and protect in one place.",
        faqs: [
          { q: "Do I need a BPI account?", a: "It's convenient for auto-debit billing but ask your advisor about options." },
        ],
      },
      {
        name: "Life Ready Plus",
        category: "Life",
        tagline: "Reliable long-term protection",
        overview:
          "Life Ready Plus offers steady, long-term life coverage with cash-value build-up and optional riders — dependable protection for families.",
        highlights: ["Steady cover", "Cash value", "Riders"],
        benefits: [
          "Long-term life coverage",
          "Cash value accumulation",
          "Optional health and accident riders",
          "Predictable protection",
        ],
        coverage: ["Death benefit", "Cash value", "Optional living benefits"],
        riders: ["Critical illness", "Accident", "Waiver"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱15,000/year.",
        idealFor: "Clients wanting dependable, lasting cover.",
        faqs: [
          { q: "Is it a VUL?", a: "It emphasizes protection with cash value; ask your advisor about investment-linked variants." },
        ],
      },
      {
        name: "Critical Care Max",
        category: "Health",
        tagline: "Critical illness cover via your bank",
        overview:
          "Critical Care Max delivers critical illness protection with cash on diagnosis, conveniently arranged through BPI's bancassurance channel.",
        highlights: ["Critical illness", "Cash on diagnosis", "Convenient"],
        benefits: [
          "Major illness protection",
          "Lump-sum cash benefit",
          "Attachable rider",
          "Convenient bank servicing",
        ],
        coverage: ["Major critical illnesses"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; varies by age and cover.",
        idealFor: "Health-aware bank clients.",
        faqs: [
          { q: "Standalone?", a: "Often offered as a rider on a base plan; confirm with your advisor." },
        ],
      },
      {
        name: "Invest Max",
        category: "VUL",
        tagline: "Single-pay investment plan via BPI",
        overview:
          "Invest Max is a single-premium VUL for clients with a lump sum, deploying capital into market-linked funds with immediate life cover through BPI.",
        highlights: ["One-time premium", "Market growth", "Instant cover"],
        benefits: [
          "Pay once and invest",
          "Immediate life protection",
          "Market-linked growth",
          "Partial withdrawals",
        ],
        coverage: ["Life benefit", "Fund value"],
        eligibility: ["Entry age commonly 0–70", "Higher single-pay minimum"],
        premium: "Single premium; indicative from ~₱100,000.",
        fundOptions: ["Balanced", "Equity", "Bond"],
        idealFor: "BPI clients with lump-sum capital.",
        faqs: [
          { q: "Recurring premium?", a: "No — single pay, with optional voluntary top-ups." },
        ],
      },
      {
        name: "Education Max",
        category: "Education",
        tagline: "Education funding through BPI",
        overview:
          "Education Max secures a child's education fund with parent protection and milestone payouts, arranged conveniently through the bank.",
        highlights: ["Education fund", "Parent waiver", "Convenient"],
        benefits: [
          "Builds a fund for tuition milestones",
          "Premium waiver on payor death/disability",
          "Convenient bank billing",
          "Life protection included",
        ],
        coverage: ["Education fund", "Parent life cover"],
        riders: ["Payor waiver"],
        eligibility: ["Payor entry age typically 18–55"],
        premium: "Regular pay; indicative from ~₱24,000/year.",
        idealFor: "Parents banking with BPI.",
        faqs: [
          { q: "When are payouts?", a: "Timed to schooling milestones per the chosen structure." },
        ],
      },
      {
        name: "BPI AIA Invest and Protect Plan",
        category: "VUL",
        tagline: "Balanced investment + protection via your bank",
        overview:
          "The Invest and Protect Plan is a regular-pay VUL distributed through BPI that splits your premium between solid life protection and market-linked investing, with convenient bank auto-debit.",
        highlights: ["Balanced split", "Bank auto-debit", "Fund choices"],
        benefits: [
          "Meaningful life cover plus invested fund value",
          "Convenient BPI auto-debit billing",
          "Choose funds matched to your risk appetite",
          "Top-ups and partial withdrawals supported",
        ],
        coverage: ["Death benefit", "Fund value", "Living benefits via riders"],
        riders: ["Critical illness", "Accident", "Waiver of premium"],
        eligibility: ["Entry age commonly 0–70", "BPI account convenient for billing"],
        premium: "Regular pay; indicative from ~₱20,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity", "Peso Bond"],
        idealFor: "BPI clients wanting a balanced protect-and-invest plan.",
        faqs: [
          {
            q: "How is the premium split?",
            a: "Part funds insurance charges and part is invested; the balance favors meaningful protection alongside growth.",
          },
        ],
      },
      {
        name: "BPI AIA Family First",
        category: "Life",
        tagline: "Protection-first cover for your family",
        overview:
          "Family First is a protection-focused plan offering substantial life coverage through BPI, prioritizing income replacement and family security with affordable, predictable premiums.",
        highlights: ["High cover", "Affordable", "Family security"],
        benefits: [
          "Large life coverage for income replacement",
          "Affordable, predictable premiums",
          "Convenient bank servicing and billing",
          "Optional critical illness and accident riders",
        ],
        coverage: ["Life insurance death benefit", "Optional living benefits"],
        riders: ["Critical illness", "Accidental death", "Waiver of premium"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; indicative from ~₱10,000/year for sizeable cover.",
        idealFor: "BPI clients who want maximum family protection affordably.",
        faqs: [
          {
            q: "Investment included?",
            a: "This plan focuses on protection; pair it with Build Up or Invest and Protect for investment growth.",
          },
        ],
      },
    ],
  },
  {
    id: "cocolife",
    name: "United Coconut Planters Life Assurance Corp. (Cocolife)",
    short: "Cocolife",
    tagline: "The largest Filipino-owned stock life insurer",
    about:
      "A major Filipino-owned insurer offering life, health (HMO) and pre-need-style plans, with strong reach in group and government accounts.",
    founded: "1978",
    color: "#009639",
    onColor: "#ffffff",
    products: [
      {
        name: "Cocolife Wealth Plus",
        category: "VUL",
        tagline: "Investment-linked protection",
        overview:
          "Cocolife Wealth Plus combines life protection with investment funds for clients who want growth and coverage from a leading Filipino insurer.",
        highlights: ["Protection + funds", "Local insurer", "Flexible"],
        benefits: [
          "Life cover plus fund growth",
          "Locally managed funds",
          "Top-ups and withdrawals",
          "Optional riders",
        ],
        coverage: ["Death benefit", "Fund value"],
        riders: ["Critical illness", "Accident"],
        eligibility: ["Entry age commonly 0–70"],
        premium: "Regular pay; indicative from ~₱18,000/year.",
        fundOptions: ["Peso Balanced", "Peso Equity"],
        idealFor: "Clients wanting a Filipino-owned VUL.",
        faqs: [
          { q: "Are funds guaranteed?", a: "No — fund values are market-linked and not guaranteed." },
        ],
      },
      {
        name: "Cocolife Educational Plan",
        category: "Education",
        tagline: "Guaranteed college funding",
        overview:
          "The Cocolife Educational Plan secures funds for a child's college education with fixed benefits and the security of a long-standing Filipino institution.",
        highlights: ["College fund", "Fixed benefits", "Affordable"],
        benefits: [
          "Fixed education benefit payouts",
          "Affordable installment options",
          "Backed by a Filipino insurer",
          "Disciplined education saving",
        ],
        coverage: ["Education benefits", "Life cover on payor"],
        riders: ["Payor waiver"],
        eligibility: ["Payor entry age typically 18–55"],
        premium: "Regular pay; affordable installments.",
        idealFor: "Parents wanting a local education plan.",
        faqs: [
          { q: "Are benefits fixed?", a: "Yes — the educational plan provides defined benefit payouts." },
        ],
      },
      {
        name: "Cocolife Pension Plan",
        category: "Retirement",
        tagline: "Retirement income builder",
        overview:
          "The Cocolife Pension Plan helps clients accumulate guaranteed retirement payouts with flexible terms and the option for lifetime income.",
        highlights: ["Pension payouts", "Flexible terms", "Lifetime option"],
        benefits: [
          "Guaranteed pension payouts at retirement",
          "Flexible payment terms",
          "Lifetime income option",
          "Long-term security",
        ],
        coverage: ["Retirement/pension benefits", "Life cover"],
        eligibility: ["Entry age commonly 18–60"],
        premium: "Regular pay; varies by target pension.",
        idealFor: "Clients planning a secure retirement.",
        faqs: [
          { q: "Lifetime income?", a: "Selected configurations offer lifetime income — confirm the option." },
        ],
      },
      {
        name: "Comprehensive Health Care",
        category: "Health",
        tagline: "HMO-style health coverage",
        overview:
          "Cocolife's Comprehensive Health Care is an HMO-style plan covering outpatient and hospital care through an accredited network, popular with families and SMEs.",
        highlights: ["HMO network", "Outpatient + hospital", "Annual check-ups"],
        benefits: [
          "Outpatient and in-patient hospital care",
          "Accredited hospital and clinic network",
          "Annual physical examinations",
          "Group options for companies",
        ],
        coverage: ["Hospitalization", "Outpatient consults", "Diagnostics & APE"],
        eligibility: ["Individual and group enrollment", "Age bands apply"],
        premium: "Annual membership; varies by plan tier and group size.",
        idealFor: "Families and SMEs needing HMO coverage.",
        faqs: [
          { q: "Is this insurance or HMO?", a: "It's HMO-style health care — services via a provider network rather than cash benefits." },
        ],
      },
      {
        name: "Move Term Life",
        category: "Life",
        tagline: "Affordable group & term protection",
        overview:
          "Move is low-cost term life protection with group enrollment options and quick issuance — efficient cover for organizations and budget buyers.",
        highlights: ["Low cost", "Group options", "Quick issue"],
        benefits: [
          "Affordable life protection",
          "Group enrollment for organizations",
          "Fast issuance",
          "Simple, focused cover",
        ],
        coverage: ["Pure life death benefit"],
        eligibility: ["Individual and group", "Entry age commonly 18–60"],
        premium: "Low premium; group rates available.",
        idealFor: "Organizations and budget-conscious buyers.",
        faqs: [
          { q: "Can companies enroll staff?", a: "Yes — group enrollment is a core use case." },
        ],
      },
      {
        name: "Cocolife Group Insurance",
        category: "Group",
        tagline: "Employee life & accident cover for organizations",
        overview:
          "Cocolife Group Insurance provides life and accident protection for employees under a single master policy — a popular, affordable benefit for companies, cooperatives and government accounts.",
        highlights: ["Master policy", "Employee benefit", "Affordable group rates"],
        benefits: [
          "Life and accident cover for all enrolled members",
          "Simplified underwriting under one group policy",
          "Affordable per-member rates",
          "Easy administration for HR and organizations",
        ],
        coverage: ["Group life benefit", "Accidental death & disablement", "Optional medical reimbursement"],
        eligibility: ["For organizations and groups", "Minimum group size applies"],
        premium: "Annual group premium; rates depend on headcount and benefit level.",
        idealFor: "Employers and cooperatives providing staff protection benefits.",
        faqs: [
          {
            q: "Do members get individual policies?",
            a: "Members are covered under one master contract and receive certificates of coverage rather than separate policies.",
          },
        ],
      },
      {
        name: "Cocolife Family Protection",
        category: "Life",
        tagline: "Whole-family life protection in one plan",
        overview:
          "Cocolife Family Protection extends affordable life coverage to the whole family under one plan, giving Filipino households a simple, budget-friendly safety net from a trusted local insurer.",
        highlights: ["Whole family", "Affordable", "Local insurer"],
        benefits: [
          "Coverage that can include spouse and children",
          "One affordable premium for family-wide protection",
          "Backed by a long-standing Filipino institution",
          "Simple enrollment and servicing",
        ],
        coverage: ["Life death benefit for covered family members", "Optional accident benefits"],
        riders: ["Accidental death", "Hospital income"],
        eligibility: ["Principal entry age commonly 18–60", "Dependents per plan rules"],
        premium: "Regular pay; affordable family rates.",
        idealFor: "Families wanting one simple, affordable protection plan.",
        faqs: [
          {
            q: "Who can I include?",
            a: "Typically the principal, spouse and qualified children — exact inclusions depend on the plan version.",
          },
        ],
      },
    ],
  },
];

export const COMPANY_MAP: Record<string, InsuranceCompany> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c]),
);

export const DEFAULT_COMPANY = "wealthflow";

/** Cookie that persists the advisor's chosen company (read on the server). */
export const THEME_COOKIE = "wf-company";

/** Friendly label for each product category. */
export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  VUL: "Investment + Life (VUL)",
  Life: "Life Protection",
  Health: "Health & Critical Illness",
  Education: "Education",
  Retirement: "Retirement",
  Income: "Income Protection",
  Group: "Group / Employee",
};

/** Stable URL slug for a product, unique across companies. */
export function productSlug(companyId: string, name: string): string {
  return (
    companyId +
    "--" +
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

export interface ResolvedProduct {
  product: InsuranceProduct;
  company: InsuranceCompany;
  slug: string;
}

export const PRODUCT_MAP: Record<string, ResolvedProduct> = (() => {
  const map: Record<string, ResolvedProduct> = {};
  for (const company of COMPANIES) {
    for (const product of company.products) {
      const slug = productSlug(company.id, product.name);
      map[slug] = { product, company, slug };
    }
  }
  return map;
})();
