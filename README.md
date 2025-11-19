# 🎲 Loto Cho Hội Bạn - Realtime Edition

Trang web chơi loto realtime cho nhóm bạn! Host quay số tự động hiện lên màn hình tất cả người chơi. Hoàn toàn chạy trên trình duyệt với Firebase, không cần backend phức tạp.

## ✨ Tính năng mới - Realtime!

### 🎯 Chế độ Host (Quản trò)
- Tạo phòng chơi với mã 6 ký tự
- Quay số ngẫu nhiên từ 1-90 (hoặc 1-75)
- **Số tự động đồng bộ đến tất cả người chơi**
- Lịch sử các số đã quay
- Phím tắt: Nhấn `Space` để quay số

### 🎮 Chế độ Người chơi
- Tham gia phòng bằng mã 6 ký tự
- **Nhận số realtime từ Host**
- Màn hình nhấp nháy khi có số trên bảng
- Tự động sinh bảng số theo phòng
- Hai loại bảng:
  - **Bảng 3×9 (1-90)**: Loto kiểu Ý/Tombola
  - **Bảng 5×5 (1-75)**: Bingo kiểu Mỹ (có ô FREE)
- Đánh dấu số bằng cách click

## 🚀 Cách setup - Bắt buộc!

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** (Thêm dự án)
3. Đặt tên project (ví dụ: `loto-project`)
4. Tắt Google Analytics (không cần thiết)
5. Click **Create project**

### Bước 2: Tạo Realtime Database

1. Trong Firebase Console, vào **Build** → **Realtime Database**
2. Click **Create Database**
3. Chọn location gần bạn nhất (ví dụ: `asia-southeast1`)
4. Chọn **Start in test mode** (để dễ setup)
5. Click **Enable**

### Bước 3: Cấu hình Security Rules

Trong Realtime Database, vào tab **Rules** và paste:

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

Click **Publish**

### Bước 4: Lấy Firebase Config

1. Vào **Project settings** (icon ⚙️)
2. Kéo xuống phần **Your apps**
3. Click icon **Web** (`</>`)
4. Đặt tên app (ví dụ: `Loto Web`)
5. **KHÔNG** check "Firebase Hosting"
6. Click **Register app**
7. Copy đoạn config (phần `firebaseConfig`)

### Bước 5: Cập nhật file `index.html`

Mở file `index.html`, tìm dòng 131-140:

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

Thay thế bằng config bạn vừa copy từ Firebase.

**Ví dụ:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBxxx...",
    authDomain: "loto-project-xxxxx.firebaseapp.com",
    databaseURL: "https://loto-project-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "loto-project-xxxxx",
    storageBucket: "loto-project-xxxxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxx"
};
```

### Bước 6: Deploy và sử dụng

#### Deploy lên GitHub Pages:
1. Push code lên GitHub
2. Vào Settings → Pages
3. Chọn branch `main`, folder `/root`
4. Lưu và truy cập link: `https://username.github.io/repo-name/`

#### Deploy lên Netlify/Vercel:
1. Kéo thả thư mục vào trang web
2. Tự động deploy
3. Nhận link công khai

## 🎮 Cách chơi

1. **Host**:
   - Mở trang → Chọn "Host"
   - Chọn loại (75 hoặc 90 số)
   - Click "Tạo phòng và bắt đầu"
   - Chia sẻ mã phòng 6 ký tự cho người chơi
   - Nhấn "Quay số tiếp" hoặc phím `Space`

2. **Người chơi**:
   - Mở trang → Chọn "Người chơi"
   - Nhập mã phòng từ Host
   - Click "Tham gia phòng"
   - Bảng số tự động sinh ra
   - Khi Host quay số, màn hình sẽ nhấp nháy nếu có số trên bảng
   - Click vào số để đánh dấu

## 📊 Giới hạn Firebase Free Tier

- ✅ Đồng thời: ~100 người chơi
- ✅ Bandwidth: 10GB/tháng (dư dùng cho nhóm bạn)
- ✅ Storage: 1GB (chỉ lưu phòng chơi)
- ✅ Hoàn toàn miễn phí cho hội bạn

## 🔧 Tùy chỉnh nâng cao

### Bật tự động đánh dấu

Mở file `script.js`, tìm dòng 276-281:

```javascript
function autoMarkNumber(number) {
    if (gameState.playerCard.includes(number) && !gameState.markedNumbers.includes(number)) {
        // Uncomment to enable auto-mark
        // toggleMark(number);
    }
}
```

Bỏ comment dòng `// toggleMark(number);` để tự động đánh dấu số.

### Thay đổi màu sắc

Mở `style.css`, chỉnh biến CSS:

```css
:root {
    --primary-color: #4f46e5;  /* Màu chủ đạo */
    --secondary-color: #10b981; /* Màu phụ */
}
```

## 📁 Cấu trúc dự án

```
loto-project/
│
├── index.html          # File HTML với Firebase SDK
├── style.css           # CSS styling (với styles mới)
├── script.js           # JavaScript logic (realtime)
└── README.md           # File này
```

## 🛡️ Bảo mật

Với setup hiện tại, database ở chế độ test (ai cũng đọc/ghi được). Điều này OK cho nhóm bạn nhưng:

### Nâng cấp bảo mật (optional):

Thay rules bằng:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": "!data.exists() || data.child('createdAt').val() > (now - 86400000)",
        ".indexOn": ["createdAt"]
      }
    }
  }
}
```

Rules này:
- Cho phép đọc phòng (`.read: true`)
- Chỉ cho phép tạo phòng mới hoặc cập nhật phòng < 24h
- Tự động xóa phòng cũ sau 24h

### Dọn dẹp phòng cũ tự động

Firebase không tự động xóa data. Để tránh tốn storage, bạn có thể:

1. Vào Firebase Console → Realtime Database
2. Xóa thủ công các phòng trong mục `/rooms`

Hoặc viết Cloud Function (nâng cao, cần upgrade Firebase plan).

## 🆚 So sánh phiên bản

| Tính năng | Offline | Realtime (Firebase) |
|-----------|---------|---------------------|
| Host quay số | ✅ | ✅ |
| Người chơi nhận bảng | ✅ | ✅ |
| Đồng bộ tự động | ❌ Share màn hình | ✅ Realtime |
| Số người chơi | Không giới hạn | ~100 (free tier) |
| Setup | Không cần | Cần Firebase |
| Chi phí | Miễn phí | Miễn phí (free tier) |

## ❓ Troubleshooting

### Lỗi: "Firebase chưa được cấu hình"
→ Bạn chưa thay `YOUR_API_KEY` trong `index.html` bằng config thật.

### Lỗi: "Permission denied"
→ Kiểm tra Security Rules trong Firebase Console.

### Lỗi: "Room không tồn tại"
→ Phòng đã bị xóa hoặc mã sai. Host tạo phòng mới.

### Số không đồng bộ
→ Kiểm tra internet, refresh trang.

## 🎉 Tính năng có thể phát triển thêm

- [ ] Âm thanh khi quay số
- [ ] Chế độ tự động quay số (mỗi 5s)
- [ ] Thông báo khi người chơi thắng
- [ ] Lưu lịch sử game
- [ ] Nhiều phòng cùng lúc
- [ ] Chat trong phòng
- [ ] Xác thực Host bằng password

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 💡 Được tạo bởi

Made with ❤️ for friends | Powered by Firebase

---

**Lưu ý quan trọng:** Nhớ setup Firebase trước khi sử dụng! Không có Firebase, trang web sẽ hoạt động ở chế độ offline (không realtime).
