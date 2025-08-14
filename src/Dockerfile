
# ---- Base Stage ----
    FROM node:20-alpine AS base
    # Set the working directory in the container
    WORKDIR /usr/src/app
    # Copy package.json and package-lock.json
    COPY package*.json ./
    
    # ---- Dependencies Stage ----
    FROM base AS dependencies
    # Install app dependencies for production
    RUN npm install --frozen-lockfile --omit=dev
    
    # ---- Build Stage ----
    FROM base AS build
    COPY . .
    RUN npm install --frozen-lockfile
    # Build the TypeScript code
    RUN npm run build
    
    # ---- Release Stage ----
    FROM base AS release
    COPY --from=dependencies /usr/src/app/node_modules ./node_modules
    COPY --from=build /usr/src/app/dist ./dist
    EXPOSE 8080
    CMD [ "node", "dist/index.js" ]
    
    