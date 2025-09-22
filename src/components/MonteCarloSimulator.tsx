import React, { useMemo, useState } from 'react';

type Distribution = 'lognormal' | 'normal';

interface MonteCarloSimulatorProps {
  currentValuation: number;
  exitValuation?: number;
  esopPool: number; // percentage 0-100
}

interface SimulationResultSummary {
  trials: number;
  meanExit: number;
  medianExit: number;
  p10Exit: number;
  p90Exit: number;
  meanFounderPayout: number;
  meanEsopPayout: number;
  meanInvestorPayout: number;
  bins: Array<{ x0: number; x1: number; count: number }>;
  maxBinCount: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = clamp((p / 100) * (sorted.length - 1), 0, sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  const weight = idx - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function sampleNormal(mean: number, stdDev: number): number {
  // Box-Muller
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + stdDev * z;
}

function sampleLogNormal(mean: number, stdDev: number): number {
  // Convert desired lognormal mean/std to underlying normal mu/sigma
  const variance = stdDev * stdDev;
  const phi = Math.sqrt(variance + mean * mean);
  const sigma = Math.sqrt(Math.log((phi * phi) / (mean * mean)));
  const mu = Math.log(mean) - 0.5 * sigma * sigma;
  const n = sampleNormal(mu, sigma);
  return Math.exp(n);
}

const MonteCarloSimulator: React.FC<MonteCarloSimulatorProps> = ({
  currentValuation,
  exitValuation,
  esopPool
}) => {
  const [trials, setTrials] = useState<number>(5000);
  const [distribution, setDistribution] = useState<Distribution>('lognormal');
  const [exitMultipleMean, setExitMultipleMean] = useState<number>(
    Math.max(1, (exitValuation ?? currentValuation * 2) / currentValuation)
  );
  const [exitMultipleStd, setExitMultipleStd] = useState<number>(exitMultipleMean * 0.6);
  const [feesPct, setFeesPct] = useState<number>(5);
  const [taxPct, setTaxPct] = useState<number>(20);

  const summary: SimulationResultSummary = useMemo(() => {
    const exitValues: number[] = new Array(trials);
    let sumFounder = 0;
    let sumEsop = 0;
    let sumInvestor = 0;

    for (let i = 0; i < trials; i++) {
      const multiple = distribution === 'lognormal'
        ? sampleLogNormal(exitMultipleMean, Math.max(1e-6, exitMultipleStd))
        : sampleNormal(exitMultipleMean, Math.max(1e-6, exitMultipleStd));

      const grossExit = Math.max(0, currentValuation * multiple);
      const afterFees = grossExit * (1 - clamp(feesPct, 0, 100) / 100);
      const afterTax = afterFees * (1 - clamp(taxPct, 0, 100) / 100);

      exitValues[i] = afterTax;

      const founderEquityPct = clamp(100 - esopPool, 0, 100);
      const founderPayout = afterTax * (founderEquityPct / 100);
      const esopPayout = afterTax * (clamp(esopPool, 0, 100) / 100);
      const investorPayout = afterTax - founderPayout - esopPayout;

      sumFounder += founderPayout;
      sumEsop += esopPayout;
      sumInvestor += investorPayout;
    }

    const meanExit = exitValues.reduce((a, b) => a + b, 0) / Math.max(1, trials);
    const medianExit = percentile(exitValues, 50);
    const p10Exit = percentile(exitValues, 10);
    const p90Exit = percentile(exitValues, 90);

    // Histogram bins
    const binCount = 30;
    const minVal = Math.min(...exitValues);
    const maxVal = Math.max(...exitValues);
    const range = Math.max(1e-6, maxVal - minVal);
    const step = range / binCount;
    const bins: Array<{ x0: number; x1: number; count: number }> = new Array(binCount).fill(0).map((_, i) => ({
      x0: minVal + i * step,
      x1: minVal + (i + 1) * step,
      count: 0
    }));
    for (let i = 0; i < exitValues.length; i++) {
      const v = exitValues[i];
      let idx = Math.floor((v - minVal) / step);
      if (idx >= binCount) idx = binCount - 1;
      if (idx < 0) idx = 0;
      bins[idx].count += 1;
    }
    const maxBinCount = bins.reduce((m, b) => Math.max(m, b.count), 0);

    return {
      trials,
      meanExit,
      medianExit,
      p10Exit,
      p90Exit,
      meanFounderPayout: sumFounder / Math.max(1, trials),
      meanEsopPayout: sumEsop / Math.max(1, trials),
      meanInvestorPayout: sumInvestor / Math.max(1, trials),
      bins,
      maxBinCount
    };
  }, [trials, distribution, exitMultipleMean, exitMultipleStd, feesPct, taxPct, currentValuation, esopPool]);

  return (
    <div className="monte-carlo">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>Monte Carlo Simulation</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setExitMultipleMean(1.8); setExitMultipleStd(0.8); setFeesPct(6); setTaxPct(22); setDistribution('lognormal'); }}
            style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
          >
            Conservative
          </button>
          <button
            onClick={() => { setExitMultipleMean(2.5); setExitMultipleStd(1.2); setFeesPct(5); setTaxPct(20); setDistribution('lognormal'); }}
            style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
          >
            Base
          </button>
          <button
            onClick={() => { setExitMultipleMean(3.5); setExitMultipleStd(1.5); setFeesPct(4); setTaxPct(18); setDistribution('lognormal'); }}
            style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
          >
            Aggressive
          </button>
        </div>
      </div>

      <div className="mc-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
        <label>
          Trials
          <input
            type="number"
            min={100}
            max={200000}
            step={100}
            value={trials}
            onChange={(e) => setTrials(clamp(parseInt(e.target.value || '0', 10) || 0, 100, 200000))}
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Distribution
          <select
            value={distribution}
            onChange={(e) => setDistribution(e.target.value as Distribution)}
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          >
            <option value="lognormal">Lognormal (positive-only)</option>
            <option value="normal">Normal</option>
          </select>
        </label>

        <label>
          Exit multiple mean (× current valuation)
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={exitMultipleMean}
            onChange={(e) => setExitMultipleMean(Math.max(0.1, parseFloat(e.target.value || '0') || 0))}
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Exit multiple std dev
          <input
            type="number"
            min={0.01}
            step={0.1}
            value={exitMultipleStd}
            onChange={(e) => setExitMultipleStd(Math.max(0.01, parseFloat(e.target.value || '0') || 0))}
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Fees (%)
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={feesPct}
            onChange={(e) => setFeesPct(clamp(parseFloat(e.target.value || '0') || 0, 0, 100))}
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Taxes (%)
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={taxPct}
            onChange={(e) => setTaxPct(clamp(parseFloat(e.target.value || '0') || 0, 0, 100))}
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </label>
      </div>

      <div className="mc-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <h4>Exit (after fees & taxes)</h4>
          <div>Mean: ${summary.meanExit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div>Median: ${summary.medianExit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div>P10: ${summary.p10Exit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div>P90: ${summary.p90Exit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div>Trials: {summary.trials.toLocaleString()}</div>
        </div>

        <div className="card" style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <h4>Founder payout (mean)</h4>
          <div>${summary.meanFounderPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>

        <div className="card" style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <h4>ESOP payout (mean)</h4>
          <div>${summary.meanEsopPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <h4 style={{ marginTop: 12 }}>Investor payout (mean)</h4>
          <div>${summary.meanInvestorPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
      </div>

      {/* Histogram */}
      <div className="mc-chart" style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
        <h4 style={{ marginTop: 0 }}>Exit Value Distribution</h4>
        <svg width="100%" height="160" viewBox={`0 0 ${summary.bins.length * 6} 120`} preserveAspectRatio="none">
          {summary.bins.map((b, i) => {
            const h = summary.maxBinCount > 0 ? (b.count / summary.maxBinCount) * 110 : 0;
            const x = i * 6;
            const y = 120 - h;
            return (
              <rect key={i} x={x} y={y} width={5} height={h} fill="#6366f1" />
            );
          })}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: 12 }}>
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default MonteCarloSimulator;


