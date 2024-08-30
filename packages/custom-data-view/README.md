# Install

```bash
pnpm install
```

# Run

```bash
pnpm dev
```

# Env

add the env to set the request url

```bash
copy ./example.env .env

# then you can set the url in .env
# example: 
#VITE_REQUEST_URL=https://example.com/getJsonData
#VITE_TITLE=Custom Data View
```

# Build

```bash
pnpm build
```


# Use with docker compose

first of all you need set the request url

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

then you can use with docker compose

```bash
docker compose up --build
```