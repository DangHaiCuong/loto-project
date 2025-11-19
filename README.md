# 🎲 Loto Cho Hội Bạn

Trang web chơi loto đơn giản cho nhóm bạn, không cần ứng dụng phức tạp. Hoàn toàn chạy trên trình duyệt (static), có thể deploy dễ dàng lên GitHub Pages.

## ✨ Tính năng

### 🎯 Chế độ Host (Quản trò)
- Quay số ngẫu nhiên từ 1-90 (hoặc 1-75)
- Hiển thị số vừa quay lớn và rõ ràng
- Lịch sử các số đã quay
- Đếm số lượng số còn lại
- Phím tắt: Nhấn `Space` để quay số

### 🎮 Chế độ Người chơi
- Tự động sinh bảng số ngẫu nhiên
- Hai loại bảng:
  - **Bảng 3×9 (1-90)**: Loto kiểu Ý/Tombola truyền thống
  - **Bảng 5×5 (1-75)**: Bingo kiểu Mỹ (có ô FREE ở giữa)
- Đánh dấu số bằng cách click vào ô
- Xóa đánh dấu nếu cần
- Tạo bảng mới bất cứ lúc nào

## 🚀 Cách sử dụng

### Chơi trực tiếp
1. Mở file `index.html` bằng trình duyệt
2. **Host**: Chọn chế độ "Host", cài đặt số lượng số, bấm "Bắt đầu chơi"
3. **Người chơi**: Chọn chế độ "Người chơi", chọn loại bảng, bấm "Tạo bảng số"
4. Host share màn hình hoặc đọc số to cho mọi người
5. Người chơi đánh dấu số trên bảng của mình

### Deploy lên GitHub Pages
1. Tạo repository mới trên GitHub
2. Upload tất cả files vào repository
3. Vào Settings → Pages
4. Chọn branch `main` (hoặc `master`) và folder `/root`
5. Lưu và đợi vài phút
6. Truy cập trang web qua link: `https://username.github.io/repo-name/`

### Deploy lên Netlify/Vercel
1. Kéo thả toàn bộ thư mục vào Netlify Drop hoặc import repo từ GitHub
2. Trang web sẽ được deploy tự động
3. Nhận link công khai để chia sẻ

## 📁 Cấu trúc dự án

```
loto-project/
│
├── index.html          # File HTML chính
├── style.css           # CSS styling
├── script.js           # JavaScript logic
└── README.md           # Hướng dẫn sử dụng
```

## 🎯 Cách chơi Loto

### Luật cơ bản
1. Mỗi người chơi có một bảng số
2. Host quay số ngẫu nhiên và đọc to
3. Người chơi đánh dấu số trên bảng của mình nếu có
4. Người nào hoàn thành một dãy/hàng/bảng đầu tiên sẽ thắng

### Các kiểu thắng phổ biến
- **Một dòng**: Hoàn thành một hàng ngang
- **Hai dòng**: Hoàn thành hai hàng ngang
- **Full house**: Đánh dấu được tất cả số trên bảng

## 🛠️ Tùy chỉnh

### Thay đổi phạm vi số
Mở file `index.html`, tìm phần `<select id="number-range">` và thêm option mới:

```html
<option value="100">100 số</option>
```

### Thay đổi màu sắc
Mở file `style.css`, tìm phần `:root` và chỉnh sửa các biến CSS:

```css
:root {
    --primary-color: #4f46e5;  /* Màu chủ đạo */
    --secondary-color: #10b981; /* Màu phụ */
    /* ... */
}
```

## 📱 Responsive

Trang web hoạt động tốt trên:
- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

## 🤝 Đóng góp

Nếu bạn muốn thêm tính năng hoặc sửa lỗi:
1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit changes: `git commit -m 'Thêm tính năng XYZ'`
4. Push lên branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🎉 Tính năng có thể phát triển thêm

- [ ] Âm thanh khi quay số
- [ ] Chế độ tự động quay số
- [ ] Lưu lịch sử game
- [ ] Chế độ multiplayer online (cần backend)
- [ ] Thống kê số hay ra
- [ ] Theme tối/sáng
- [ ] Nhiều ngôn ngữ

## 💡 Ý tưởng từ

Loto/Tombola/Bingo - trò chơi truyền thống được yêu thích trên toàn thế giới!

---

Made with ❤️ for friends
