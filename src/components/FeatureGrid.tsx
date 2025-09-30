import React from 'react';
import { Card, Row, Col } from 'antd';
import { theme } from 'antd';

const { useToken } = theme;

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  columns?: 1 | 2 | 3 | 4;
  cardPadding?: number;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ items, columns = 3 }) => {
  const { token } = useToken();
  
  // Map columns to AntD grid spans
  const columnSpans = {
    1: 24,
    2: 12,
    3: 8,
    4: 6
  };
  
  const span = columnSpans[columns] || 8;
  
  return (
    <Row gutter={[20, 20]}>
      {items.map((f, i) => (
        <Col xs={24} sm={12} md={span} key={i}>
          <Card 
            hoverable
            style={{ 
              borderRadius: '12px',
              height: '100%',
              transition: 'all 0.3s',
            }}
            bodyStyle={{ 
              padding: 24,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <div 
              style={{ 
                fontSize: '36px', 
                marginBottom: 16,
                transition: 'transform 0.3s',
              }}
            >
              {f.icon}
            </div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              margin: '0 0 12px 0',
              color: token.colorText
            }}>
              {f.title}
            </h3>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: 1.5,
              color: token.colorTextSecondary,
              margin: 0
            }}>
              {f.description}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default FeatureGrid;