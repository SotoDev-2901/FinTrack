import { useEffect, useMemo, useState } from 'react';
import { FaShieldAlt, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import {
  calculateInvestmentAnalysis,
  getEligibleCDTs,
  parseApiResponse,
  type CDTOption,
  type EligibleCDT,
  type InvestmentAnalysis,
} from './InvestmentSuggestionsUtils';

interface InvestmentSuggestionsProps {
  totalBalance: number;
  monthlyExpenseAvg: number;
  monthlyIncomeAvg: number;
}

const getCdtApiUrl = () => import.meta.env.VITE_CDT_RATES_API_URL;
const OFFICIAL_CDT_DATASET_URL = 'https://www.datos.gov.co/resource/axk9-g2nh.json';
const OFFICIAL_CDT_TERM = 'A 360 DIAS';
const INITIAL_VISIBLE_CDT_COUNT = 5;
const VISIBLE_CDT_STEP = 5;

type OfficialDateResponse = { max_fechacorte?: string };

const getLatestOfficialCutDate = async () => {
  const latestDateUrl = `${OFFICIAL_CDT_DATASET_URL}?$select=max(fechacorte)&uca=1`;
  const response = await fetch(latestDateUrl);

  if (!response.ok) {
    throw new Error(`Error consultando corte oficial: ${response.status}`);
  }

  const payload = (await response.json()) as OfficialDateResponse[];
  return payload[0]?.max_fechacorte;
};

const getOfficialRatesByDate = async (cutDate: string): Promise<CDTOption[]> => {
  const query = new URLSearchParams({
    uca: '1',
    fechacorte: cutDate,
    descripcion: OFFICIAL_CDT_TERM,
    '$select': 'nombreentidad,descripcion,tasa,monto,fechacorte',
    '$order': 'tasa DESC',
    '$limit': '30',
  });

  const response = await fetch(`${OFFICIAL_CDT_DATASET_URL}?${query.toString()}`);

  if (!response.ok) {
    throw new Error(`Error consultando tasas oficiales: ${response.status}`);
  }

  const payload = await response.json();
  return parseApiResponse(payload);
};

export const InvestmentSuggestions = ({
  totalBalance,
  monthlyExpenseAvg,
  monthlyIncomeAvg
}: InvestmentSuggestionsProps) => {
  const [cdtOptions, setCdtOptions] = useState<CDTOption[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [visibleCdtCount, setVisibleCdtCount] = useState(INITIAL_VISIBLE_CDT_COUNT);

  useEffect(() => {
    let isMounted = true;

    const fetchCdtRates = async () => {
      setIsLoadingRates(true);
      setRatesError(null);

      try {
        let normalizedRates: CDTOption[] = [];
        const cdtApiUrl = getCdtApiUrl();

        if (cdtApiUrl) {
          const response = await fetch(cdtApiUrl);

          if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
          }

          const payload = await response.json();
          normalizedRates = parseApiResponse(payload);
        } else {
          const latestCutDate = await getLatestOfficialCutDate();

          if (!latestCutDate) {
            throw new Error('No se obtuvo fecha de corte oficial.');
          }

          normalizedRates = await getOfficialRatesByDate(latestCutDate);
        }

        if (!isMounted) {
          return;
        }

        if (normalizedRates.length === 0) {
          setRatesError('La fuente de tasas respondió sin datos válidos.');
          setCdtOptions([]);
          return;
        }

        setCdtOptions(normalizedRates);
      } catch {
        if (!isMounted) {
          return;
        }

        setRatesError('No fue posible obtener tasas reales en este momento.');
        setCdtOptions([]);
      } finally {
        if (isMounted) {
          setIsLoadingRates(false);
        }
      }
    };

    void fetchCdtRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const analysis = useMemo<InvestmentAnalysis>(() => calculateInvestmentAnalysis(
    totalBalance,
    monthlyExpenseAvg,
    monthlyIncomeAvg,
  ), [totalBalance, monthlyExpenseAvg, monthlyIncomeAvg]);

  const eligibleCDTs = useMemo<EligibleCDT[]>(() => getEligibleCDTs(analysis, cdtOptions), [analysis, cdtOptions]);

  useEffect(() => {
    setVisibleCdtCount(INITIAL_VISIBLE_CDT_COUNT);
  }, [eligibleCDTs.length]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const bestOption = eligibleCDTs[0];
  const displayedCDTs = eligibleCDTs.slice(0, visibleCdtCount);
  const hasMoreCdtsToShow = visibleCdtCount < eligibleCDTs.length;
  const canCollapseCdts = visibleCdtCount > INITIAL_VISIBLE_CDT_COUNT;

  return (
    <div className="bg-[#1A2C3D] rounded-2xl p-4 sm:p-6 border border-secondary/30">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4">
        Consejos Financieros
      </h2>

      {/* Reserva de Emergencia */}
      <div className={`p-4 rounded-xl mb-4 ${analysis.hasEmergencyFund ? 'bg-green-900/30 border border-green-500/30' : 'bg-yellow-900/30 border border-yellow-500/30'}`}>
        <div className="flex items-center gap-3 mb-2">
          {analysis.hasEmergencyFund ? (
            <FaShieldAlt className="text-green-400 text-xl" />
          ) : (
            <FaExclamationTriangle className="text-yellow-400 text-xl" />
          )}
          <h3 className="text-white font-semibold">Reserva de Emergencia</h3>
        </div>
        <p className="text-gray-300 text-sm mb-2">
          {analysis.hasEmergencyFund
            ? 'Tienes cubierta tu reserva de emergencia (3 meses de gastos)'
            : `Te faltan ${formatCurrency(analysis.emergencyFund - totalBalance)} para completar tu reserva de emergencia`
          }
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${analysis.hasEmergencyFund ? 'bg-green-500' : 'bg-yellow-500'}`}
            style={{ width: `${analysis.emergencyFundProgress}%` }}
          />
        </div>
        <p className="text-gray-400 text-xs mt-1">
          {formatCurrency(totalBalance)} / {formatCurrency(analysis.emergencyFund)}
        </p>
      </div>

      {/* Disponibilidad Líquida */}
      <div className="p-4 rounded-xl mb-4 bg-[#242F3A]">
        <p className="text-gray-400 text-sm">Disponibilidad líquida mensual</p>
        <p className={`text-xl font-bold ${analysis.liquidAvailability >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(analysis.liquidAvailability)}
        </p>
      </div>

      {/* Sugerencias de CDT */}
      {analysis.hasEmergencyFund && eligibleCDTs.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <FaChartLine className="text-secondary" />
            <h3 className="text-white font-semibold">Sugerencias de Inversión (CDT)</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Disponible para invertir: <span className="text-secondary font-semibold">{formatCurrency(analysis.availableForInvestment)}</span>
          </p>
          {isLoadingRates && (
            <p className="text-secondary text-xs mb-3">Actualizando tasas en tiempo real...</p>
          )}
          {ratesError && (
            <p className="text-yellow-400 text-xs mb-3">{ratesError}</p>
          )}

          <div className="space-y-3">
            {displayedCDTs.map((cdt) => (
              <div
                key={cdt.id}
                className={`p-4 rounded-xl border transition-all ${
                  cdt.id === bestOption?.id
                    ? 'bg-secondary/20 border-secondary'
                    : 'bg-[#242F3A] border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-semibold">{cdt.bank}</h4>
                    <p className="text-gray-400 text-sm">{cdt.term} días</p>
                  </div>
                  {cdt.id === bestOption?.id && (
                    <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                      Mejor opción
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-400 text-xs">Tasa E.A.</p>
                    <p className="text-secondary font-bold text-lg">{cdt.rate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Ganancia estimada</p>
                    <p className="text-green-400 font-bold">{formatCurrency(cdt.estimatedGain)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(hasMoreCdtsToShow || canCollapseCdts) && (
            <div className="mt-4 flex justify-center gap-3">
              {hasMoreCdtsToShow && (
                <button
                  type="button"
                  onClick={() => setVisibleCdtCount((current) => Math.min(current + VISIBLE_CDT_STEP, eligibleCDTs.length))}
                  className="rounded-lg border border-secondary/60 px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/15"
                >
                  Ver más ({eligibleCDTs.length - visibleCdtCount} restantes)
                </button>
              )}
              {canCollapseCdts && (
                <button
                  type="button"
                  onClick={() => setVisibleCdtCount(INITIAL_VISIBLE_CDT_COUNT)}
                  className="rounded-lg border border-gray-500/70 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-500/15"
                >
                  Ver menos
                </button>
              )}
            </div>
          )}
        </>
      ) : !analysis.hasEmergencyFund ? (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">
            Completa primero tu reserva de emergencia para recibir sugerencias de inversión
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          {ratesError ? (
            <p className="text-yellow-400 text-sm">{ratesError}</p>
          ) : (
            <p className="text-gray-400 text-sm">
              No hay opciones de CDT disponibles para tu saldo actual
            </p>
          )}
        </div>
      )}
    </div>
  );
};
