import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Avatar, Button, Empty, Modal, Pagination, Result, Skeleton, Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import { getSessionUser } from '../../utils/authentication';
import notificationWithIcon from '../../utils/notification';
import { userStatusAsResponse } from '../../utils/responseAsStatus';
import QueryOptions from '../shared/QueryOptions';

const { confirm } = Modal;

function UsersList({ add }) {
  const user = getSessionUser();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [query, setQuery] = useState({
    search: '', sort: 'asce', page: '1', rows: '10'
  });

  // Ensure token is retrieved properly from localStorage
  const token = 'ajerngnrtg'; // Replace with a valid token for testing

  useEffect(() => {
    if (!token) {
      console.error('Authorization token is missing from localStorage');
    } else {
      console.log('Authorization token retrieved successfully:', token);
    }
  }, [token]);

  // Fetch user-list API data with token in headers
  const [loading, error, response] = useFetchData(
    `/api/user/all-users-list?keyword=${query.search}&limit=${query.rows}&page=${query.page}&sort=${query.sort}`,
    {
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined // Ensure the token is passed only if it exists
      }
    },
    fetchAgain
  );

  // Debugging: Log headers to check if they are set correctly
  useEffect(() => {
    console.log('Headers:', {
      'Authorization': token ? `Bearer ${token}` : 'No Token Provided'
    });
  }, [token]);

  // Reset query options on change
  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  // Function to handle delete user
  const handleDeleteUser = (id) => {
    confirm({
      title: 'DELETE USER',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure you want to delete this user permanently?',
      onOk() {
        return new Promise((resolve, reject) => {
          ApiService.delete(`/api/user/delete-user/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then((res) => {
              if (res?.result_code === 0) {
                notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'User deleted successfully');
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
        }).catch(() => notificationWithIcon('error', 'ERROR', 'Oops! There were errors.'));
      }
    });
  };
  return (
    <div>
      {/* user list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} />

      {/* user list ― content section */}
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
                description={(<span>Sorry! Any data was not found.</span>)}
              />
            ) : (
              <div className='table-layout'>
                <div className='table-layout-container'>
                  <table className='data-table'>
                    {/* data table ― head */}
                    <thead className='data-table-head'>
                      <tr className='data-table-head-tr'>
                        <th className='data-table-head-tr-th' scope='col'>
                          Avatar
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Full Name
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Username
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Email
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Phone
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Role
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Verified
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          User Actions
                        </th>
                      </tr>
                    </thead>

                    {/* data table ― body */}
                    <tbody>
                      {response?.data?.rows?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td text-center'>
                            <Avatar src={data?.avatar} crossOrigin='anonymous' />
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.fullName}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.userName}
                          </td>
                          <td className='data-table-body-tr-td !lowercase'>
                            {data?.email}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.phone}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[60px] text-center uppercase'
                              color={data?.role === 'admin' ? 'magenta' : 'purple'}
                            >
                              {data?.role}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[70px] text-center uppercase'
                              color={userStatusAsResponse(data?.status).color}
                            >
                              {userStatusAsResponse(data?.status).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[50px] text-center uppercase'
                              color={data?.verified ? 'success' : 'error'}
                            >
                              {data?.verified ? 'Yes' : 'No'}
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

                            {user?.id !== data?.id && (
                              <Button
                                className='inline-flex items-center !px-2'
                                onClick={() => handleDeleteUser(data?.id)}
                                type='link'
                              >
                                Delete
                              </Button>
                            )}
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

      {/* user list ― pagination */}
      {response?.data?.total_page > 1 && (
        <Pagination
          className='my-5'
          onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))}
          total={response?.data?.total_page * 10}
          current={response?.data?.current_page}
        />
      )}
    </div>
  );
}

export default React.memo(UsersList);
