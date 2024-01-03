# bun-web-app

To install dependencies:

```bash
bun install
```

To run the server in dev mode:

```bash
bun dev
```

To run the server in production mode:

```bash
bun bundle && bun run ./dist/server.js
```

To build with Docker:
``` bash
docker build --pull -t bun-web-app .
```

To run with Docker:
``` bash
docker run -d -p 3000:3000 bun-web-app
```