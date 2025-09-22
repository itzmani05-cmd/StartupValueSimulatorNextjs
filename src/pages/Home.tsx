import Footer from '../components/Footer';
import React from 'react';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import FeatureGrid from '../components/FeatureGrid';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Professional Header with Glass Effect */}
      <header className="relative bg-white/90 backdrop-blur-lg border-b border-gray-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Professional Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">🚀</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <Title level={3} className="!mb-0 !font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text !text-transparent">
                  Startup Value Simulator
                </Title>
              </div>
            </div>
            
            {/* Professional Navigation */}
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={() => (window.location.hash = "#/dashboard")}
              size="large"
            >
              Enter App
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Enhanced Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Tag color="blue" className="!text-base !py-2.5 !px-5 !rounded-full !mb-8 !shadow-sm !backdrop-blur-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse inline-block mr-2"></div>
            🚀 Plan. Simulate. Decide.
          </Tag>
          
          <Title level={1} className="!text-5xl !font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text !text-transparent !mb-6 !tracking-tight !leading-tight">
            Model dilution, ESOP, and exits with confidence
          </Title>
          
          <Paragraph className="!text-2xl !text-gray-600 max-w-3xl mx-auto !leading-relaxed !font-light !mb-10">
            Build comprehensive scenarios, run Monte Carlo simulations, and visualize ownership changes across funding rounds with our professional startup valuation platform.
          </Paragraph>
          
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => (window.location.hash = "#/dashboard")}
              className="!group !inline-flex !items-center !gap-3 !px-8 !py-4 !rounded-2xl !font-bold !text-lg !shadow-xl hover:!shadow-2xl hover:!-translate-y-1"
            >
              🚀 Get Started
              <ArrowRightOutlined />
            </Button>
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => (window.location.hash = "#/features")}
              className="!group !inline-flex !items-center !gap-3 !px-8 !py-4 !rounded-2xl !border !border-gray-300/60 !text-gray-700 !bg-white/80 hover:!bg-white hover:!border-gray-400 transition-all duration-200 !font-bold !text-lg !shadow-sm hover:!shadow-md"
            >
              <ArrowLeftOutlined />
              Learn More
            </Button>
          </Space>
        </div>

        {/* Value Props */}
        <div className="mb-20">
          <FeatureGrid
            items={[
              { icon: '📈', title: 'Scenario planning', description: 'Compare multiple growth and exit paths.' },
              { icon: '🧮', title: 'Cap table math', description: 'See dilution impacts across rounds.' },
              { icon: '🎲', title: 'Monte Carlo', description: 'Quantify risk with distributions.' },
              { icon: '📊', title: 'Analytics', description: 'Ownership, dilution, and projections.' }
            ]}
            columns={4}
            cardPadding={24}
          />
        </div>

        {/* How it works */}
        <Row gutter={24} className="mb-20">
          {[
            {step:'1',title:'Create company',desc:'Set shares, ESOP pool, and valuation.'},
            {step:'2',title:'Add rounds',desc:'Model SAFEs/priced rounds. Track dilution.'},
            {step:'3',title:'Simulate exits',desc:'Run Monte Carlo and compare scenarios.'}
          ].map((s, i) => (
            <Col span={8} key={i}>
              <Card 
                className="bg-gradient-to-br from-gray-900 to-gray-800 !text-white !rounded-2xl !border !border-gray-700/50 !shadow-lg hover:!shadow-xl transition-all duration-300"
              >
                <div className="text-gray-400 mb-2">Step {s.step}</div>
                <Title level={4} className="!text-white !mb-2">{s.title}</Title>
                <Paragraph className="!text-white/90 !mb-0">{s.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Closing CTA */}
        <Card className="text-center !py-12 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 !rounded-3xl !border !border-blue-200/40 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto px-6">
            <Title level={3} className="!text-3xl !font-bold !text-gray-900 !mb-4">Ready to Start Modeling?</Title>
            <Paragraph className="!text-xl !text-gray-600 !mb-8 !leading-relaxed">
              Enter the app to create your company and run your first professional valuation scenario.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => (window.location.hash = "#/dashboard")}
              className="!group !inline-flex !items-center !gap-3 !px-8 !py-4 !rounded-2xl !font-bold !text-lg !shadow-xl hover:!shadow-2xl hover:!-translate-y-1"
            >
              Enter Professional App
              <ArrowRightOutlined />
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Home;