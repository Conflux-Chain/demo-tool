# Install

```bash
pnpm install
```

# Run

```bash
pnpm dev
```

# Env

Add the env to set the request url

```bash
copy ./example.env .env

# then you can set the url in .env
# example: 
#VITE_REQUEST_URL=https://example.com/getJsonData
```

# Build

```bash
pnpm build
```


# Use with docker compose

First of all you need set the request url

```yml
services:
  web:
    build:
      context: .
      args:
        VITE_REQUEST_URL: # update this  https://example.com/getJsonData
    ports:
      - 8000:3000
```

Then you can use with docker compose

```bash
docker compose up --build
```