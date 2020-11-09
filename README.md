# bucket

[![pipeline status](https://gitlab.com/simonbreiter/bucket/badges/master/pipeline.svg)](https://gitlab.com/simonbreiter/bucket/commits/master)
[![coverage report](https://gitlab.com/simonbreiter/bucket/badges/master/coverage.svg)](https://gitlab.com/simonbreiter/bucket/commits/master)

Bucket is an API for your content. It lets you store your data in "buckets" and query them with GraphQL.

## Development

Run `npm install` and create a `.env` file with at least this content:

| Name         | Values           | Default          |
| ------------ | ---------------- | ---------------- |
| ENV          | `dev` or `prod`  | `dev`            |
| MONGODB_HOST | `bucket-mongodb` | `bucket-mongodb` |
| API_PORT     | 3000             | 3000             |
| JWT_SECRET   | `secret`         | `secret`         |

after that you can start the development environment with:

```bash
npm run docker:dev:up
```

## Usage

To run bucket in production with docker run:

```bash
npm run docker:prod:up
```
