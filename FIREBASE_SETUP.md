# 🔥 Hướng dẫn Setup Firebase - Chi tiết từng bước

## 📋 Tổng quan
Bạn cần làm 5 bước đơn giản để trang web hoạt động realtime. Mất khoảng **5-10 phút**.

---

## 🚀 Bước 1: Tạo Firebase Project

### 1.1. Truy cập Firebase Console
- Mở trình duyệt và vào: **https://console.firebase.google.com/**
- Đăng nhập bằng **tài khoản Google** của bạn

### 1.2. Tạo Project mới
1. Click nút **"Add project"** (hoặc "Thêm dự án")
2. Đặt tên project: `loto-project` (hoặc tên bạn thích)
3. Click **"Continue"**

### 1.3. Tắt Google Analytics
- Tắt toggle **"Enable Google Analytics"** (không cần thiết)
- Click **"Create project"**
- Đợi khoảng 10-30 giây
- Click **"Continue"** khi hoàn thành

✅ **Checkpoint**: Bạn đã vào được Firebase Console của project

---

## 🗄️ Bước 2: Tạo Realtime Database

### 2.1. Mở Realtime Database
- Ở menu bên trái, click **"Build"** (hoặc "Xây dựng")
- Click **"Realtime Database"**
- Click nút **"Create Database"**

### 2.2. Chọn location
- Chọn: **asia-southeast1 (Singapore)** - Gần Việt Nam nhất
- Click **"Next"**

### 2.3. Chọn Security Mode
- Chọn **"Start in test mode"** (Để dễ setup)
- Click **"Enable"**
- Đợi vài giây

✅ **Checkpoint**: Bạn thấy một trang trống với URL dạng `https://loto-project-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app`

---

## 🛡️ Bước 3: Cấu hình Security Rules

### 3.1. Vào tab Rules
- Ở trang Realtime Database, click tab **"Rules"** (Quy tắc)
- Bạn sẽ thấy một code editor

### 3.2. Thay thế Rules
1. **Xóa hết** code hiện tại
2. **Copy** đoạn code này:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["createdAt"]
      }
    }
  }
}
```

3. **Paste** vào editor
4. Click nút **"Publish"** (Xuất bản)
5. Confirm bằng cách click **"Publish"** lần nữa

✅ **Checkpoint**: Rules đã được publish thành công

---

## 🔑 Bước 4: Lấy Firebase Config (QUAN TRỌNG NHẤT!)

### 4.1. Vào Project Settings
- Click icon **⚙️** (bánh răng) góc trên bên trái
- Click **"Project settings"** (Cài đặt dự án)

### 4.2. Register Web App
1. Kéo xuống phần **"Your apps"** (Ứng dụng của bạn)
2. Click icon **`</>`** (Web icon - có dấu < >)
3. App nickname: Nhập `Loto Web`
4. **KHÔNG** tick vào "Also set up Firebase Hosting"
5. Click **"Register app"** (Đăng ký ứng dụng)

### 4.3. Copy Firebase Config
Bạn sẽ thấy một đoạn code như này:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123xyz...",
  authDomain: "loto-project-12345.firebaseapp.com",
  databaseURL: "https://loto-project-12345-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loto-project-12345",
  storageBucket: "loto-project-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

📝 **COPY TOÀN BỘ** phần bên trong dấu `{ }` (từ `apiKey` đến `appId`)

✅ **Checkpoint**: Bạn đã copy được config

---

## 📝 Bước 5: Cập nhật File `index.html`

### 5.1. Mở file index.html
- Mở file `index.html` trong project
- Nhấn `Ctrl + F` (Windows) hoặc `Cmd + F` (Mac)
- Tìm: `YOUR_API_KEY`

### 5.2. Thay thế config
Tìm đoạn code này (khoảng dòng 132-140):

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**Thay thế** bằng config bạn vừa copy từ Firebase (ở bước 4.3)

### 5.3. Ví dụ sau khi thay thế:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyABC123xyz...",
    authDomain: "loto-project-12345.firebaseapp.com",
    databaseURL: "https://loto-project-12345-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "loto-project-12345",
    storageBucket: "loto-project-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

### 5.4. Lưu file
- Nhấn `Ctrl + S` (Windows) hoặc `Cmd + S` (Mac)

✅ **Checkpoint**: File đã được lưu

---

## 🚢 Bước 6: Deploy lên GitHub Pages

### 6.1. Commit changes
```bash
git add index.html
git commit -m "Update Firebase configuration"
git push
```

### 6.2. Enable GitHub Pages
1. Vào repository: https://github.com/DangHaiCuong/loto-project
2. Click **Settings** (góc phải trên)
3. Click **Pages** (menu bên trái)
4. Source: Chọn **main** branch, folder **/ (root)**
5. Click **Save**
6. Đợi 2-3 phút

### 6.3. Truy cập trang web
Link trang web của bạn:
```
https://danghacuong.github.io/loto-project/
```

✅ **DONE!** Trang web đã hoạt động realtime!

---

## 🧪 Test thử

### Test 1: Mở trên 2 thiết bị
1. **Thiết bị 1**: Mở trang → Chọn Host → Tạo phòng
2. **Thiết bị 2**: Mở trang → Chọn Người chơi → Nhập mã phòng
3. Host quay số → Số tự động hiện trên Thiết bị 2

### Test 2: Test nút Chờ/Kinh
1. Người chơi bấm nút **CHỜ**
2. Host sẽ thấy thông báo realtime
3. Người chơi bấm nút **KINH**
4. Host sẽ thấy thông báo khác màu

---

## ❓ Troubleshooting

### Lỗi: "Firebase chưa được cấu hình"
➡️ Bạn chưa thay `YOUR_API_KEY` trong file `index.html`
➡️ Xem lại Bước 5

### Lỗi: "Permission denied"
➡️ Security Rules chưa đúng
➡️ Xem lại Bước 3

### Lỗi: "Room không tồn tại"
➡️ Mã phòng sai hoặc phòng đã bị xóa
➡️ Host tạo phòng mới

### Số không đồng bộ
➡️ Kiểm tra internet
➡️ Refresh trang (F5)
➡️ Kiểm tra Firebase Console xem có data trong `rooms/` không

---

## 📞 Cần giúp đỡ?

Nếu gặp khó khăn ở bước nào, bạn có thể:

1. **Gửi screenshot** của màn hình bạn đang gặp lỗi
2. **Copy/paste lỗi** hiện ra trong Console (F12 → Console tab)
3. Hoặc **gửi Firebase config** cho tôi, tôi sẽ setup giúp

---

## 🎉 Chúc mừng!

Sau khi hoàn thành, bạn có:
- ✅ Trang web Loto realtime
- ✅ Hỗ trợ ~100 người chơi đồng thời
- ✅ Hoàn toàn miễn phí
- ✅ Tính năng Chờ/Kinh chuẩn Việt Nam

**Chúc bạn chơi vui!** 🎲🇻🇳
