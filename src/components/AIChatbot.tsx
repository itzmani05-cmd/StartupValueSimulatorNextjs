import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Space, Spin, Typography, Badge, theme } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, CloseOutlined, MessageOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { useToken } = theme;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Startup Value Simulator assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useToken();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // If chat is closed and we receive a new AI message, increment unread count
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].sender === 'ai') {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  const simulateAIResponse = (userMessage: string): string => {
    // Simple response logic - in a real app, this would connect to an AI API
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello there! How can I assist you with your startup valuation today?';
    } else if (lowerMessage.includes('founder') || lowerMessage.includes('equity')) {
      return 'The Founder Configuration tab allows you to set equity splits between founders, define roles, and manage the ESOP pool. You can add multiple founders and specify their share percentages.';
    } else if (lowerMessage.includes('funding') || lowerMessage.includes('round')) {
      return 'In the Funding Rounds tab, you can model different types of funding rounds including SAFEs, convertibles, and priced rounds. You can specify valuation caps, discounts, and track investor information.';
    } else if (lowerMessage.includes('esop') || lowerMessage.includes('option')) {
      return 'The ESOP Management tab helps you model employee stock option pools. You can create grants for employees, set vesting schedules, and track the impact on your cap table.';
    } else if (lowerMessage.includes('valuation') || lowerMessage.includes('value')) {
      return 'The Results tab shows detailed valuation analysis including current valuation, exit scenarios, and dilution impacts. You can also run Monte Carlo simulations to model different outcomes.';
    } else if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else if (lowerMessage.includes('monte carlo') || lowerMessage.includes('simulation')) {
      return 'Our Monte Carlo simulation feature allows you to model thousands of potential outcomes based on different variables like exit valuations, funding rounds, and market conditions. This helps you understand the range of possible outcomes for your startup.';
    } else if (lowerMessage.includes('cap table') || lowerMessage.includes('captable')) {
      return 'The cap table modeling feature provides a comprehensive view of your company\'s equity distribution. You can track ownership percentages, dilution impacts, and see how different funding scenarios affect each stakeholder.';
    } else {
      const responses = [
        'I understand you\'re asking about startup valuation. The Startup Value Simulator helps you model different scenarios for your company\'s equity structure.',
        'That\'s a great question about startup finance. Our platform provides tools for cap table modeling, ESOP management, and scenario planning.',
        'For detailed analysis of your startup\'s valuation, I recommend exploring the different tabs in our dashboard. Each section focuses on a specific aspect of startup finance.',
        'Our Monte Carlo simulation feature can help you understand potential outcomes based on different variables. Would you like to know more about that?',
        'The platform supports modeling of various funding instruments including SAFEs, convertibles, and priced rounds. Each has different impacts on your cap table.',
        'You can save and compare different scenarios to see how various decisions might affect your company\'s valuation and equity distribution.',
        'The ESOP management tools help you track employee stock options, vesting schedules, and the impact on your overall cap table.'
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset unread count when opening chat
      setUnreadCount(0);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {!isOpen ? (
        <Badge count={unreadCount} overflowCount={99}>
          <Button
            type="primary"
            shape="circle"
            icon={<MessageOutlined />}
            size="large"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
            onClick={toggleChat}
          />
        </Badge>
      ) : (
        <Card 
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 400,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: `1px solid ${token.colorBorder}`,
          }}>
            <Space>
              <RobotOutlined style={{ fontSize: '20px', color: token.colorPrimary }} />
              <div>
                <Title level={5} style={{ margin: 0 }}>AI Assistant</Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>Startup Value Simulator</Text>
              </div>
            </Space>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={toggleChat}
            />
          </div>
          
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: 'calc(80vh - 180px)',
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  maxWidth: '80%',
                }}>
                  {message.sender === 'ai' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: token.colorPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}>
                      <RobotOutlined />
                    </div>
                  )}
                  <div>
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '16px',
                      backgroundColor: message.sender === 'user' 
                        ? token.colorPrimary 
                        : token.colorFillAlter,
                      color: message.sender === 'user' 
                        ? 'white' 
                        : token.colorText,
                      maxWidth: '100%',
                    }}>
                      <Text style={{ color: 'inherit' }}>{message.text}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </div>
                  {message.sender === 'user' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: token.colorSuccess,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}>
                      <UserOutlined />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: token.colorPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                  }}>
                    <RobotOutlined />
                  </div>
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '16px',
                    backgroundColor: token.colorFillAlter,
                  }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div style={{
            padding: '16px',
            borderTop: `1px solid ${token.colorBorder}`,
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input.TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleKeyPress}
                placeholder="Ask me about startup valuation, equity splits, funding rounds..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIChatbot;