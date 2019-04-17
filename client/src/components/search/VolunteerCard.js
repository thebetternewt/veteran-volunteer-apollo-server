import { Avatar, Button, Card, Icon, Tag } from 'antd'
import React from 'react'
import styled from 'styled-components'

const { Meta } = Card

const StyledVolunteerCard = styled(Card)`
  width: 400px;
  max-width: 100%;
  margin: 0 1rem 1rem 0;

  .profile-details {
    text-transform: capitalize;
    word-wrap: none;
    margin: 1rem 0;

    ul {
      padding: 0;
      list-style: none;
    }
  }

  @media screen and (max-width: 756px) {
    width: 380px;
    margin-right: 0;
  }
`

const VolunteerCard = ({ profile, createRequest, loading, error }) => (
  <StyledVolunteerCard
    key={profile.id}
    /* style={{
      maxWidth: 400,
      marginBottom: 20,
    }} */
    actions={[
      <Button type="primary" ghost>{`Message ${
        profile.user.firstName
      }`}</Button>,
      <Button
        type="primary"
        loading={loading}
        onClick={() => createRequest(profile.user.id)}
      >{`Book ${profile.user.firstName}`}</Button>,
    ]}
  >
    <Meta
      avatar={
        <Avatar
          icon="avatar"
          size={64}
          src={profile.user.avatar || 'http://i.pravatar.cc/300'}
        />
      }
      title={profile.user.fullName}
      description={
        <div style={{ marginBottom: '1rem' }}>
          <div className="services-provided">
            {profile.servicesProvided.map(service => (
              <Tag key={service} color="geekblue">
                {service}
              </Tag>
            ))}
          </div>
        </div>
      }
    />
    <div className="profile-details">
      <p>{profile.bio || 'Lorem ipsum dolor sit amet'}</p>
      <h4>Availability</h4>
      <ul>
        <li
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {profile.availability.weekdays && (
            <>
              <Icon
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
              />
              <span> Weekdays </span>
            </>
          )}
        </li>
        <li>
          {profile.availability.weekends && (
            <>
              <Icon
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
              />
              <span> Weekends </span>
            </>
          )}
        </li>
      </ul>
    </div>
    {/* <Link to={`/volunteer-search/${profile.id}`}>
        <Button type="primary">
          {`Request to book ${profile.user.firstName}`}
        </Button>
      </Link> */}
  </StyledVolunteerCard>
)

export default VolunteerCard
