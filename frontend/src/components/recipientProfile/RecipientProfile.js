import { Avatar, Button, Divider, Icon } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import Map from '../common/map/Map'

const Identity = styled.div`
  display: flex;

  h2 {
    margin-left: 1rem;
  }

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
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

const RecipientProfile = ({ profile, editProfile }) => {
  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://js.arcgis.com/4.10/esri/css/main.css"
        />
      </Helmet>
      <h3 style={{ color: '#777', marginBottom: '2rem' }}>Recipient Profile</h3>
      <Identity>
        <Avatar
          size={64}
          icon="user"
          src={profile.avatar}
          style={{ marginBottom: '1rem' }}
        />
        <h2>{profile.name}</h2>
      </Identity>
      <Divider />
      <h3>Contact Settings</h3>
      <ContactSettings>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          {profile.allowPhoneContact ? (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          ) : (
            <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
          )}
          <span>Allow phone contact</span>
        </li>
        <li>
          {profile.allowEmailContact ? (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          ) : (
            <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
          )}
          <span>Allow email contact</span>
        </li>
      </ContactSettings>
      <p>
        <strong>Location:</strong>
        <br />
        latitude: {profile.location.lat}
        <br />
        longitude: {profile.location.lng}
      </p>
      <Map location={profile.location} />

      <Button
        type="primary"
        onClick={editProfile}
        style={{ marginTop: '2rem' }}
      >
        Edit Recipient Profile
      </Button>
    </div>
  )
}

export default RecipientProfile
