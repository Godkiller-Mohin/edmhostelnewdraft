import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Upload, Switch, notification } from 'antd';
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
    formdata.append('event_duration', values.event_duration);
    formdata.append('event_capacity', values.event_capacity);
    formdata.append('allow_guests', values.allow_guests);
    formdata.append('provide_meals', values.provide_meals);
    formdata.append('featured_event', values.featured_event);
    formdata.append('event_description', values.event_description);
    formdata.append('organized_by', values.organized_by);
    formdata.append('event_theme', values.event_theme);
    formdata.append('performing_artists', values.performing_artists);
    formdata.append('event_timings[start_time]', values.event_timings.start_time);
    formdata.append('event_timings[end_time]', values.event_timings.end_time);
    // Attach event images
    values.event_images.forEach((image) => {
      formdata.append('event_images', image.originFileObj);
    });

    // Validate required fields
    if (!values.organized_by) {
      notification.error({ message: 'Validation Error', description: 'Organizer is required.' });
      return;
    }
    if (!values.event_capacity) {
      notification.error({ message: 'Validation Error', description: 'Event capacity is required.' });
      return;
    }
    if (!values.event_duration) {
      notification.error({ message: 'Validation Error', description: 'Event duration is required.' });
      return;
    }

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
              { value: 'conference', label: 'Conference' },
              { value: 'workshop', label: 'Workshop' },
              { value: 'seminar', label: 'Seminar' },
              { value: 'webinar', label: 'Webinar' },
              { value: 'meetup', label: 'Meetup' }
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
          label='Event Duration (hours)'
          name='event_duration'
          rules={[{ required: true, message: 'Please input the Event Duration!' }]}
        >
          <InputNumber min={0} placeholder='Event Duration' size='large' style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          className='w-full md:w-1/2'
          label='Event Capacity'
          name='event_capacity'
          rules={[{ required: true, message: 'Please input the Event Capacity!' }]}
        >
          <InputNumber min={0} placeholder='Event Capacity' size='large' style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <div className='two-grid-column'>
        <Form.Item
          className='w-full md:w-1/2'
          label='Allow Guests'
          name='allow_guests'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>

        <Form.Item
          className='w-full md:w-1/2'
          label='Provide Meals'
          name='provide_meals'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>
      </div>

      <Form.Item
        className='w-full'
        label='Featured Event'
        name='featured_event'
        valuePropName='checked'
      >
        <Switch />
      </Form.Item>

      <div className='two-grid-column'>
        <Form.Item
          className='w-full md:w-1/2'
          label='Event Description'
          name='event_description'
          rules={[{ required: true, message: 'Please input the Event Description!' }]}
        >
          <Input.TextArea placeholder='Type here Event Description' rows={4} />
        </Form.Item>

        <Form.Item
          className='w-full md:w-1/2'
          label='event theme'
          name='event_theme'
          rules={[{ required: true, message: 'Please input the event theme!' }]}
        >
          <Input placeholder='Organizer' size='large' allowClear />
        </Form.Item>
        <Form.Item
          className='w-full md:w-1/2'
          label='performing artists'
          name='performing_artists'
          rules={[{ required: true, message: 'Please input the performing artists!' }]}
        >
          <Input placeholder='Organizer' size='large' allowClear />
        </Form.Item>
        <div className='two-grid-column'>
  <Form.Item
    className='w-full md:w-1/2'
    label='Start Time'
    name={['event_timings', 'start_time']}
    rules={[{ required: true, message: 'Please input the Start Time!' }]}
  >
    <Input type='time' className='w-full' size='large' />
  </Form.Item>

  <Form.Item
    className='w-full md:w-1/2'
    label='End Time'
    name={['event_timings', 'end_time']}
    rules={[{ required: true, message: 'Please input the End Time!' }]}
  >
    <Input type='time' className='w-full' size='large' />
  </Form.Item>
</div>

        <Form.Item
          className='w-full md:w-1/2'
          label='Organizer'
          name='organized_by'
          rules={[{ required: true, message: 'Please input the Organizer!' }]}
        >
          <Input placeholder='Organizer' size='large' allowClear />
        </Form.Item>
      </div>

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
