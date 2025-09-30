import React from "react";
import { Card, Button, Row, Col, Space, Tag, Typography, Divider, Statistic, Collapse, Layout, theme } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined, BulbOutlined, HomeOutlined } from '@ant-design/icons';
import FeatureGrid from "../components/FeatureGrid";
import Footer from "../components/Footer";
import Header from "../components/Header";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { useToken } = theme;
const { Panel } = Collapse;

const Section: React.FC<{
  id?: string;
  title: string;
  emoji?: string;
  children: React.ReactNode;
}> = ({ id, title, emoji, children }) => {
  const { token } = useToken();
  
  return (
    <Card 
      id={id}
      style={{ 
        borderRadius: '24px',
        marginBottom: '32px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
      bodyStyle={{ padding: '32px' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Professional Section Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          {emoji && (
            <div style={{ 
              width: '72px', 
              height: '72px', 
              background: 'linear-gradient(to bottom right, #e6f7ff, #f0f9ff)',
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: `1px solid ${token.colorBorder}`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ fontSize: '32px' }}>{emoji}</span>
            </div>
          )}
          <div>
            <Title level={2} style={{ 
              margin: 0, 
              fontWeight: 800, 
              color: token.colorText,
              background: 'linear-gradient(to right, #1a1a1a, #4b4b4b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {title}
            </Title>
            <div style={{ 
              height: '6px', 
              width: '64px', 
              background: 'linear-gradient(to right, #1890ff, #096dd9)',
              borderRadius: '3px',
              marginTop: '12px'
            }}></div>
          </div>
        </div>
        {children}
      </div>
    </Card>
  );
};

const LearnMore: React.FC = () => {
  const { token } = useToken();
  
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)' }}>
      <Header showAuthControls={false} />
      
      <Content style={{ padding: '24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Professional Hero Section */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '80px' }}>
            <Tag 
              color="blue" 
              style={{ 
                fontSize: '16px', 
                padding: '10px 24px', 
                borderRadius: '999px', 
                marginBottom: '36px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div 
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: token.colorPrimary, 
                  borderRadius: '50%', 
                  display: 'inline-block',
                  animation: 'pulse 2s infinite'
                }}
              />
              📚 Platform Overview
            </Tag>
            
            <Title level={1} style={{ 
              fontSize: '48px', 
              fontWeight: 800, 
              margin: '0 0 28px 0',
              background: 'linear-gradient(to right, #1a1a1a, #4b4b4b, #1a1a1a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Professional Valuation Platform
            </Title>
            
            <Paragraph style={{ 
              fontSize: '24px', 
              color: token.colorTextSecondary,
              maxWidth: '600px',
              margin: '0 auto 48px',
              lineHeight: 1.6
            }}>
              Comprehensive tools for startup valuation, cap table management, and financial modeling with enterprise-grade precision.
            </Paragraph>
            
            {/* Professional Stats */}
            <Row gutter={28} style={{ maxWidth: '600px', margin: '56px auto 0' }}>
              {[
                { value: '10+', label: 'Key Features' },
                { value: '∞', label: 'Scenarios' },
                { value: '100%', label: 'Accuracy' }
              ].map((stat, index) => (
                <Col span={8} key={index}>
                  <Card 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px',
                      border: `1px solid ${token.colorBorder}`,
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '24px' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.parentElement!.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.parentElement!.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.parentElement!.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.parentElement!.style.transform = 'translateY(0)';
                    }}
                  >
                    <Statistic 
                      value={stat.value} 
                      suffix=""
                      style={{ 
                        fontSize: '32px', 
                        fontWeight: 800,
                        margin: '0 0 12px 0',
                        background: 'linear-gradient(to right, #1890ff, #096dd9)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    />
                    <Text style={{ 
                      color: token.colorText, 
                      fontWeight: 600, 
                      fontSize: '16px'
                    }}>
                      {stat.label}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Professional Two-Column Layout */}
          <div style={{ display: 'flex', gap: '36px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Sidebar Navigation */}
            <div style={{ width: '320px', position: 'sticky', top: '28px', alignSelf: 'flex-start' }}>
              <Card 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  border: `1px solid ${token.colorBorder}`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
                bodyStyle={{ padding: '28px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    background: 'linear-gradient(to bottom right, #1890ff, #096dd9)',
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>☰</span>
                  </div>
                  <Title level={4} style={{ margin: 0, fontWeight: 800, color: token.colorText }}>
                    Platform Guide
                  </Title>
                </div>
                
                <Space direction="vertical" style={{ width: '100%' }}>
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
                      style={{
                        textAlign: 'left',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        border: `1px solid ${token.colorBorder}`,
                        background: 'white',
                        fontWeight: 600,
                        color: token.colorText,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #e6f7ff, #f0f9ff)';
                        e.currentTarget.style.borderColor = token.colorPrimary;
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = token.colorBorder;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={{ fontSize: '24px', transition: 'transform 0.3s ease' }}>{label.split(' ')[0]}</span>
                      <span>{label.split(' ').slice(1).join(' ')}</span>
                    </Button>
                  ))}
                </Space>
              </Card>

              {/* Feature Highlights */}
              <Card 
                style={{ 
                  background: 'linear-gradient(to bottom right, #e6f7ff, #f0f9ff)',
                  borderRadius: '20px',
                  border: `1px solid ${token.colorPrimaryBorder}`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  marginTop: '28px'
                }}
                bodyStyle={{ padding: '28px' }}
              >
                <Title level={4} style={{ 
                  margin: '0 0 20px 0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  fontWeight: 800, 
                  color: token.colorText 
                }}>
                  <span>⭐</span>
                  Key Benefits
                </Title>
                
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {[
                    "Real-time cap table management",
                    "Multi-scenario financial modeling",
                    "Professional valuation reports",
                    "Advanced what-if analysis",
                    "Monte Carlo simulations",
                    "Investor-ready documentation"
                  ].map((benefit, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <CheckCircleOutlined style={{ 
                        color: token.colorSuccess, 
                        fontSize: '20px', 
                        marginTop: '2px' 
                      }} />
                      <Text style={{ color: token.colorText, fontWeight: 500 }}>
                        {benefit}
                      </Text>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Section id="company" title="Company Management" emoji="🏢">
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Paragraph style={{ fontSize: '18px', lineHeight: 1.7, color: token.colorText }}>
                        Configure your startup's foundational details including company name, incorporation date, 
                        jurisdiction, and share structure. Set up your initial cap table with accurate share classes 
                        and ownership distribution.
                      </Paragraph>
                      
                      <div style={{ 
                        background: 'linear-gradient(to right, #f0f9ff, #e6f7ff)', 
                        padding: '20px', 
                        borderRadius: '16px', 
                        border: `1px solid ${token.colorBorder}`,
                        marginTop: '24px'
                      }}>
                        <Title level={5} style={{ 
                          margin: '0 0 16px 0', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          color: token.colorPrimary
                        }}>
                          <BulbOutlined />
                          Pro Tip
                        </Title>
                        <Text style={{ color: token.colorText, fontSize: '16px' }}>
                          Accurate company setup is crucial for all subsequent valuations. Ensure your share 
                          structure matches your legal documentation exactly.
                        </Text>
                      </div>
                    </div>
                    
                    <div style={{ 
                      width: '300px', 
                      height: '200px', 
                      background: 'linear-gradient(to bottom right, #1890ff, #096dd9)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px'
                    }}>
                      🏢
                    </div>
                  </div>
                </Section>

                <Section id="founders" title="Founder Configuration" emoji="👥">
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '300px', 
                      height: '200px', 
                      background: 'linear-gradient(to bottom right, #ffadd2, #ff7875)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px'
                    }}>
                      👥
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <Paragraph style={{ fontSize: '18px', lineHeight: 1.7, color: token.colorText }}>
                        Define founder details including names, contact information, and equity distribution. 
                        Configure vesting schedules with customizable cliff periods and vesting curves. Track 
                        founder contributions and roles over time.
                      </Paragraph>
                      
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: '24px 0 0 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        {[
                          "Custom vesting schedules",
                          "Cliff period configuration",
                          "Equity distribution tracking",
                          "Role and contribution history"
                        ].map((item, index) => (
                          <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CheckCircleOutlined style={{ color: token.colorSuccess }} />
                            <Text style={{ color: token.colorText, fontWeight: 500 }}>
                              {item}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Section>

                <Section id="funding" title="Funding Rounds" emoji="💰">
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Paragraph style={{ fontSize: '18px', lineHeight: 1.7, color: token.colorText }}>
                        Manage all funding events from seed to Series rounds. Track investor details, 
                        investment amounts, valuation metrics, and security types. Automatically update 
                        cap table with each funding event.
                      </Paragraph>
                      
                      <Row gutter={16} style={{ marginTop: '24px' }}>
                        {[
                          { label: "Pre-Money Valuation", value: "$5M" },
                          { label: "Investment Amount", value: "$2M" },
                          { label: "Post-Money Valuation", value: "$7M" },
                          { label: "Equity Sold", value: "28.6%" }
                        ].map((stat, index) => (
                          <Col span={12} key={index}>
                            <Card 
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '12px',
                                border: `1px solid ${token.colorBorder}`
                              }}
                              bodyStyle={{ padding: '16px' }}
                            >
                              <Text style={{ 
                                color: token.colorTextSecondary, 
                                fontSize: '14px',
                                display: 'block',
                                marginBottom: '8px'
                              }}>
                                {stat.label}
                              </Text>
                              <Text style={{ 
                                color: token.colorText, 
                                fontWeight: 700, 
                                fontSize: '20px'
                              }}>
                                {stat.value}
                              </Text>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                    
                    <div style={{ 
                      width: '300px', 
                      height: '200px', 
                      background: 'linear-gradient(to bottom right, #ffd591, #ffc069)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px'
                    }}>
                      💰
                    </div>
                  </div>
                </Section>

                <Section id="esop" title="ESOP Management" emoji="📈">
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '300px', 
                      height: '200px', 
                      background: 'linear-gradient(to bottom right, #95de64, #5cdbd3)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px'
                    }}>
                      📈
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <Paragraph style={{ fontSize: '18px', lineHeight: 1.7, color: token.colorText }}>
                        Configure and manage your Employee Stock Option Plan with precision. Track 
                        option grants, exercise events, and dilution effects. Model different vesting 
                        scenarios and their impact on ownership.
                      </Paragraph>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        marginTop: '24px',
                        padding: '20px',
                        background: 'linear-gradient(to right, #f6ffed, #f0f9ff)',
                        borderRadius: '12px',
                        border: `1px solid ${token.colorBorder}`
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <Text style={{ 
                            display: 'block', 
                            fontSize: '24px', 
                            fontWeight: 700, 
                            color: token.colorPrimary 
                          }}>
                            15%
                          </Text>
                          <Text style={{ color: token.colorTextSecondary, fontSize: '14px' }}>
                            Pool Size
                          </Text>
                        </div>
                        <Divider type="vertical" style={{ height: 'auto' }} />
                        <div style={{ textAlign: 'center' }}>
                          <Text style={{ 
                            display: 'block', 
                            fontSize: '24px', 
                            fontWeight: 700, 
                            color: token.colorWarning 
                          }}>
                            8.2%
                          </Text>
                          <Text style={{ color: token.colorTextSecondary, fontSize: '14px' }}>
                            Allocated
                          </Text>
                        </div>
                        <Divider type="vertical" style={{ height: 'auto' }} />
                        <div style={{ textAlign: 'center' }}>
                          <Text style={{ 
                            display: 'block', 
                            fontSize: '24px', 
                            fontWeight: 700, 
                            color: token.colorSuccess 
                          }}>
                            6.8%
                          </Text>
                          <Text style={{ color: token.colorTextSecondary, fontSize: '14px' }}>
                            Remaining
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>

                <Section id="whatif" title="What-If Analysis" emoji="🎯">
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Paragraph style={{ fontSize: '18px', lineHeight: 1.7, color: token.colorText }}>
                        Model different business scenarios and their impact on valuation. Test various 
                        assumptions about revenue growth, market conditions, and funding strategies. 
                        Compare outcomes side-by-side to make informed decisions.
                      </Paragraph>
                      
                      <Collapse 
                        bordered={false} 
                        style={{ 
                          background: 'transparent', 
                          marginTop: '24px' 
                        }}
                      >
                        <Panel 
                          header={
                            <Text style={{ 
                              fontWeight: 600, 
                              fontSize: '16px',
                              color: token.colorText
                            }}>
                              Common Scenarios
                            </Text>
                          } 
                          key="1"
                        >
                          <ul style={{ 
                            listStyle: 'none', 
                            padding: 0, 
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}>
                            {[
                              "Conservative growth projection",
                              "Aggressive expansion scenario",
                              "Market downturn impact",
                              "Early exit vs. growth strategy"
                            ].map((scenario, index) => (
                              <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <ArrowRightOutlined style={{ color: token.colorPrimary }} />
                                <Text style={{ color: token.colorText }}>
                                  {scenario}
                                </Text>
                              </li>
                            ))}
                          </ul>
                        </Panel>
                      </Collapse>
                    </div>
                    
                    <div style={{ 
                      width: '300px', 
                      height: '200px', 
                      background: 'linear-gradient(to bottom right, #b37feb, #9254de)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px'
                    }}>
                      🎯
                    </div>
                  </div>
                </Section>

                <Section id="exit-mc" title="Exit & Monte Carlo" emoji="🚀">
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '300px', 
                      height: '200px', 
                      background: 'linear-gradient(to bottom right, #ffadd2, #b37feb)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px'
                    }}>
                      🚀
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <Paragraph style={{ fontSize: '18px', lineHeight: 1.7, color: token.colorText }}>
                        Model potential exit scenarios including IPOs, acquisitions, and secondary sales. 
                        Run Monte Carlo simulations to understand probability distributions of outcomes. 
                        Generate professional exit analysis reports for stakeholders.
                      </Paragraph>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '16px', 
                        marginTop: '24px' 
                      }}>
                        <Card 
                          style={{ 
                            background: 'linear-gradient(to bottom right, #fff1f0, #f9f0ff)',
                            borderRadius: '12px',
                            border: `1px solid ${token.colorBorder}`
                          }}
                          bodyStyle={{ padding: '20px' }}
                        >
                          <Text style={{ 
                            display: 'block', 
                            fontWeight: 700, 
                            fontSize: '16px', 
                            marginBottom: '12px',
                            color: token.colorText
                          }}>
                            Acquisition
                          </Text>
                          <Text style={{ 
                            display: 'block', 
                            fontSize: '24px', 
                            fontWeight: 800,
                            color: token.colorPrimary,
                            margin: '8px 0'
                          }}>
                            $45M
                          </Text>
                          <Text style={{ color: token.colorTextSecondary, fontSize: '14px' }}>
                            2.5x Return Multiple
                          </Text>
                        </Card>
                        
                        <Card 
                          style={{ 
                            background: 'linear-gradient(to bottom right, #f0f5ff, #f0fffb)',
                            borderRadius: '12px',
                            border: `1px solid ${token.colorBorder}`
                          }}
                          bodyStyle={{ padding: '20px' }}
                        >
                          <Text style={{ 
                            display: 'block', 
                            fontWeight: 700, 
                            fontSize: '16px', 
                            marginBottom: '12px',
                            color: token.colorText
                          }}>
                            IPO
                          </Text>
                          <Text style={{ 
                            display: 'block', 
                            fontSize: '24px', 
                            fontWeight: 800,
                            color: token.colorSuccess,
                            margin: '8px 0'
                          }}>
                            $72M
                          </Text>
                          <Text style={{ color: token.colorTextSecondary, fontSize: '14px' }}>
                            4.0x Return Multiple
                          </Text>
                        </Card>
                      </div>
                    </div>
                  </div>
                </Section>
              </Space>
            </div>
          </div>
        </div>
      </Content>
      
      <Footer />
    </Layout>
  );
};

export default LearnMore;