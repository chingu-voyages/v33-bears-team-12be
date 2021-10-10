#

# Bears Team 12 Server

This is the server for the Bears Team 12 App.
This is an app (similar to Linktree) where you can create a profile with a list of links. Your profile can be shared to allow others to see your list of links in one place.

#

## LINKS

- [Frontend Repo](https://github.com/chingu-voyages/v33-bears-team-12)
- [Live Server](https://chingu-v33-b12-be.herokuapp.com/)
- [Live App](https://pensive-minsky-33f65a.netlify.app/)

#

## SKILLS USED

- Node.js
- Express
- Dotenv
- @hapi/joi
- cors
- JWT
- mongoose

#

## API

### Users

The `users` model takes the form of the following schema:

```json
{
  username: {
    type: String,
    required: true,
    min: 6,
    max: 30,
  },
  name: {
    type: String,
    required: true,
    max: 255,
    min: 3,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    select: false,
    required: true,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}
```

### Links

The `links` model takes the form of the following schema:

```json
{
  title: {
    type: String,
    required: true,
  },
  hyperlink: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}
```

### Routes

The API allows for the following routes:

| Method | Route                      | Description            |
| ------ | -------------------------- | ---------------------- |
| `POST` | `/user/register`           | Register a new user    |
| `POST` | `/user/login`              | Login an existing user |
| `POST` | `/user/refresh`            | Refresh auth tokens    |
| `POST` | `/user/logout`             | Logout a user          |
| `GET`  | `/user/username/:username` | Get user by username   |
| `GET`  | `/links`                   | Get all links          |
| `POST` | `/links`                   | Post New Link to user  |

#

#### Details:

`POST` to `/user/register`

Register a new user

example body:

```json
{
  "name": "Bob",
  "username": "bobby007",
  "email": "bobby007@email.com",
  "password": "password1234", // passwords are hashed before being stored
  "repeat_password": "password1234"
}
```

#

`POST` to `/user/login`

Login an existing user

example body:

```json
{
  "email": "bobby007@email.com",
  "password": "password1234"
}
```

#

`POST` to `/user/refresh`

Refresh auth tokens

example body:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // refreshToken
}
```

#

#

`POST` to `/user/logout`

Logout a user

include Header Key `auth-token` with value `Bearer ${authToken}`

example body:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // refreshToken
}
```

#

`POST` to `links`

Post New Link to user

include Header key: `auth-token` with value: `Bearer ${authToken}`

example body:

```json
{
  "title": "Linkedin",
  "hyperlink": "http://www.linkedin.com/bobby007"
}
```

#

## FUTURE FEATURES

- Hyperlink validation
- Ability to update and delete links
- Ability to update and delete some users columns

#

## HOW TO INSTALL

- Fork and Clone this repo.
- Run: `cp ./sample.env ./env`
- Update the `.env` file with the connction to a development Mongo DB.
- Update the `.env` file with secret keys for JWT access tokens
- Run:

```
npm install
npm start
```

- See [Frontend Repo](https://github.com/chingu-voyages/v33-bears-team-12)
  for app instructions.
