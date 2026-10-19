# Part 10: React Native

This Expo application implements the Full Stack Open React Native exercises 10.1–10.25:

| Chapter | Exercises | Implemented work |
| --- | --- | --- |
| Introduction to React Native | 10.1–10.2 | Expo setup and ESLint |
| React Native basics | 10.3–10.8 | Repository list, scrollable app bar, avatar and statistics, sign-in form, validation, platform fonts |
| Communicating with server | 10.9–10.14 | GraphQL repository data, configurable endpoint, authentication, persisted tokens, sign out |
| Testing and extending the app | 10.15–10.25 | Component tests, repository details and reviews, sign-up and review forms, sorting, search, pagination, user's reviews, deletion |

## Start the app

Install the dependencies and start Expo:

```sh
npm install
npm start
```

Create a local `.env` file based on `.env.example` and set
`EXPO_PUBLIC_APOLLO_URI` to the GraphQL endpoint. The default is
`http://localhost:5000/graphql`. For an Android emulator use
`http://10.0.2.2:5000/graphql`; for a physical phone use the development
machine's LAN address.

The GraphQL API is the course's
[rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api).
Start it locally and seed its database before using repository browsing and
authentication. Its README describes the required database, environment
variables, setup, and sample users.

## Checks

```sh
npm run lint
npm run typecheck
npm test
```
