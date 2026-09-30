# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

# Vite inlines VITE_API_URL at build time, so it must be a build arg rather
# than a runtime environment variable.
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ─── Stage 2: Development server ──────────────────────────────────────────────
FROM node:20-alpine AS development

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ─── Stage 3: Production ───────────────────────────────────────────────────────
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
