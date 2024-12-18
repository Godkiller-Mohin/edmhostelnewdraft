import {
  Descriptions, Image, List, Result, Skeleton, Tag, Typography,
} from 'antd';
import React from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import { eventStatusAsResponse, eventTypeAsColor } from '../../utils/responseAsStatus';

function EventDetails({ id }) {
  // Fetch event details API data
  const [loading, error, response] = useFetchData(`/api/event/${id}`);

  return (
    <Skeleton loading={loading} paragraph={{ rows: 10 }} active avatar>
      {error ? (
        <Result
          title="Failed to fetch"
          subTitle={error}
          status="error"
        />
      ) : (
        <Descriptions
          title="Event Information"
          bordered
        >
          {/* Event Images */}
          <Descriptions.Item label="Images" span={3}>
            <Image.PreviewGroup>
              {response?.data?.event_images?.map((image) => (
                <Image
                  key={uniqueId()}
                  className="p-2"
                  src={image?.url}
                  crossOrigin="anonymous"
                  alt="event-image"
                  width={120}
                  height={100}
                />
              ))}
            </Image.PreviewGroup>
          </Descriptions.Item>

          {/* Event Name and Slug */}
          <Descriptions.Item label={<span className="whitespace-nowrap">Event Name</span>}>
            {response?.data?.event_name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Event Slug</span>}
            span={2}
          >
            {response?.data?.event_slug}
          </Descriptions.Item>

          {/* Event Type */}
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Event Type</span>}
          >
            <Tag
              className="text-center uppercase"
              color={eventTypeAsColor(response?.data?.event_type)}
            >
              {response?.data?.event_type}
            </Tag>
          </Descriptions.Item>

          {/* Event Date and Location */}
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Event Date</span>}
            span={2}
          >
            {response?.data?.event_date}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Event Location</span>}
          >
            {response?.data?.event_location || 'N/A'}
          </Descriptions.Item>

          {/* Event Capacity */}
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Event Capacity</span>}
            span={2}
          >
            {`${response?.data?.event_capacity || 0} People`}
          </Descriptions.Item>

          {/* Event Flags */}
          <Descriptions.Item label={<span className="whitespace-nowrap">Virtual Event</span>}>
            <Tag
              className="w-[60px] text-center uppercase"
              color={response?.data?.is_virtual ? 'success' : 'error'}
            >
              {response?.data?.is_virtual ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Featured Event</span>}
            span={2}
          >
            <Tag
              className="w-[60px] text-center uppercase"
              color={response?.data?.is_featured ? 'success' : 'error'}
            >
              {response?.data?.is_featured ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>

          {/* Event Status */}
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Event Status</span>}
            span={2}
          >
            <Tag
              className="w-[80px] text-center uppercase"
              color={eventStatusAsResponse(response?.data?.event_status)?.color}
            >
              {eventStatusAsResponse(response?.data?.event_status)?.level}
            </Tag>
          </Descriptions.Item>

          {/* Event Timestamps */}
          <Descriptions.Item label={<span className="whitespace-nowrap">Last Updated At</span>}>
            {response?.data?.updated_at?.split('T')[0] || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Created At</span>}
            span={2}
          >
            {response?.data?.created_at?.split('T')[0] || 'N/A'}
          </Descriptions.Item>

          {/* Event Description */}
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Event Description</span>}
            span={3}
          >
            {response?.data?.event_description || 'No Description Available'}
          </Descriptions.Item>

          {/* Extra Facilities */}
          <Descriptions.Item
            label={<span className="whitespace-nowrap">Extra Facilities</span>}
            span={3}
          >
            <List
              bordered
              dataSource={response?.data?.extra_facilities || []}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>{item}</Typography.Text>
                </List.Item>
              )}
            />
          </Descriptions.Item>
        </Descriptions>
      )}
    </Skeleton>
  );
}

export default React.memo(EventDetails);
