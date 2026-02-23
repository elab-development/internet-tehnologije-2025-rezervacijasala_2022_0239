FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="db9dw0hj2"
ENV RESEND_API_KEY="temporary_key_for_build"
ENV DATABASE_URL="mysql://root:placeholder@db:3306/db"

RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]