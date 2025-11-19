# ⚡ Quick Start - Bắt đầu nhanh

## 🎯 Mục tiêu
Chạy được trang web Loto realtime trong **10 phút**!

---

## 📝 Checklist

### ☐ Bước 1: Có tài khoản Google chưa?
- ✅ Có → Tiếp tục bước 2
- ❌ Chưa → Tạo tài khoản tại: https://accounts.google.com/

### ☐ Bước 2: Tạo Firebase Project (5 phút)
1. Vào: https://console.firebase.google.com/
2. Click "Add project"
3. Đặt tên: `loto-project`
4. Tắt Google Analytics
5. Click "Create project"

### ☐ Bước 3: Tạo Database (2 phút)
1. Menu bên trái → "Realtime Database"
2. Click "Create Database"
3. Location: `asia-southeast1`
4. Mode: "Start in test mode"
5. Click "Enable"

### ☐ Bước 4: Setup Rules (1 phút)
1. Tab "Rules"
2. Copy paste code này:

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

3. Click "Publish"

### ☐ Bước 5: Lấy Config (2 phút)
1. Icon ⚙️ → "Project settings"
2. Phần "Your apps" → Click icon `</>`
3. App name: `Loto Web`
4. Click "Register app"
5. **COPY config** (phần có `apiKey`, `authDomain`, etc.)

### ☐ Bước 6: Update Code
1. Mở file `index.html`
2. Tìm dòng có `YOUR_API_KEY`
3. Thay bằng config vừa copy
4. Lưu file

### ☐ Bước 7: Push lên GitHub
```bash
git add index.html
git commit -m "Add Firebase config"
git push
```

### ☐ Bước 8: Enable GitHub Pages
1. Vào: https://github.com/DangHaiCuong/loto-project/settings/pages
2. Source: `main` branch, `/root` folder
3. Click "Save"
4. Đợi 2 phút

### ☐ Bước 9: Truy cập trang web
```
https://danghacuong.github.io/loto-project/
```

### ☐ Bước 10: Test!
- Mở 2 tab/thiết bị
- Tab 1: Host → Tạo phòng
- Tab 2: Người chơi → Join phòng
- Host quay số → Tab 2 nhận số realtime!

---

## ✅ DONE!

Nếu tất cả ✅ → Chúc mừng! Bạn đã có trang web Loto realtime!

Nếu có ❌ → Xem file `FIREBASE_SETUP.md` để hướng dẫn chi tiết hơn

---

## 🎮 Cách chơi

### Host (Quản trò):
1. Chọn "Host"
2. Chọn loại (75 hoặc 90 số)
3. Tạo phòng
4. Chia sẻ mã 6 ký tự cho bạn bè
5. Quay số (hoặc nhấn Space)

### Người chơi:
1. Chọn "Người chơi"
2. Nhập mã phòng từ Host
3. Nhận bảng số tự động
4. Khi Host quay số → Màn hình nhấp nháy nếu có số
5. Click số để đánh dấu
6. Sắp thắng → Bấm **CHỜ** 🔔
7. Thắng rồi → Bấm **KINH!** 🏆

---

## 💡 Tips

- 💾 Lưu mã phòng để join lại nếu thoát nhầm
- 📱 Chơi trên điện thoại cũng ok
- 🎯 Host có thể nhấn Space để quay số nhanh
- 🔔 Đừng quên bấm CHỜ để tạo hứng thú!
- 🏆 Kiểm tra kỹ trước khi bấm KINH

---

## ❓ Cần giúp?

**Xem thêm:**
- Chi tiết: `FIREBASE_SETUP.md`
- Template: `firebase-config-template.js`
- Tổng quan: `README.md`

**Hoặc:**
- Gửi config Firebase cho tôi
- Tôi sẽ setup giúp ngay! 🚀
