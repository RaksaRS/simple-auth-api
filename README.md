# Overview

This is a simple authentication API using ExpressJS. Currently, it only provides an access token when a user signs in.

# Usage

The API provides 3 routes:

- `POST /user/signin`: Parses the `email` and `password` in the request body. If credentials are correct, an access token cookie is set.
- `POST /user/signup`: Parses the `username`, `email`, and `password` fields of the request body. If the email already exists, status code `BAD REQUEST` is sent. Otherwise, `INTERNAL SERVER ERROR` is sent if another kind of error occured or `CREATED` if the signup was successful.
- `GET /dashboard`: Simulates a dashboard. An access token cookie is expected in HTTP request. If the token isn't valid, a response with `UNAUTHORIZED` status code is sent.
