# Sử dụng Node.js làm base image
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package*.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép tất cả các tệp vào thư mục làm việc
COPY . .

# Build dự án
RUN npm run build

# Expose cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "run", "start:prod"]
