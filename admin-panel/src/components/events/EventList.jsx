import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Avatar, Button, Empty, Modal, Pagination, Result, Skeleton, Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import { eventColorAsResponse, eventStatusAsResponse } from '../../utils/responseAsStatus'; // Ensure this import is correct
import QueryOptions from '../shared/QueryOptions';
import EventEdit from './EventEdit';

const { confirm } = Modal;

function EventsList({ add }) {
  const [query, setQuery] = useState({
    search: '', sort: 'asce', page: '1', rows: '10'
  });
  const [eventEditModal, setEventEditModal] = useState(
    { open: false, eventId: null }
  );
  const [fetchAgain, setFetchAgain] = useState(false);

  // fetch event-list API data
  const [loading, error, response] = useFetchData(`/api/event/list?keyword=${query.search}&limit=${query.rows}&page=${query.page}&sort=${query.sort}`, fetchAgain);

  // reset query options
  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  // function to handle delete
  const handleDeleteEvent = (id) => {
    confirm({
      title: 'DELETE EVENT',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure you want to delete this event permanently?',
      onOk() {
        return new Promise((resolve, reject) => {
          ApiService.delete(`/api/event/delete/${id}`)
            .then((res) => {
              if (res?.result_code === 0) {
                notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'Event delete successful');
                setFetchAgain(!fetchAgain);
                resolve();
              } else {
                notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
                reject();
              }
            })
            .catch((err) => {
              notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || err?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
              reject();
            });
        }).catch(() => notificationWithIcon('error', 'ERROR', 'Oops errors!'));
      }
    });
  };

  return (
    <div>
      {/* event list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} />

      {/* event list ― content section */}
      <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
        {error ? (
          <Result
            title='Failed to fetch'
            subTitle={error}
            status='error'
          />
        ) : (
          <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
            {response?.data?.rows?.length === 0 ? (
              <Empty
                className='mt-10'
                description={<span>Sorry! No data was found.</span>}
              />
            ) : (
              <div className='table-layout'>
                <div className='table-layout-container'>
                  <table className='data-table'>
                    {/* data table ― head */}
                    <thead className='data-table-head'>
                      <tr className='data-table-head-tr'>
                        <th className='data-table-head-tr-th' scope='col'>
                          Images
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Event Name
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Event Type
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Event Date
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Venue
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Actions
                        </th>
                      </tr>
                    </thead>

                    {/* data table ― body */}
                    <tbody>
                      {response?.data?.rows?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td'>
                            <Avatar.Group>
                              {data?.event_images?.map((image) => (
                                <Avatar
                                  key={uniqueId()}
                                  src={image.url}
                                  crossOrigin='anonymous'
                                  size='large'
                                />
                              ))}
                            </Avatar.Group>
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.event_name}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='text-center uppercase'
                              color={eventColorAsResponse(data?.event_type)}
                            >
                              {data?.event_type}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td'>
                            {new Date(data?.event_date).toLocaleDateString()}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.venue}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[80px] text-center uppercase'
                              color={eventStatusAsResponse(data?.event_status).color}
                            >
                              {eventStatusAsResponse(data?.event_status).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td !px-0 text-center'>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => add(data?.id)}
                              type='link'
                            >
                              View
                            </Button>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => setEventEditModal(
                                (prevState) => ({ ...prevState, open: true, eventId: data?.id })
                              )}
                              type='link'
                            >
                              Edit
                            </Button>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => handleDeleteEvent(data?.id)}
                              type='link'
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Skeleton>
        )}
      </div>

      {/* event list ― pagination */}
      {response?.data?.total_page > 1 && (
        <Pagination
          className='my-5'
          onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))}
          total={response?.data?.total_page * 10}
          current={response?.data?.current_page}
        />
      )}

      {/* event edit modal component */}
      {eventEditModal.open && (
        <EventEdit
          eventEditModal={eventEditModal}
          setEventEditModal={setEventEditModal}
        />
      )}
    </div>
  );
}

export default React.memo(EventsList);
