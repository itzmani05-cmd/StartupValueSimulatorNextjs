import React, { useMemo, useState } from 'react';
import { Card, Row, Col, InputNumber, Select, Slider, Button, Typography, Statistic, Divider, Space, Badge } from 'antd';
import { 
  PlayCircleOutlined, 
  BarChartOutlined, 
  CalculatorOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  FireOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

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

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="monte-carlo">
      <Card 
        title={
          <Space>
            <FireOutlined />
            <span>Monte Carlo Simulation</span>
          </Space>
        }
        extra={
          <Space>
            <Button 
              onClick={() => { setExitMultipleMean(1.8); setExitMultipleStd(0.8); setFeesPct(6); setTaxPct(22); setDistribution('lognormal'); }}
              icon={<SafetyCertificateOutlined />}
            >
              Conservative
            </Button>
            <Button 
              type="primary" 
              onClick={() => { setExitMultipleMean(2.5); setExitMultipleStd(1.2); setFeesPct(5); setTaxPct(20); setDistribution('lognormal'); }}
              icon={<ThunderboltOutlined />}
            >
              Base
            </Button>
            <Button 
              onClick={() => { setExitMultipleMean(3.5); setExitMultipleStd(1.5); setFeesPct(4); setTaxPct(18); setDistribution('lognormal'); }}
              icon={<FireOutlined />}
            >
              Aggressive
            </Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="Trials" style={{ height: '100%' }}>
              <InputNumber
                min={100}
                max={200000}
                step={100}
                value={trials}
                onChange={(value) => setTrials(clamp(value || 0, 100, 200000))}
                style={{ width: '100%' }}
              />
              <Slider
                min={100}
                max={50000}
                step={100}
                value={trials}
                onChange={(value) => setTrials(clamp(value, 100, 200000))}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="Distribution" style={{ height: '100%' }}>
              <Select
                value={distribution}
                onChange={(value) => setDistribution(value as Distribution)}
                style={{ width: '100%' }}
              >
                <Option value="lognormal">Lognormal (positive-only)</Option>
                <Option value="normal">Normal</Option>
              </Select>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="Exit Multiple Mean" style={{ height: '100%' }}>
              <InputNumber
                min={0.1}
                step={0.1}
                value={exitMultipleMean}
                onChange={(value) => setExitMultipleMean(Math.max(0.1, value || 0))}
                style={{ width: '100%' }}
              />
              <Slider
                min={0.1}
                max={10}
                step={0.1}
                value={exitMultipleMean}
                onChange={(value) => setExitMultipleMean(Math.max(0.1, value))}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="Exit Multiple Std Dev" style={{ height: '100%' }}>
              <InputNumber
                min={0.01}
                step={0.1}
                value={exitMultipleStd}
                onChange={(value) => setExitMultipleStd(Math.max(0.01, value || 0))}
                style={{ width: '100%' }}
              />
              <Slider
                min={0.01}
                max={5}
                step={0.1}
                value={exitMultipleStd}
                onChange={(value) => setExitMultipleStd(Math.max(0.01, value))}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="Fees (%)" style={{ height: '100%' }}>
              <InputNumber
                min={0}
                max={100}
                step={0.5}
                value={feesPct}
                onChange={(value) => setFeesPct(clamp(value || 0, 0, 100))}
                style={{ width: '100%' }}
              />
              <Slider
                min={0}
                max={20}
                step={0.5}
                value={feesPct}
                onChange={(value) => setFeesPct(clamp(value, 0, 100))}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="Taxes (%)" style={{ height: '100%' }}>
              <InputNumber
                min={0}
                max={100}
                step={0.5}
                value={taxPct}
                onChange={(value) => setTaxPct(clamp(value || 0, 0, 100))}
                style={{ width: '100%' }}
              />
              <Slider
                min={0}
                max={50}
                step={0.5}
                value={taxPct}
                onChange={(value) => setTaxPct(clamp(value, 0, 100))}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                <span>Exit (after fees & taxes)</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Statistic 
              title="Mean" 
              value={formatCurrency(summary.meanExit)} 
              precision={0}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="Median" 
                  value={formatCurrency(summary.medianExit)} 
                  precision={0}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="P10" 
                  value={formatCurrency(summary.p10Exit)} 
                  precision={0}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="P90" 
                  value={formatCurrency(summary.p90Exit)} 
                  precision={0}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Trials" 
                  value={summary.trials.toLocaleString()} 
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            title={
              <Space>
                <CalculatorOutlined />
                <span>Founder payout (mean)</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Statistic 
              value={formatCurrency(summary.meanFounderPayout)} 
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            title={
              <Space>
                <PlayCircleOutlined />
                <span>ESOP & Investor payout (mean)</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Statistic 
              title="ESOP Payout" 
              value={formatCurrency(summary.meanEsopPayout)} 
              precision={0}
              valueStyle={{ color: '#1890ff' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Statistic 
              title="Investor Payout" 
              value={formatCurrency(summary.meanInvestorPayout)} 
              precision={0}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Histogram */}
      <Card 
        title={
          <Space>
            <BarChartOutlined />
            <span>Exit Value Distribution</span>
          </Space>
        }
      >
        <div style={{ height: 200, position: 'relative' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${summary.bins.length * 10} 160`} preserveAspectRatio="none">
            {summary.bins.map((b, i) => {
              const h = summary.maxBinCount > 0 ? (b.count / summary.maxBinCount) * 140 : 0;
              const x = i * 10;
              const y = 160 - h;
              return (
                <rect 
                  key={i} 
                  x={x} 
                  y={y} 
                  width={8} 
                  height={h} 
                  fill="#1890ff" 
                  rx="2"
                  ry="2"
                />
              );
            })}
          </svg>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            color: '#6b7280', 
            fontSize: 12,
            marginTop: 8
          }}>
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonteCarloSimulator;