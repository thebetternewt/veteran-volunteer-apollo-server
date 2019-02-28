import React, { Component } from 'react'

export default class VolunteerProfileForm extends Component {
  render() {
    return (
      <div>
        <h3>Volunteer Profile </h3> <br />
        <h1>Volunteer Name Here</h1>
        <form>
          <h3>Preferred Contact Settings</h3> <br />
          <input type="checkbox" name="contactOption1" value="both" /> Use all
          available
          <br />
          <hr />
          <input type="checkbox" name="contactOption2" value="phone" />
          Phone
          <input type="checkbox" name="contactOption3" value="email" />
          Email
          <br />
          <input type="submit" />
        </form>
        {/* TODO:
        
        Build out form
        
        preferred contact info
        
        l*/}
      </div>
    )
  }
}
//
