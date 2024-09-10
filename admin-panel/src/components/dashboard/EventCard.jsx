import { Card, Statistic } from 'antd';
import React from 'react';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

const formatter = (value) => <CountUp end={value} separator=',' />;
const gridStyle = { width: '50%', textAlign: 'center' };

function EventCard({ loading, data }) {
  const navigate = useNavigate();

  return (
    <Card
      className='w-full cursor-pointer md:w-[49.5%]'
      onClick={() => navigate('/main/events')}
      title='Events Information:'
      loading={loading}
    >
      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Total Events'
          formatter={formatter}
          value={data?.total_events || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Upcoming Events'
          formatter={formatter}
          value={data?.upcoming_events || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Completed Events'
          formatter={formatter}
          value={data?.completed_events || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Cancelled Events'
          formatter={formatter}
          value={data?.cancelled_events || 0}
        />
      </Card.Grid>
    </Card>
  );
}

export default EventCard;
