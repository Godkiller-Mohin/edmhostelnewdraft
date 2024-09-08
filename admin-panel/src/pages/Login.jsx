import { LoadingOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  Alert, Button, Divider, Form, Input
} from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTimeout from '../hooks/useTimeout';
import ApiService from '../utils/apiService';
import { setSessionUserAndToken } from '../utils/authentication';

function Login() {
  window.document.title = 'EDm hostel — Login';
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Timeout callback to clear the error message
  const [timeout] = useTimeout(() => {
    setErrMsg('');
  }, 2000);

  timeout();
  const handleLogin = async (loginData) => {
    try {
      const res = await ApiService.post('/api/auth/login', loginData);
      console.log('Login response:', res);
  
      // Extract token, refreshToken, and user from response
      const token = res?.result?.data?.accessToken;
      const refreshToken = res?.result?.data?.refreshToken;
      const user = res?.result?.data?.user;
  
      // Save tokens and user data to localStorage
      if (token) {
        localStorage.setItem('token', token);
        console.log('Access token saved to localStorage');
      } else {
        console.log('Access token not found in the response');
        setErrMsg('Login failed. Access token not found.');
        return; // Exit early if access token is not found
      }
  
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Refresh token saved to localStorage');
      } else {
        console.log('Refresh token not found in the response');
        setErrMsg('Login failed. Refresh token not found.');
      }
  
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User data saved to localStorage');
      } else {
        console.log('User data not found in the response');
      }
  
      // Set session user and token, and redirect on successful login
      setSessionUserAndToken(user, token);
      window.location.href = '/main/dashboard';
  
    } catch (err) {
      setErrMsg(err?.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  

  
  
  
  

  // Function to handle user login
  const onFinish = async (values) => {
    setLoading(true);
    handleLogin(values);
  };


  return (
    <section className='flex flex-col h-screen items-center justify-center'>
      <div className='w-[90%] md:w-[450px]'>
        <Link to='/'>
          <img
            className='w-[280px] h-[65px] mx-auto'
            alt='EDM-logo'
          />
        </Link>

        <Divider className='!mb-10'>LOGIN AUTHORIZED USER ONLY</Divider>
        {errMsg && <Alert message={errMsg} type='error' className='!text-center' />}

        <Form
          name='beach-resort-login'
          className='login-form mt-5'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size='large'
        >
          <Form.Item
            name='email'
            rules={[{
              type: 'email',
              required: true,
              message: 'Please input your Email!'
            }]}
          >
            <Input
              prefix={<MailOutlined className='site-form-item-icon mr-2' />}
              placeholder='Enter here your Email'
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{
              required: true,
              message: 'Please input your Password!'
            }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon mr-2' />}
              placeholder='Enter here your Password'
              type='password'
            />
          </Form.Item>

          {/* FORM SUBMIT BUTTON */}
          <Form.Item>
            <Button
              className='login-form-button mt-5'
              disabled={loading}
              loading={loading}
              htmlType='submit'
              type='primary'
              block
            >
              {loading ? <LoadingOutlined /> : 'Login'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default React.memo(Login);
