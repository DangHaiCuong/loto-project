// ============================================
// FIREBASE CONFIG TEMPLATE
// ============================================
//
// Hướng dẫn:
// 1. Truy cập: https://console.firebase.google.com/
// 2. Tạo project và Realtime Database
// 3. Lấy config từ Project Settings > Your apps > Web app
// 4. Copy config vào đây
// 5. Copy toàn bộ object firebaseConfig bên dưới
// 6. Paste vào file index.html (dòng 132-140)
//
// ============================================

const firebaseConfig = {
    // API Key - Bắt đầu bằng "AIzaSy..."
    apiKey: "YOUR_API_KEY",

    // Auth Domain - Dạng: "ten-project.firebaseapp.com"
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",

    // Database URL - Dạng: "https://ten-project-default-rtdb.asia-southeast1.firebasedatabase.app"
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",

    // Project ID - Tên project của bạn
    projectId: "YOUR_PROJECT_ID",

    // Storage Bucket - Dạng: "ten-project.appspot.com"
    storageBucket: "YOUR_PROJECT_ID.appspot.com",

    // Messaging Sender ID - Dãy số
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

    // App ID - Bắt đầu bằng "1:..."
    appId: "YOUR_APP_ID"
};

// ============================================
// VÍ DỤ CONFIG THẬT (để tham khảo format)
// ============================================
/*
const firebaseConfig = {
    apiKey: "AIzaSyABCDEFG1234567890-ABCDEFGHIJK",
    authDomain: "loto-project-abc123.firebaseapp.com",
    databaseURL: "https://loto-project-abc123-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "loto-project-abc123",
    storageBucket: "loto-project-abc123.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
*/

// ============================================
// SAU KHI LẤY CONFIG TỪ FIREBASE
// ============================================
// 1. Mở file index.html
// 2. Tìm dòng 132: "const firebaseConfig = {"
// 3. Thay thế toàn bộ object {} bằng config của bạn
// 4. Lưu file
// 5. Commit và push:
//    git add index.html
//    git commit -m "Add Firebase config"
//    git push
// 6. DONE!
