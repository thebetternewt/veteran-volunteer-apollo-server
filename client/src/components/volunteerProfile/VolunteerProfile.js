import { Avatar, Button, Divider, Icon, Tag } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import Map from '../common/map/Map'

const Identity = styled.div`
  display: flex;

  div {
    margin-left: 1rem;
  }

  @media screen and (max-width: 800px) {
    flex-direction: column;

    div {
      margin-left: 0;
    }
  }
`

const ServiceTagList = styled.ul`
  padding: 0;
`

const ContactSettings = styled.ul`
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    svg {
      font-size: 1.5rem;
      margin-right: 10px;
    }
  }
`

const VolunteerProfile = props => {
  const { profile, toggleForm } = props
  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://js.arcgis.com/4.10/esri/css/main.css"
        />
      </Helmet>
      <h3
        style={{
          color: '#777',
          marginBottom: '2rem',
        }}
      >
        Volunteer Profile
      </h3>
      <Identity>
        <Avatar
          size={64}
          icon="user"
          src={profile.avatar}
          style={{
            marginBottom: '1rem',
          }}
        />
        <div>
          <h2> {profile.name} </h2>
          <p>Services Provided</p>
          <ServiceTagList>
            {profile.servicesProvided.map(service => (
              <Tag key={service} color="geekblue">
                {service}
              </Tag>
            ))}
          </ServiceTagList>
        </div>
      </Identity>
      <Divider />
      <h3> Availability </h3>
      <ContactSettings>
        <li
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {profile.availability.weekdays ? (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          ) : (
            <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
          )}
          <span> Weekdays </span>
        </li>
        <li>
          {profile.availability.weekends ? (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          ) : (
            <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
          )}
          <span> Weekends </span>
        </li>

        {profile.availability.details && (
          <li>Details: {profile.availability.details}</li>
        )}
      </ContactSettings>
      <p>
        <strong> Service Location: </strong> <br />
        {/* latitude: {profile.serviceLocation.lat} <br />
        longitude: {profile.serviceLocation.lng} */}
        Currently serving needs within <strong>{profile.serviceRadius}</strong>{' '}
        miles of <strong>{profile.serviceLocation.address}</strong>.
      </p>
      <Map location={profile.serviceLocation} />
      <Button
        type="primary"
        onClick={toggleForm}
        style={{
          marginTop: '2rem',
        }}
      >
        Edit Volunteer Profile
      </Button>
    </div>
  )
}

export default VolunteerProfile
