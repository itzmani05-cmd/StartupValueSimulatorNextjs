import React from 'react';
import { Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      closeIcon={<CloseOutlined />}
      className="about-modal"
    >
      <div className="about-modal-content">
        <div className="about-header">
          <h2>About Startup Value Simulator</h2>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
            className="close-button"
          />
        </div>
        
        <div className="about-body">
          <div className="about-section">
            <h3>🚀 What is Startup Value Simulator?</h3>
            <p>
              Startup Value Simulator is a comprehensive platform designed for founders, investors, 
              and financial professionals to model and analyze startup valuations with precision. 
              Our tool helps you understand complex equity structures, dilution impacts, and exit scenarios.
            </p>
          </div>
          
          <div className="about-section">
            <h3>🎯 Key Features</h3>
            <ul className="features-list">
              <li><strong>Cap Table Modeling:</strong> Visualize ownership structures and track dilution across funding rounds</li>
              <li><strong>ESOP Management:</strong> Model employee stock option pools with vesting schedules</li>
              <li><strong>Scenario Planning:</strong> Compare multiple growth and exit paths</li>
              <li><strong>Monte Carlo Simulations:</strong> Quantify risk with probabilistic modeling</li>
              <li><strong>Funding Round Analysis:</strong> Model SAFEs, convertibles, and priced rounds</li>
              <li><strong>Exit Scenarios:</strong> Model IPO, acquisition, and secondary sale outcomes</li>
            </ul>
          </div>
          
          <div className="about-section">
            <h3>💡 Why Use Our Platform?</h3>
            <p>
              Unlike generic financial calculators, Startup Value Simulator provides:
            </p>
            <ul className="benefits-list">
              <li>Industry-specific modeling for startup valuations</li>
              <li>Real-time collaboration with your team</li>
              <li>Bank-level security for your sensitive financial data</li>
              <li>Export capabilities for board presentations and investor decks</li>
              <li>Regular updates with the latest valuation methodologies</li>
            </ul>
          </div>
          
          <div className="about-section">
            <h3>👥 Who Is This For?</h3>
            <div className="audience-grid">
              <div className="audience-card">
                <h4>Founders & Executives</h4>
                <p>Make informed decisions about fundraising, hiring, and exit strategies</p>
              </div>
              <div className="audience-card">
                <h4>Investors & VCs</h4>
                <p>Analyze potential investments and model portfolio scenarios</p>
              </div>
              <div className="audience-card">
                <h4>Financial Professionals</h4>
                <p>Provide expert valuation services with professional-grade tools</p>
              </div>
            </div>
          </div>
          
          <div className="about-section">
            <h3>🔒 Security & Privacy</h3>
            <p>
              We take data security seriously. All data is encrypted in transit and at rest. 
              We never share your financial information with third parties. 
              For enterprise users, we offer private cloud and on-premise deployment options.
            </p>
          </div>
          
          <div className="about-section">
            <h3>📬 Get In Touch</h3>
            <p>
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> support@startupvaluesimulator.com</p>
              <p><strong>Website:</strong> www.startupvaluesimulator.com</p>
            </div>
          </div>
        </div>
        
        <div className="about-footer">
          <Button type="primary" onClick={onClose}>
            Got It
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;