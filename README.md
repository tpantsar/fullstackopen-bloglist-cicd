## fullstackopen-bloglist-cicd

The bloglist application built in the Full Stack Open course, with CI/CD pipeline.
Backend is built with Node.js, Express, and MongoDB.
It serves as a RESTful API (express.static) for the frontend, which is built with React.

## Connecting to MongoDB Atlas from Render

https://www.mongodb.com/community/forums/t/cant-connect-to-mongodb-atlas-from-render-web-hosted-app/192110/5

https://render.com/docs/connect-to-mongodb-atlas

## node_volumes directory needs to be added as a volume in docker-compose.yml

https://stackoverflow.com/a/60194067

```bash
volumes:
  - ./:/usr/src/app
  - /usr/src/app/node_modules
```

## Docker development container:

`-d` flag is used to run the container in the background.

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

## Docker production container:

```bash
docker compose up -d --build
docker-compose down && docker-compose up -d --build
```

## Other commands:

```bash
docker run -it bloglist-backend-dev bash

docker run -it bloglist-frontend-dev bash
npm i

docker compose -f docker-compose.dev.yml run debug-helper wget -O - http://frontend:5173

docker build -f Dockerfile.dev -t bloglist-backend-dev .
docker build -f Dockerfile.dev -t bloglist-frontend-dev .

docker run -p 3001:3001 bloglist-backend-dev
docker run -p 5173:5173 bloglist-frontend-dev

docker exec -it bloglist-backend netstat -tlnp
docker exec -it bloglist-frontend sh -c 'echo $VITE_BACKEND_URL'

docker exec -it bloglist-frontend sh
curl -v $VITE_BACKEND_URL
curl -v http://nginx:80/api
```

### Check If Nginx Can Reach Backend

From the nginx container, test if it can reach backend:3001:

```sh
docker exec -it bloglist-docker-nginx-1 sh
curl -v http://backend:3001/api
```

```sh
docker inspect bloglist-backend | grep "IPAddress"
curl -v http://<backend_ip>:3001/api
```
