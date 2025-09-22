import React from "react";
import { Card, Button, Row, Col, Space, Tag, Typography, Divider, Statistic, Collapse } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined, BulbOutlined } from '@ant-design/icons';
import FeatureGrid from "../components/FeatureGrid";
import Footer from "../components/Footer";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Section: React.FC<{
  id?: string;
  title: string;
  emoji?: string;
  children: React.ReactNode;
}> = ({ id, title, emoji, children }) => (
  <Card 
    id={id}
    className="group relative overflow-hidden scroll-mt-24 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm mb-8"
    bordered={false}
    style={{ borderRadius: '24px' }}
  >
    {/* Professional Section Header */}
    <div className="relative z-10">
      <div className="flex items-center gap-5 mb-7">
        {emoji && (
          <div className="w-18 h-18 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border border-blue-200/60 shadow-md group-hover:shadow-lg transition-all duration-300">
            <span className="text-4xl">{emoji}</span>
          </div>
        )}
        <div>
          <Title level={2} className="!mb-0 !font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text !text-transparent">
            {title}
          </Title>
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-3"></div>
        </div>
      </div>
      {children}
    </div>
  </Card>
);

const LearnMore: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50">
      {/* Professional Header with Glass Effect */}
      <header className="relative bg-white/95 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 to-indigo-600/8"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Enhanced Professional Logo */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-2xl">🚀</span>
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <Title level={3} className="!mb-0 !font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text !text-transparent">
                  Platform Features
                </Title>
                <Text type="secondary" className="!font-semibold">
                  Comprehensive startup valuation capabilities
                </Text>
              </div>
            </div>
            
            {/* Enhanced Professional Navigation */}
            <Space size="middle">
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={() => (window.location.hash = "#/home")}
              >
                Home
              </Button>
              <Button 
                type="primary" 
                icon={<ArrowRightOutlined />}
                onClick={() => (window.location.hash = "#/dashboard")}
              >
                Enter App
              </Button>
            </Space>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content with Professional Layout */}
      <main className="max-w-7xl mx-auto px-6 py-14">
        {/* Enhanced Professional Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <Tag color="blue" className="!text-lg !py-2 !px-6 !rounded-full !mb-9">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse inline-block mr-2"></div>
            📚 Platform Overview
          </Tag>
          
          <Title level={1} className="!text-6xl !font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text !text-transparent !mb-7 !tracking-tight !leading-tight">
            Professional Valuation Platform
          </Title>
          
          <Paragraph className="!text-3xl !text-gray-600 max-w-3xl mx-auto !leading-relaxed !font-light !mb-12">
            Comprehensive tools for startup valuation, cap table management, and financial modeling with enterprise-grade precision.
          </Paragraph>
          
          {/* Enhanced Professional Stats */}
          <Row gutter={28} className="max-w-4xl mx-auto mt-14">
            {[
              { value: '10+', label: 'Key Features' },
              { value: '∞', label: 'Scenarios' },
              { value: '100%', label: 'Accuracy' }
            ].map((stat, index) => (
              <Col span={8} key={index}>
                <Card className="bg-white/80 backdrop-blur-md !rounded-2xl !border !border-gray-200/60 !shadow-md hover:!shadow-lg transition-all duration-300 group text-center">
                  <Statistic 
                    value={stat.value} 
                    suffix=""
                    className="!text-4xl !font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text !text-transparent !mb-3 group-hover:!scale-110 transition-transform duration-300"
                  />
                  <Text className="!text-gray-700 !font-semibold !text-lg">
                    {stat.label}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Enhanced Professional Two-Column Layout */}
        <div className="grid lg:grid-cols-[320px,1fr] gap-9 max-w-7xl mx-auto">
          {/* Enhanced Sidebar Navigation */}
          <aside className="lg:sticky lg:top-28 space-y-7">
            <Card className="bg-white/90 !rounded-2xl !border !border-gray-200/60 !shadow-md !p-7 backdrop-blur-md">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">☰</span>
                </div>
                <Title level={4} className="!mb-0 !font-extrabold !text-gray-900">Platform Guide</Title>
              </div>
              
              <Space direction="vertical" className="w-full">
                {[
                  ["company", "🏢 Company Management"],
                  ["founders", "👥 Founder Configuration"],
                  ["funding", "💰 Funding Rounds"],
                  ["esop", "📈 ESOP Management"],
                  ["whatif", "🎯 What-If Analysis"],
                  ["exit-mc", "🚀 Exit & 🎲 Monte Carlo"]
                ].map(([id, label]) => (
                  <Button 
                    key={id}
                    block
                    onClick={() => scrollTo(id)}
                    className="!text-left !px-5 !py-3.5 !rounded-xl !border !border-gray-200/50 !bg-white hover:!bg-gradient-to-r hover:!from-blue-50/60 hover:!to-indigo-50/60 transition-all duration-300 !font-semibold !text-gray-700 hover:!text-blue-700 hover:!border-blue-300/70 hover:!shadow-sm flex items-center gap-3.5 group"
                  >
                    <span className="text-xl group-hover:!scale-110 transition-transform duration-300">{label.split(' ')[0]}</span>
                    <span>{label.split(' ').slice(1).join(' ')}</span>
                  </Button>
                ))}
              </Space>
            </Card>

            {/* Enhanced Feature Highlights */}
            <Card className="bg-gradient-to-br from-blue-50/70 to-indigo-50/70 !rounded-2xl !border !border-blue-200/50 !p-7 backdrop-blur-md !shadow-md">
              <Title level={4} className="!mb-5 !flex items-center !gap-2.5 !font-extrabold !text-gray-900">
                <span>⭐</span>
                Key Benefits
              </Title>
              <FeatureGrid
                items={[
                  { icon: "📊", title: "Analytics", description: "Real-time insights" },
                  { icon: "🔁", title: "Auto-save", description: "Seamless workflow" },
                  { icon: "🗂️", title: "Multi-company", description: "Organize projects" },
                  { icon: "🔒", title: "Data Security", description: "Your data, yours" }
                ]}
                columns={1}
                cardPadding={18}
              />
            </Card>
          </aside>

          {/* Enhanced Main Content Area */}
          <div className="space-y-9">
            {/* Enhanced Professional Feature Highlights Grid */}
            <Card className="bg-white/80 backdrop-blur-md !rounded-3xl !border !border-gray-200/60 !p-9 !shadow-md !mb-14">
              <div className="text-center mb-12">
                <Title level={3} className="!text-3xl !font-extrabold !text-gray-900 !mb-4">Platform Capabilities</Title>
                <Text className="!text-gray-700 max-w-2xl mx-auto !text-lg">
                  Comprehensive tools designed for professional startup valuation and financial modeling
                </Text>
              </div>
              
              <FeatureGrid
                items={[
                  { icon: "📊", title: "Analytics Dashboard", description: "Real-time waterfalls, KPI cards, and interactive charts" },
                  { icon: "🔁", title: "Auto-save & Versions", description: "Your edits are saved seamlessly with version history" },
                  { icon: "🗂️", title: "Multi-company Organization", description: "Switch contexts without losing progress" },
                  { icon: "🔒", title: "Enterprise Data Security", description: "Export at any time with full data ownership" }
                ]}
                columns={2}
                cardPadding={28}
              />
            </Card>

            {/* Enhanced Professional Sections */}
            <Section id="company" emoji="🏢" title="Company Management">
              <Row gutter={28} className="mb-7">
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Create and manage multiple companies with detailed profiles</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Set valuation, shares, and ESOP pool with precision controls</Text>
                    </li>
                  </ul>
                </Col>
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Auto-save to database with real-time synchronization</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Professional company branding and customization</Text>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 !border !border-blue-200/60 !rounded-xl">
                <Paragraph className="!text-blue-800 !font-bold !flex items-center !gap-2.5 !text-lg !mb-0">
                  <BulbOutlined />
                  Tip: Start with a detailed company profile for accurate modeling
                </Paragraph>
              </Card>
            </Section>

            <Section id="founders" emoji="👥" title="Founder Configuration">
              <Row gutter={28} className="mb-7">
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Assign roles and equity percentages with live validation</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Equal split and utility distribution algorithms</Text>
                    </li>
                  </ul>
                </Col>
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Real-time total allocation bar with visual feedback</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Professional founder profiles with detailed information</Text>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 !border !border-blue-200/60 !rounded-xl">
                <Paragraph className="!text-blue-800 !font-bold !flex items-center !gap-2.5 !text-lg !mb-0">
                  <BulbOutlined />
                  Tip: Use the allocation bar to ensure 100% equity distribution
                </Paragraph>
              </Card>
            </Section>

            <Section id="funding" emoji="💰" title="Funding Rounds">
              <Row gutter={28} className="mb-7">
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Model SAFEs, convertibles, and priced rounds with precision</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Track valuation type, cap, discount with detailed controls</Text>
                    </li>
                  </ul>
                </Col>
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Calculate shares issued & PPS with real-time updates</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Professional round documentation and investor tracking</Text>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 !border !border-blue-200/60 !rounded-xl">
                <Paragraph className="!text-blue-800 !font-bold !flex items-center !gap-2.5 !text-lg !mb-0">
                  <BulbOutlined />
                  Tip: Model rounds in chronological order for accurate dilution
                </Paragraph>
              </Card>
            </Section>

            <Section id="esop" emoji="📈" title="ESOP Management">
              <Row gutter={28} className="mb-7">
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Manage vesting schedules, cliffs, and employee status</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Compute vested shares & tax implications automatically</Text>
                    </li>
                  </ul>
                </Col>
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Impact analysis on equity allocation and dilution</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Professional grant documentation and tracking</Text>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 !border !border-blue-200/60 !rounded-xl">
                <Paragraph className="!text-blue-800 !font-bold !flex items-center !gap-2.5 !text-lg !mb-0">
                  <BulbOutlined />
                  Tip: Regular ESOP reviews help maintain competitive compensation
                </Paragraph>
              </Card>
            </Section>

            <Section id="whatif" emoji="🎯" title="What-If Analysis">
              <Row gutter={28} className="mb-7">
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Interactive sensitivity testing with real-time feedback</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Instant updates to metrics & charts with scenario changes</Text>
                    </li>
                  </ul>
                </Col>
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Save and load scenarios for comparison analysis</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Professional scenario documentation and sharing</Text>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 !border !border-blue-200/60 !rounded-xl">
                <Paragraph className="!text-blue-800 !font-bold !flex items-center !gap-2.5 !text-lg !mb-0">
                  <BulbOutlined />
                  Tip: Create multiple scenarios to prepare for different outcomes
                </Paragraph>
              </Card>
            </Section>

            <Section id="exit-mc" emoji="🚀" title="Exit & Monte Carlo (🎲)">
              <Row gutter={28} className="mb-7">
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Model IPO, acquisition, and secondary exits with precision</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Expected value calculations across multiple scenarios</Text>
                    </li>
                  </ul>
                </Col>
                <Col span={12}>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Monte Carlo trials with detailed histogram analysis</Text>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircleOutlined className="!text-blue-500 !font-extrabold !text-xl !mt-0.5" />
                      <Text className="!text-gray-700 !text-lg">Professional exit modeling and risk assessment</Text>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 !border !border-blue-200/60 !rounded-xl">
                <Paragraph className="!text-blue-800 !font-bold !flex items-center !gap-2.5 !text-lg !mb-0">
                  <BulbOutlined />
                  Tip: Run Monte Carlo simulations to understand risk distributions
                </Paragraph>
              </Card>
            </Section>

            {/* Enhanced Professional CTA Section */}
            <Card className="text-center !py-14 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 !rounded-3xl !border !border-blue-200/50 backdrop-blur-md !shadow-lg !mt-14">
              <div className="max-w-3xl mx-auto px-7">
                <Title level={2} className="!text-4xl !font-extrabold !text-gray-900 !mb-5">Ready to Start Modeling?</Title>
                <Paragraph className="!text-2xl !text-gray-600 !mb-10 !leading-relaxed">
                  Enter the app to create your company and run your first professional valuation scenario.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={() => (window.location.hash = "#/dashboard")}
                  className="!group !inline-flex !items-center !gap-3.5 !px-9 !py-5 !rounded-2xl !font-extrabold !text-xl !shadow-2xl hover:!shadow-3xl hover:!-translate-y-1.5"
                >
                  Enter Professional App
                  <ArrowRightOutlined />
                </Button>
                
                <div className="flex justify-center gap-10 mt-10 !text-base !text-gray-600 !font-semibold">
                  <Tag color="green" className="!flex !items-center !gap-2.5">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    No credit card required
                  </Tag>
                  <Tag color="blue" className="!flex !items-center !gap-2.5">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Enterprise features
                  </Tag>
                  <Tag color="purple" className="!flex !items-center !gap-2.5">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    Professional support
                  </Tag>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearnMore;