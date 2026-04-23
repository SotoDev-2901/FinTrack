import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  calculateInvestmentAnalysis,
  getEligibleCDTs,
  getMinAmountHint,
  normalizeBankName,
  normalizeOption,
  parseApiResponse,
  type CDTOption,
} from './InvestmentSuggestionsUtils';
import { InvestmentSuggestions } from './InvestmentSuggestions';

const createFetchResponse = (body: unknown) => ({
  ok: true,
  json: async () => body,
});

const sampleCDTs: CDTOption[] = [
  { id: 'b1', bank: 'Banco Bajo', rate: 8, term: 360, minAmount: 100000 },
  { id: 'b2', bank: 'Banco Medio', rate: 10, term: 360, minAmount: 100000 },
  { id: 'b3', bank: 'Banco Alto', rate: 12, term: 360, minAmount: 100000 },
  { id: 'b4', bank: 'Banco Extra', rate: 9, term: 360, minAmount: 100000 },
  { id: 'b5', bank: 'Banco Quinto', rate: 7, term: 360, minAmount: 100000 },
  { id: 'b6', bank: 'Banco Sexto', rate: 6, term: 360, minAmount: 100000 },
];

describe('InvestmentSuggestionsUtils', () => {
  it('normaliza nombres de banco y calcula montos mínimos sugeridos', () => {
    expect(normalizeBankName('  Banco de Bogotá S.A.  ')).toBe('banco de bogota s.a.');
    expect(getMinAmountHint('Bancolombia')).toBe(1000000);
  });

  it('normaliza opciones de la API y completa valores derivados', () => {
    const option = normalizeOption(
      {
        nombreentidad: 'Banco Demo',
        tasa: 11,
        descripcion: 'Producto A 360 días',
      },
      0,
    );

    expect(option).toEqual({
      id: 'banco-demo-0',
      bank: 'Banco Demo',
      rate: 11,
      term: 360,
      minAmount: 0,
    });
  });

  it('parsea respuestas en distintas envolturas', () => {
    expect(parseApiResponse({ data: [{ bank: 'A', rate: 10, term: 360 }] })).toHaveLength(1);
    expect(parseApiResponse({ rates: [{ bank: 'A', rate: 10, term: 360 }] })).toHaveLength(1);
    expect(parseApiResponse({ cdts: [{ bank: 'A', rate: 10, term: 360 }] })).toHaveLength(1);
  });

  it('calcula la reserva de emergencia y la liquidez mensual', () => {
    expect(calculateInvestmentAnalysis(5000000, 1000000, 2500000)).toEqual({
      emergencyFund: 3000000,
      hasEmergencyFund: true,
      availableForInvestment: 2000000,
      liquidAvailability: 1500000,
      emergencyFundProgress: 100,
    });
  });

  it('filtra y ordena CDT por ganancia estimada', () => {
    const eligible = getEligibleCDTs(
      { hasEmergencyFund: true, availableForInvestment: 2000000 },
      sampleCDTs,
    );

    expect(eligible).toHaveLength(6);
    expect(eligible[0].bank).toBe('Banco Alto');
    expect(eligible[0].estimatedGain).toBeGreaterThan(eligible[1].estimatedGain);
  });
});

describe('InvestmentSuggestions component', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_CDT_RATES_API_URL', 'https://mock.api/cdts');
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('muestra el aviso de reserva de emergencia incompleta', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchResponse(sampleCDTs)));

    render(
      <InvestmentSuggestions totalBalance={1000000} monthlyExpenseAvg={1000000} monthlyIncomeAvg={3000000} />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Completa primero tu reserva de emergencia/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('heading', { name: /Sugerencias de Inversión/i })).toBeNull();
  });

  it('muestra sugerencias ordenadas y permite expandir y colapsar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchResponse(sampleCDTs)));

    render(
      <InvestmentSuggestions totalBalance={5000000} monthlyExpenseAvg={1000000} monthlyIncomeAvg={3000000} />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Sugerencias de Inversión \(CDT\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Banco Alto')).toBeInTheDocument();
    expect(screen.getByText('Mejor opción')).toBeInTheDocument();
    expect(screen.getByText(/Ver más \(1 restantes\)/i)).toBeInTheDocument();
    expect(screen.queryByText('Banco Sexto')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Ver más/i }));
    expect(screen.getByText('Banco Sexto')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ver menos/i })).toBeInTheDocument();
  });

  it('muestra error cuando la consulta falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

    render(
      <InvestmentSuggestions totalBalance={5000000} monthlyExpenseAvg={1000000} monthlyIncomeAvg={3000000} />,
    );

    await waitFor(() => {
      expect(screen.getByText(/No fue posible obtener tasas reales en este momento/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje cuando la fuente responde sin datos válidos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchResponse([])));

    render(
      <InvestmentSuggestions totalBalance={5000000} monthlyExpenseAvg={1000000} monthlyIncomeAvg={3000000} />,
    );

    await waitFor(() => {
      expect(screen.getByText(/La fuente de tasas respondió sin datos válidos/i)).toBeInTheDocument();
    });
  });
});