# Military Family Volunteer System 

This is a mono repo containing the the back end API and front end application for the Military Family Volunteer System.

---

## Technology used

### Backend (server)

- [NodeJS](https://nodejs.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server) (GraphQL Server)
- Located in `src` directory.

### Database

- [MongoDB](https://www.mongodb.com/)
- [Atlas](https://www.mongodb.com/cloud/atlas) (Cloud-hosted MongoDB)
- [Mongoose ORM](https://mongoosejs.com/)
- **Note:** Make sure to create collections in database before executing queries. Some of the database operations run in transactions and require the associated collections to already exist before transaction can complete.

### Frontend (client)

- [ReactJS](https://reactjs.org)
- [Apollo Client](https://www.apollographql.com/docs/react) (GraphQL client library)
- Located in `client` directory.

### Deployment

- [Heroku](https://heroku.com)

### Required services

- [Redis](https://redis.io/)
  - Recommended to [setup with Heroku hosting](https://elements.heroku.com/addons/heroku-redis).
  - Used for caching session tokens, email verification tokens, etc.
- [ArcGIS API](https://developers.arcgis.com/documentation/core-concepts/rest-api/)
  - Used for geospatial searches.
  - Can be used to calculating drive times and other geospatial-related queries.
  - Much more affordable than [Google Places API](https://developers.google.com/places/web-service/intro). _However, Google's API may provide better results for the application's use case if funding is available._

---

#### ✅ ToDo's

⚠️= Critical for launch 🚀,
❗= Important Feature (for best user experience),
✨= Feature (not as important, but beneficial)

- **⚠️ Admin area:** Enable admins to...
  - Manage users: approve, activate, and deactivate.
  - Create needs for users.
  - Create matches between recipients and volunteers.
- **⚠️ Authorization:** Make sure users (admin/volunteer/recipient) can only access data they should be able to. 
- **⚠️ Email notifications:** Implement [nodemailer](https://nodemailer.com/about/) with email service for email verification and other application notifications.
- **❗Messaging system:** An in-app messaging system for volunteers and recipients to communicate safely without exposing user contact information.
- **❗GraphQL subscriptions:** Enable real-time in-app notifications through implementation of GraphQL subscriptions and websockets.
- **Improved search functionality:**
  - Service details.
  - Specified location/drive time.
  - Availability date/time.
  - Etc...
  
---

### Future Plans

- Enable deployment of frontend application to separate host, such as [Netlify](https://netlify.com). Netlify deploys an application to a CDN and provides performance benefits through pre-rendering and caching services.
- Considering that most users will need to be in direct real-time contact with other users, it will be good to build a mobile application to interact with the backend API. The application has be designed with a decoupled architecture in order to easily enable adding frontend clients, such as mobile applications, in the future. Currently, ideal candidates for cross-platform (Android + iOS) applications include [React Native](http://www.reactnative.com/), [Ionic](https://ionicframework.com/), and [Flutter](https://flutter.dev).
