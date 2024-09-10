import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Upload } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import { reFetchData } from '../../store/slice/appSlice';

function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Function to handle form submission
  const onFinish = (values) => {
    const formdata = new FormData();
    formdata.append('event_name', values.event_name);
    formdata.append('event_slug', values.event_slug);
    formdata.append('event_type', values.event_type);
    formdata.append('event_date', values.event_date);
    formdata.append('event_location', values.event_location);
    formdata.append('event_description', values.event_description);
    formdata.append('event_organizer', values.event_organizer);

    // Attach event images
    values.event_images.forEach((image) => {
      formdata.append('event_images', image.originFileObj);
    });

    setLoading(true);
    ApiService.post('/api/event/create', formdata, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        setLoading(false);
        if (response?.result_code === 0) {
          notificationWithIcon('success', 'SUCCESS', response?.result?.message || 'New event created successfully');
          form.resetFields();
          dispatch(reFetchData());
        } else {
          notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong.');
        }
      })
      .catch((err) => {
        setLoading(false);
        notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || 'Server error');
      });
  };

  return (
    <Form
      form={form}
      className='create-event-form'
      name='create-event-form'
      onFinish={onFinish}
      layout='vertical'
    >
      <div className='two-grid-column'>
        <Form.Item
          className='w-full md:w-1/2'
          label='Event Name'
          name='event_name'
          rules={[{ required: true, message: 'Please input the Event Name!' }]}
        >
          <Input placeholder='Event Name' size='large' allowClear />
        </Form.Item>

        <Form.Item
          className='w-full md:w-1/2'
          label='Event Slug'
          name='event_slug'
          rules={[{ required: true, message: 'Please input the Event Slug!' }]}
        >
          <Input placeholder='Event Slug' size='large' allowClear />
        </Form.Item>
      </div>

      <div className='two-grid-column'>
        <Form.Item
          className='w-full md:w-1/2'
          label='Event Type'
          name='event_type'
          rules={[{ required: true, message: 'Please select Event Type!' }]}
        >
          <Select
            placeholder='-- Select Event Type --'
            options={[
              { value: 'online', label: 'Online' },
              { value: 'offline', label: 'Offline' }
            ]}
            size='large'
            allowClear
          />
        </Form.Item>

        <Form.Item
          className='w-full md:w-1/2'
          label='Event Date'
          name='event_date'
          rules={[{ required: true, message: 'Please input the Event Date!' }]}
        >
          <Input type='date' className='w-full' size='large' />
        </Form.Item>
      </div>

      <div className='two-grid-column'>
        <Form.Item
          className='w-full md:w-1/2'
          label='Event Location'
          name='event_location'
          rules={[{ required: true, message: 'Please input the Event Location!' }]}
        >
          <Input placeholder='Event Location' size='large' allowClear />
        </Form.Item>

        <Form.Item
          className='w-full md:w-1/2'
          label='Event Organizer'
          name='event_organizer'
          rules={[{ required: true, message: 'Please input the Event Organizer!' }]}
        >
          <Input placeholder='Event Organizer' size='large' allowClear />
        </Form.Item>
      </div>

      <Form.Item
        label='Event Description'
        name='event_description'
        rules={[{ required: true, message: 'Please input the Event Description!' }]}
      >
        <Input.TextArea placeholder='Type here Event Description' rows={4} />
      </Form.Item>

      <Form.Item
        name='event_images'
        label='Event Images'
        valuePropName='fileList'
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Please upload Event Images!' }]}
      >
        <Upload
          listType='picture-card'
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          accept='.jpg,.jpeg,.png'
          beforeUpload={() => false}
          fileList={fileList}
          maxCount={10}
        >
          {fileList.length >= 10 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          size='large'
          loading={loading}
          disabled={loading}
        >
          Create New Event
        </Button>
      </Form.Item>
    </Form>
  );
}

export default React.memo(CreateEvent);
