export interface DrugData {
  name: string;
  indication: string;
  patent: {
    id: string;
    expiry: string;
    fto: string;
    abstract: string;
  };
  trials: {
    count: number;
    phase: string;
    indication: string;
    nctId: string;
    details: string;
  };
  market: {
    size: string;
    competition: string;
    cagr: string;
    keyPlayers: string[];
  };
  synthesis: string;
}

export const drugDatabase: Record<string, DrugData> = {
  gefitinib: {
    name: 'Gefitinib',
    indication: 'Glioblastoma Multiforme (Oncology)',
    patent: {
      id: 'US Patent 6,123,456',
      expiry: '2026',
      fto: 'High',
      abstract: 'Pharmaceutical composition comprising gefitinib or a pharmaceutically acceptable salt thereof for treating EGFR-positive malignancies. Claims include methods of administration and combination therapies with radiation treatment protocols.',
    },
    trials: {
      count: 2,
      phase: 'Phase III',
      indication: 'Glioblastoma Multiforme',
      nctId: 'NCT04892316',
      details: 'Randomized, double-blind, placebo-controlled study evaluating gefitinib in combination with temozolomide for newly diagnosed GBM patients. Primary endpoint: Overall Survival. n=420 patients.',
    },
    market: {
      size: '$450M',
      competition: 'Moderate',
      cagr: '8.2%',
      keyPlayers: ['AstraZeneca', 'Roche', 'Novartis'],
    },
    synthesis: `**Analysis Summary: Gefitinib for Glioblastoma**

Based on comprehensive multi-agent analysis, **Gefitinib** demonstrates **strong repurposing potential** for Glioblastoma Multiforme.

**Key Findings:**
- **Patent Status:** 3-year exclusivity window remaining (expires 2026)
- **Clinical Evidence:** 2 active Phase III trials showing promising efficacy signals
- **Market Opportunity:** $450M addressable market with moderate competition

**Strategic Recommendation:**
- Proceed with accelerated development pathway
- Consider combination therapy with temozolomide
- Priority filing recommended within 12 months`,
  },
  metformin: {
    name: 'Metformin',
    indication: 'Anti-aging / Longevity',
    patent: {
      id: 'US Patent 3,174,901',
      expiry: 'Expired (1994)',
      fto: 'Full Freedom to Operate',
      abstract: 'Original patent for biguanide derivatives including metformin hydrochloride for treatment of diabetes mellitus. All composition and method claims have expired, enabling generic formulation development.',
    },
    trials: {
      count: 5,
      phase: 'Phase II/III',
      indication: 'Aging-related diseases',
      nctId: 'NCT02432287',
      details: 'TAME (Targeting Aging with Metformin) trial - landmark study investigating metformin\'s effects on aging biomarkers and age-related disease prevention. Primary endpoints: Cardiovascular events, cancer incidence, cognitive decline. n=3,000 patients.',
    },
    market: {
      size: '$2B',
      competition: 'Low (Generic)',
      cagr: '12.5%',
      keyPlayers: ['Teva', 'Mylan', 'Sun Pharma'],
    },
    synthesis: `**Analysis Summary: Metformin for Anti-aging**

Based on comprehensive multi-agent analysis, **Metformin** shows **exceptional promise** as a longevity therapeutic.

**Key Findings:**
- **Patent Status:** Fully expired - complete freedom to operate for novel formulations
- **Clinical Evidence:** TAME trial (n=3,000) investigating aging biomarkers
- **Market Opportunity:** $2B emerging longevity market with low barriers

**Strategic Recommendation:**
- Focus on novel delivery mechanisms or combination products
- Consider 505(b)(2) regulatory pathway
- Partner with longevity-focused research institutions`,
  },
  aspirin: {
    name: 'Aspirin',
    indication: 'Colon Cancer Prevention',
    patent: {
      id: 'Public Domain',
      expiry: 'N/A (Generic)',
      fto: 'Full Freedom to Operate',
      abstract: 'Acetylsalicylic acid - no active patent protection. Novel formulations or specific indications may be patentable through method-of-use claims or drug delivery innovations.',
    },
    trials: {
      count: 8,
      phase: 'Phase IV',
      indication: 'Colorectal Cancer Prevention',
      nctId: 'NCT00501059',
      details: 'ASPREE trial extension - evaluating low-dose aspirin for colorectal cancer chemoprevention in adults 70+. Secondary analysis of cancer outcomes. Shows 24% reduction in CRC incidence over 5 years.',
    },
    market: {
      size: '$890M',
      competition: 'High (OTC)',
      cagr: '4.1%',
      keyPlayers: ['Bayer', 'J&J', 'GSK Consumer'],
    },
    synthesis: `**Analysis Summary: Aspirin for Colon Cancer Prevention**

Based on comprehensive multi-agent analysis, **Aspirin** has **validated efficacy** for colorectal cancer chemoprevention.

**Key Findings:**
- **Patent Status:** Public domain - opportunity for proprietary formulations
- **Clinical Evidence:** Phase IV data showing 24% CRC risk reduction
- **Market Opportunity:** $890M specialty prevention market

**Strategic Recommendation:**
- Develop precision-dose formulation for CRC indication
- Seek FDA approval for cancer prevention claim
- Target high-risk populations (Lynch syndrome, FAP)`,
  },
};

export const fallbackResponse = {
  synthesis: `**Analysis Request Received**

I detected a research query but couldn't identify a specific drug compound.

**To provide detailed analysis, please specify:**
- A drug name (e.g., Gefitinib, Metformin, Aspirin)
- The therapeutic indication of interest
- Any specific data requirements (patents, trials, market)

**Example queries:**
- "Analyze repurposing opportunities for Gefitinib"
- "What about Metformin for longevity?"
- "Research Aspirin for cancer prevention"`,
};

export function detectDrug(query: string): DrugData | null {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('gefitinib')) {
    return drugDatabase.gefitinib;
  }
  if (lowerQuery.includes('metformin')) {
    return drugDatabase.metformin;
  }
  if (lowerQuery.includes('aspirin')) {
    return drugDatabase.aspirin;
  }
  
  return null;
}
