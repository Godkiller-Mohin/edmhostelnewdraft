import { Descriptions, Image, List, Result, Skeleton, Tag, Typography } from 'antd';
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
        <Result title="Failed to fetch" subTitle={error} status="error" />
      ) : (
        <Descriptions title="Event Information" bordered>
          {/* Event Images */}
          <Descriptions.Item label="Images" span={3}>
            <Image.PreviewGroup>
              {response?.data?.event_images?.map((image) => (
                <Image
                  key={uniqueId()}
                  className="p-2"
                  src={image?.url}
                  crossOrigin="anonymous"
                  alt="Event"
                  width={120}
                  height={100}
                />
              ))}
            </Image.PreviewGroup>
          </Descriptions.Item>

          {/* Event Details */}
          <Descriptions.Item label="Event Name">{response?.data?.event_name}</Descriptions.Item>
          <Descriptions.Item label="Event Slug" span={2}>
            {response?.data?.event_slug}
          </Descriptions.Item>
          <Descriptions.Item label="Event Type">
            <Tag
              className="text-center uppercase"
              color={eventTypeAsColor(response?.data?.event_type) || 'purple'}
            >
              {response?.data?.event_type}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Event Date" span={2}>
            {response?.data?.event_date}
          </Descriptions.Item>
          <Descriptions.Item label="Event Location">
            {response?.data?.event_location || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Event Capacity" span={2}>
            {`${response?.data?.event_capacity || 0} People`}
          </Descriptions.Item>

          {/* Flags */}
          <Descriptions.Item label="Virtual Event">
            <Tag
              className="w-[60px] text-center uppercase"
              color={response?.data?.is_virtual ? 'success' : 'error'}
            >
              {response?.data?.is_virtual ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Featured Event" span={2}>
            <Tag
              className="w-[60px] text-center uppercase"
              color={response?.data?.is_featured ? 'success' : 'error'}
            >
              {response?.data?.is_featured ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Event Status" span={2}>
            <Tag
              className="w-[80px] text-center uppercase"
              color={eventStatusAsResponse(response?.data?.event_status)?.color || 'default'}
            >
              {eventStatusAsResponse(response?.data?.event_status)?.level || 'Unknown'}
            </Tag>
          </Descriptions.Item>

          {/* Timestamps */}
          <Descriptions.Item label="Last Updated At">
            {response?.data?.updated_at?.split('T')[0] || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Created At" span={2}>
            {response?.data?.created_at?.split('T')[0] || 'N/A'}
          </Descriptions.Item>

          {/* Description */}
          <Descriptions.Item label="Event Description" span={3}>
            {response?.data?.event_description || 'No Description Available'}
          </Descriptions.Item>

          {/* Extra Facilities */}
          <Descriptions.Item label="Extra Facilities" span={3}>
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
