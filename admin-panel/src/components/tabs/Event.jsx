import { AppstoreAddOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import CreateEvent from '../events/Createevent';
import EventDetails from '../events/EventDetails';
import EventsList from '../events/EventList';

function Events() {
  // function to create new tab pane for event details
  const add = (id) => {
    const newActiveKey = `NewTab1${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        key: newActiveKey,
        label: 'Event Details',
        children: <EventDetails id={id} />
      }
    ]);
    setActiveKey(newActiveKey);
  };

  // function to create new tab pane to create a new event
  const add2 = () => {
    const newActiveKey = `NewTab2${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        key: newActiveKey,
        label: 'Create Event',
        children: <CreateEvent />
      }
    ]);
    setActiveKey(newActiveKey);
  };

  // default tab pane and component
  const defaultPanes = new Array(1).fill(null).map((_, index) => ({
    key: String(index + 1),
    label: 'Events List',
    children: <EventsList add={add} />,
    closable: false
  }));

  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(0);

  // function to remove a tab pane
  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    setItems(newPanes);
  };

  // function to edit tab components
  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      onChange={(key) => setActiveKey(key)}
      tabBarExtraContent={(
        <Button
          className='inline-flex items-center'
          icon={<AppstoreAddOutlined />}
          onClick={add2}
          type='primary'
          size='large'
        >
          Create Event
        </Button>
      )}
      activeKey={activeKey}
      type='editable-card'
      onEdit={onEdit}
      items={items}
      size='large'
      hideAdd
    />
  );
}

export default React.memo(Events);
