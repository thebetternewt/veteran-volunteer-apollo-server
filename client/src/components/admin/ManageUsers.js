import React from 'react'
import { USERS_QUERY } from '../../apollo/queries'
import graphQlErrors from '../../util/graphqlErrors'
import { Query, Mutation } from 'react-apollo'
import { Table, Tag, Checkbox, Button } from 'antd'
import { ACTIVATE_USER, DEACTIVATE_USER } from '../../apollo/mutations'

const columns = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'fullName',
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
  },
  {
    title: 'Active Status',
    key: 'status',
    dataIndex: 'active',
    render: active => {
      let color = 'green'
      if (!active) {
        color = 'volcano'
      }
      return <Tag color={color}>{active ? 'Active' : 'Inactive'}</Tag>
    },
  },
  {
    title: 'Volunteer',
    key: 'volunteer',
    dataIndex: 'volunteerProfile',
    render: profile => <Checkbox checked={!!profile} />,
  },
  {
    title: 'Recipient',
    key: 'recipient',
    dataIndex: 'recipientProfile',
    render: profile => <Checkbox checked={!!profile} />,
  },
  {
    title: 'Admin',
    key: 'admin',
    dataIndex: 'admin',
    render: admin => <Checkbox checked={admin} />,
  },
  {
    title: 'Action',
    dataIndex: 'active',
    key: 'toggleActivation',
    render: (active, user) => (
      <>
        {active ? (
          <Mutation mutation={DEACTIVATE_USER}>
            {(deactivateUser, { loading }) => (
              <Button
                onClick={() =>
                  deactivateUser({
                    variables: { userId: user.id },
                    refetchQueries: ['Users'],
                  })
                }
                loading={loading}
                type="danger"
                ghost
              >
                Deactivate
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={ACTIVATE_USER}>
            {(activateUser, { loading }) => (
              <Button
                onClick={() =>
                  activateUser({
                    variables: { userId: user.id },
                    refetchQueries: ['Users'],
                  })
                }
                loading={loading}
                type="primary"
              >
                Activate
              </Button>
            )}
          </Mutation>
        )}
      </>
    ),
  },
]

const ManageUsers = () => {
  return (
    <Query query={USERS_QUERY} fetchPolicy="no-cache">
      {({ data, loading, error }) => {
        let datasource = []

        if (error) {
          return graphQlErrors(error)
        }

        if (data && data.users) {
          console.log(data)

          datasource = data.users.map(user => ({
            key: user.id,
            ...user,
          }))
        }

        return (
          <Table
            columns={columns}
            dataSource={datasource}
            loading={loading}
            title={() => <h2>Manage Users</h2>}
            pagination={{ pageSize: 5 }}
          />
        )
      }}
    </Query>
  )
}

export default ManageUsers
