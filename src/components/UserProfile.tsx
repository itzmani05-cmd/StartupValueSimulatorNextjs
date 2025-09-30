import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await updateUserProfile(values);
      message.success('Profile updated successfully!');
    } catch (error: any) {
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="User Profile" className="max-w-2xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          company: user?.company || '',
          role: user?.role || '',
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Your full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="Your email address" disabled />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
        >
          <Input placeholder="Your phone number" />
        </Form.Item>

        <Form.Item
          label="Company"
          name="company"
        >
          <Input placeholder="Your company name" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
        >
          <Input placeholder="Your role in the company" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserProfile;