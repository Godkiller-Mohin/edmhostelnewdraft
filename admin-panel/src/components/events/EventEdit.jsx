import { PlusOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Form, Input, InputNumber, Modal, Result, Select, Upload
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import EF from '../../assets/data/extra-facilities.json';
import useFetchData from '../../hooks/useFetchData';
import { reFetchData } from '../../store/slice/appSlice';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import PageLoader from '../shared/PageLoader';

function EventEdit({ eventEditModal, setEventEditModal }) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Fetch event-details API data
  const [fetchLoading, fetchError, fetchResponse] = useFetchData(
    `/api/event/${eventEditModal.eventId}`
  );

  // Set form data from API data
  useEffect(() => {
    if (fetchResponse) {
      form.setFieldsValue({
        event_name: fetchResponse?.data?.event_name || undefined,
        event_slug: fetchResponse?.data?.event_slug || undefined,
        event_type: fetchResponse?.data?.event_type || undefined,
        event_price: fetchResponse?.data?.event_price || undefined,
        event_size: fetchResponse?.data?.event_size || undefined,
        event_capacity: fetchResponse?.data?.event_capacity || undefined,
        allow_food: fetchResponse?.data?.allow_food || false,
        provide_transport: fetchResponse?.data?.provide_transport || false,
        featured_event: fetchResponse?.data?.featured_event || false,
        event_description: fetchResponse?.data?.event_description || undefined,
        extra_facilities: fetchResponse?.data?.extra_facilities || undefined,
        event_images: fetchResponse?.data?.event_images || undefined
      });
    }
  }, [fetchResponse, form]);

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('event_name', values.event_name);
    formData.append('event_slug', values.event_slug);
    formData.append('event_type', values.event_type);
    formData.append('event_price', values.event_price);
    formData.append('event_size', values.event_size);
    formData.append('event_capacity', values.event_capacity);
    formData.append('allow_food', values?.allow_food || false);
    formData.append('provide_transport', values?.provide_transport || false);
    formData.append('featured_event', values?.featured_event || false);
    formData.append('event_description', values.event_description);

    values.extra_facilities.forEach((facility) => {
      formData.append('extra_facilities', facility);
    });
    values.event_images.forEach((image) => {
      formData.append('event_images', image.originFileObj);
    });

    setLoading(true);
    ApiService.put(`/api/edit/${eventEditModal.eventId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        setLoading(false);
        if (response?.result_code === 0) {
          notificationWithIcon('success', 'SUCCESS', response?.result?.message || 'Event updated successfully');
          form.resetFields();
          dispatch(reFetchData());
          setEventEditModal((prevState) => ({ ...prevState, open: false }));
        } else {
          notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. Server error.');
        }
      })
      .catch((err) => {
        setLoading(false);
        notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || err?.response?.data?.result?.error || 'Sorry! Something went wrong. Server error.');
      });
  };

  return (
    <Modal
      title='Edit Event Information'
      open={eventEditModal.open}
      onOk={() => setEventEditModal((prevState) => ({ ...prevState, open: false }))}
      onCancel={() => setEventEditModal((prevState) => ({ ...prevState, open: false }))}
      footer={[]}
      width={1200}
      centered
    >
      {fetchLoading ? (<PageLoader />) : fetchError ? (
        <Result
          title='Failed to fetch'
          subTitle={fetchError}
          status='error'
        />
      ) : (
        <Form
          form={form}
          name='event-edit-form'
          onFinish={onFinish}
          layout='vertical'
        >
          <div className='two-grid-column'>
            <Form.Item
              className='w-full md:w-1/2'
              label='Event Name'
              name='event_name'
              rules={[{ required: true, message: 'Please input your Event Name!' }]}
            >
              <Input placeholder='Event Name' size='large' allowClear />
            </Form.Item>

            <Form.Item
              className='w-full md:w-1/2'
              label='Event Slug'
              name='event_slug'
              rules={[{ required: true, message: 'Please input your Event Slug!' }]}
            >
              <Input placeholder='Event Slug' size='large' allowClear />
            </Form.Item>
          </div>

          <div className='two-grid-column'>
            <Form.Item
              className='w-full md:w-1/2'
              label='Event Type'
              name='event_type'
              rules={[{ required: true, message: 'Please input your Event Type!' }]}
            >
              <Select
                placeholder='-- select event type --'
                options={[
                  { value: 'concert', label: 'Concert' },
                  { value: 'conference', label: 'Conference' },
                  { value: 'webinar', label: 'Webinar' }
                ]}
                size='large'
                allowClear
              />
            </Form.Item>

            <Form.Item
              className='w-full md:w-1/2'
              label='Event Price'
              name='event_price'
              rules={[{ required: true, message: 'Please input your Event Price!' }]}
            >
              <InputNumber className='w-full' placeholder='Event Price' size='large' min={1} max={100000} />
            </Form.Item>
          </div>

          <Form.Item
            label='Event Description'
            name='event_description'
            rules={[{ required: true, message: 'Please input your Event Description!' }]}
          >
            <Input.TextArea placeholder='Type here Event Description' rows={4} />
          </Form.Item>

          <Form.Item
            label='Extra Facilities'
            name='extra_facilities'
            rules={[{ required: true, message: 'Please input your Extra Facilities!' }]}
          >
            <Select
              placeholder='-- select event extra facilities --'
              options={EF}
              mode='multiple'
              size='large'
              allowClear
            />
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
              maxCount={5}
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className='flex flex-col items-start justify-start gap-y-2'>
            <Form.Item name='allow_food' valuePropName='checked' noStyle>
              <Checkbox>Allow Food?</Checkbox>
            </Form.Item>
            <Form.Item name='provide_transport' valuePropName='checked' noStyle>
              <Checkbox>Provide Transport?</Checkbox>
            </Form.Item>
            <Form.Item name='featured_event' valuePropName='checked' noStyle>
              <Checkbox>Featured Event?</Checkbox>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              className='login-form-button mt-4'
              htmlType='submit'
              type='primary'
              size='large'
              loading={loading}
              disabled={loading}
            >
              Update Event Info
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default React.memo(EventEdit);
