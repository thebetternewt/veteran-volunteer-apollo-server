import { Avatar, Button, Card, Divider, Icon, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'

const { Meta } = Card

const ServiceSectionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  h2 {
    margin-right: 1rem;
  }
`

const ServiceCard = styled(Card)`
  width: 400px;
  max-width: 100%;
  margin: 0 1rem 1rem 0;

  @media screen and (max-width: 756px) {
    width: 380px;
    margin-right: 0;
  }
`

const UserServices = () => {
  return (
    <>
      <h3 style={{ color: '#777' }}>My Services</h3>
      <div>
        <ServiceSectionHeader>
          <h2>Requested</h2>
          <Button type="primary" icon="plus-circle">
            Request New Service
          </Button>
        </ServiceSectionHeader>
        <Row type="flex">
          <ServiceCard
            style={{ maxWidth: 400, marginBottom: 20 }}
            actions={[<Icon type="info-circle" />, <Icon type="message" />]}
          >
            <Meta
              avatar={
                <Avatar
                  size={64}
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Wayfarers&hairColor=Platinum&facialHairType=Blank&clotheType=Overall&clotheColor=PastelBlue&eyeType=Cry&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Yellow"
                />
              }
              title="Travel to Columbus"
              description={
                <div style={{ marginBottom: '1rem' }}>
                  <div>Type: Travel</div>
                  <div>When: Friday, February 23rd</div>
                </div>
              }
            />
            <div>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </ServiceCard>

          <ServiceCard
            style={{ maxWidth: 400, marginBottom: 20 }}
            actions={[<Icon type="info-circle" />, <Icon type="message" />]}
          >
            <Meta
              avatar={
                <Avatar
                  size={64}
                  src="https://avataaars.io/?avatarStyle=Circle&topType=NoHair&accessoriesType=Round&facialHairType=MoustacheMagnum&facialHairColor=Blonde&clotheType=CollarSweater&clotheColor=Gray02&eyeType=Happy&eyebrowType=SadConcerned&mouthType=Smile&skinColor=Tanned"
                />
              }
              title="Lawncare needed"
              description={
                <div style={{ marginBottom: '1rem' }}>
                  <div>Type: Lawncare</div>
                  <div>When: Saturday, February 24th</div>
                </div>
              }
            />
            <div>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </ServiceCard>

          <ServiceCard
            style={{ maxWidth: 400, marginBottom: 20 }}
            actions={[<Icon type="info-circle" />, <Icon type="message" />]}
          >
            <Meta
              avatar={
                <Avatar
                  size={64}
                  src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairDreads01&accessoriesType=Prescription01&hairColor=PastelPink&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=ShirtCrewNeck&clotheColor=Gray01&eyeType=Happy&eyebrowType=UnibrowNatural&mouthType=Twinkle&skinColor=Pale"
                />
              }
              title="Childcare in Starkville"
              description={
                <div style={{ marginBottom: '1rem' }}>
                  <div>Type: Childcare</div>
                  <div>When: Saturday, February 24th</div>
                </div>
              }
            />
            <div>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </ServiceCard>
        </Row>
      </div>
      <Divider />
      <div>
        <ServiceSectionHeader>
          <h2>Volunteered</h2>
          <Button type="primary" icon="search">
            Browse Requested Services
          </Button>
        </ServiceSectionHeader>
        <Row type="flex">
          <ServiceCard
            style={{ maxWidth: 400, marginBottom: 20 }}
            actions={[<Icon type="info-circle" />, <Icon type="message" />]}
          >
            <Meta
              avatar={
                <Avatar
                  size={64}
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Prescription02&hairColor=Brown&facialHairType=Blank&clotheType=Overall&clotheColor=Pink&eyeType=Surprised&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Brown"
                />
              }
              title="Leaky faucet"
              description={
                <div style={{ marginBottom: '1rem' }}>
                  <div>Type: Home Repair</div>
                  <div>When: Thursday, March 1st</div>
                </div>
              }
            />
            <div>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </ServiceCard>
        </Row>
      </div>
    </>
  )
}

export default UserServices
