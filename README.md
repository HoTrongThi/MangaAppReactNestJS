# Manga App React NestJS

Ứng dụng web đọc truyện manga được xây dựng với React (Frontend) và NestJS (Backend).

## Cấu trúc Project

Project được chia thành 2 phần chính:

- `MangaApp/`: Frontend React application
- `backend/`: Backend NestJS application

## Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- MySQL
- npm hoặc yarn

## Cài đặt và Chạy

### Backend (NestJS)

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình database:
- Tạo file `.env` trong thư mục backend
- Cập nhật thông tin kết nối database trong `ormconfig.ts`

4. Chạy migrations:
```bash
npm run migration:run
```

5. Khởi động server:
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```
6. Cấu hình VPN cho IDE đang dùng hoặc chạy ứng dụng VPN bất kỳ

### Frontend (React)

1. Di chuyển vào thư mục MangaApp:
```bash
cd MangaApp
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Khởi động development server:
```bash
npm run dev
```

## Công nghệ sử dụng

### Frontend
- React 18
- Vite
- Ant Design
- TailwindCSS
- React Router DOM
- Axios

### Backend
- NestJS
- TypeORM
- MySQL
- JWT Authentication
- Passport
- Class Validator
- Jest (Testing)

## Tính năng

- Đăng ký/Đăng nhập người dùng
- Xem danh sách truyện
- Tìm kiếm truyện
- Đọc truyện online
- Quản lý bookmark
- Phân quyền người dùng

## Testing

### Backend
```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Contributing

1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Project này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết. 