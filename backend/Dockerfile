FROM node:22

WORKDIR /usr/src/app

# Copy backend code
COPY --chown=node:node . .

# Remove dist folder if it exists
RUN rm -rf dist

# Copy frontend static build from the frontend image
COPY --from=bloglist-frontend /usr/src/app/dist ./dist

RUN npm ci --omit=dev

ENV NODE_ENV=production

USER node

CMD ["npm", "run", "start"]
