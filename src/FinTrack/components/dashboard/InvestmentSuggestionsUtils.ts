export interface CDTOption {
  id: string;
  bank: string;
  rate: number;
  term: number;
  minAmount: number;
}

type CdtApiItem = {
  id?: string;
  bank?: string;
  banco?: string;
  rate?: number;
  tasa?: number;
  term?: number;
  plazo?: number;
  minAmount?: number;
  montoMinimo?: number;
  nombreentidad?: string;
  descripcion?: string;
  monto?: number | string;
  fechacorte?: string;
};

const BANK_MIN_AMOUNT_HINTS: Record<string, number> = {
  bancolombia: 1000000,
  'banco davivienda': 500000,
  'bbva colombia': 1000000,
  'banco de bogota s.a.': 2000000,
  nequi: 100000,
};

export interface InvestmentAnalysis {
  emergencyFund: number;
  hasEmergencyFund: boolean;
  availableForInvestment: number;
  liquidAvailability: number;
  emergencyFundProgress: number;
}

export interface EligibleCDT extends CDTOption {
  estimatedGain: number;
}

export const normalizeBankName = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

export const getMinAmountHint = (bankName: string) => {
  const normalized = normalizeBankName(bankName);
  return BANK_MIN_AMOUNT_HINTS[normalized] ?? 0;
};

export const normalizeOption = (item: CdtApiItem, index: number): CDTOption | null => {
  const bank = (item.bank ?? item.banco ?? item.nombreentidad ?? '').replaceAll('"', '').trim();
  const rate = Number(item.rate ?? item.tasa);
  const termFromItem = Number(item.term ?? item.plazo);
  const term = Number.isNaN(termFromItem)
    ? (item.descripcion?.includes('360') ? 360 : 0)
    : termFromItem;
  const minAmount = Number(item.minAmount ?? item.montoMinimo ?? getMinAmountHint(bank));

  if (!bank || Number.isNaN(rate) || Number.isNaN(term)) {
    return null;
  }

  return {
    id: item.id ?? `${bank.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    bank,
    rate,
    term,
    minAmount: Number.isNaN(minAmount) ? 0 : minAmount,
  };
};

export const parseApiResponse = (payload: unknown): CDTOption[] => {
  const rawList = Array.isArray(payload)
    ? payload
    : (payload as { data?: unknown; rates?: unknown; cdts?: unknown } | null)?.data
      ?? (payload as { rates?: unknown } | null)?.rates
      ?? (payload as { cdts?: unknown } | null)?.cdts;

  if (!Array.isArray(rawList)) {
    return [];
  }

  return rawList
    .map((item, index) => normalizeOption(item as CdtApiItem, index))
    .filter((item): item is CDTOption => item !== null);
};

export const calculateInvestmentAnalysis = (
  totalBalance: number,
  monthlyExpenseAvg: number,
  monthlyIncomeAvg: number,
): InvestmentAnalysis => {
  const emergencyFund = monthlyExpenseAvg * 3;
  const hasEmergencyFund = totalBalance >= emergencyFund;
  const availableForInvestment = hasEmergencyFund ? totalBalance - emergencyFund : 0;
  const liquidAvailability = monthlyIncomeAvg - monthlyExpenseAvg;

  return {
    emergencyFund,
    hasEmergencyFund,
    availableForInvestment,
    liquidAvailability,
    emergencyFundProgress: Math.min((totalBalance / emergencyFund) * 100, 100)
  };
};

export const getEligibleCDTs = (
  analysis: Pick<InvestmentAnalysis, 'hasEmergencyFund' | 'availableForInvestment'>,
  cdtOptions: CDTOption[],
): EligibleCDT[] => {
  if (!analysis.hasEmergencyFund || analysis.availableForInvestment <= 0) {
    return [];
  }

  return cdtOptions
    .filter(cdt => analysis.availableForInvestment >= cdt.minAmount)
    .map(cdt => {
      const estimatedGain = analysis.availableForInvestment * (cdt.rate / 100) * (cdt.term / 365);
      return { ...cdt, estimatedGain };
    })
    .sort((a, b) => b.estimatedGain - a.estimatedGain);
};