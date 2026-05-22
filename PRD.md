# TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD) - ỨNG DỤNG "CÔ EM CÔNG SỞ" 💃🏼
*Hệ thông chăm sóc cột sống, giảm đau mỏi cơ xương khớp dành riêng cho dân văn phòng*

---

## Ⅰ. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

### 1. Giới thiệu sản phẩm
**"Cô Em Công Sở"** là một ứng dụng web dạng "Mascot-led Wellness Companion" (Trợ lý cốt sống đồng hành cá tính). Khác biệt hoàn toàn với các app y tế khô khan, ứng dụng tiếp cận dân văn phòng bằng hình tượng Mascot **"Cô Em"** hóm hỉnh, gần gũi, sử dụng ngôn ngữ trẻ trung (Sassy & Trendy) mang tính khích lệ cao, đồng hành cùng người dùng vượt qua nỗi đau "mỏi cổ, đau lưng, tê cổ tay" mỗi ngày.

### 2. Đối tượng mục tiêu (Target Persona)
* **Dân công sở, lập trình viên, designer:** Ngồi liên tục 8-10 tiếng/ngày, cúi đầu gầm màn hình, tay bấm chuột gõ phím liên tục.
* **Triệu chứng thường gặp:** Đau mỏi mắt, đau mỏi vai gáy, mỏi cổ tay, đau thắt lưng, căng cơ thoi lưng trên.
* **Insight:** Lười tập luyện cường độ cao, cần những động tác ngắn (1-5 phút) có thể tập trực tiếp trên ghế hoặc bàn làm việc mà không cần thay trang phục tập.

---

## Ⅱ. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

Ứng dụng được cài đặt trên mô hình **Full-Stack SPA kết hợp Lưu trữ Đám mây (Cloud Hybrid Sync)**:

```
                  ┌────────────────────────────────────────┐
                  │          Trình Duyệt Người Dùng        │
                  │   (React SPA + Tailwind CSS + Motion)  │
                  └──────────────────┬─────────────────────┘
                                     │
           ┌─────────────────────────┴────────────────────────┐
           ▼                                                  ▼
┌──────────────────────┐                             ┌──────────────────────┐
│  Express Server API  │                             │  Supabase Cloud DB   │
│  (Gemini API Engine) │                             │ (Data & Metrics Sync)│
└──────────────────────┘                             └──────────────────────┘
```

1. **Client Frontend (React SPA):** 
   * Trực quan hóa lộ trình, hướng dẫn bài tập, lưu trạng thái xuống `localStorage` để hoạt động mượt mà ở chế độ offline khi chưa cấu hình Supabase.
   * Đồng bộ hóa dữ liệu thời gian thực lên dịch vụ Supabase khi cấu hình các biến biến môi trường đầu cuối.
2. **Backend Server (Express + tsx):**
   * Quản lý luồng xử lý trí tuệ nhân tạo (Gemini API) bảo mật tuyệt đối cho Key dịch vụ.
   * Tự động điều động và chuyển giao các bài tập linh hoạt phù hợp với trạng thái đau của thành viên.
3. **Storage & Database (Supabase Cloud):**
   * Lưu trữ danh sách bài tập động (`exercises`), lịch sử thực hiện của học viên, hồ sơ tiến trình và sự kiện hành vi tương tác.

---

## Ⅲ. CHI TIẾT SỰ KIỆN CƠ SỞ DỮ LIỆU (SUPABASE SCHEMA)

Hệ thống cơ sở dữ liệu trên Supabase được thiết lập gồm 4 bảng lõi bảo đảm bảo hiệu năng truy vấn và bảo mật (RLS) cao:

### 1. Bảng `exercises` (Quản lý bài tập động)
* Chứa danh sách các bài tập hồi phục. Admin có thể thay đổi dữ liệu trực tiếp tại bảng này mà không cần build/deploy lại code frontend.

```sql
CREATE TABLE public.exercises (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    area TEXT NOT NULL,          -- 'Cổ vai gáy' | 'Cổ tay' | 'Lưng trên' | 'Thắt lưng' | 'Mắt' | 'Đầu'
    duration INTEGER NOT NULL,   -- giây
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    common_mistakes JSONB NOT NULL DEFAULT '[]'::jsonb,
    contraindications JSONB NOT NULL DEFAULT '[]'::jsonb,
    location_style TEXT NOT NULL, -- 'Desk' | 'Floor' | 'Any'
    exercise_type TEXT NOT NULL,  -- 'stretch' | 'mobility' | 'massage' | 'breathing' | 'eye'
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2. Bảng `user_profiles` (Hồ sơ & Luồng rèn luyện)
* Đồng bộ hóa thời gian thực các thành tích cá nhân, số phút luyện tập và lộ trình 3/7 ngày mà học viên đã lựa chọn.

```sql
CREATE TABLE public.user_profiles (
    user_id TEXT PRIMARY KEY, -- Sử dụng anonymous user ID được sinh ngẫu nhiên ở client
    name TEXT NOT NULL DEFAULT 'Bạn Đồng Nghiệp',
    streak INTEGER NOT NULL DEFAULT 0,
    total_minutes INTEGER NOT NULL DEFAULT 0,
    completed_days_count INTEGER NOT NULL DEFAULT 0,
    selected_plan TEXT, -- '3day' | '7day' | null
    plan_start_date TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 3. Bảng `user_sessions` (Lịch sử rèn luyện)
* Ghi lại chi tiết kết quả sướng/đau trước và sau từng buổi tập của thành viên.

```sql
CREATE TABLE public.user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    routine_id TEXT NOT NULL,
    pain_before INTEGER NOT NULL,
    pain_after INTEGER NOT NULL,
    completed_exercises JSONB NOT NULL DEFAULT '[]'::jsonb, -- Mảng ID các bài hoàn thành
    skipped_exercises JSONB NOT NULL DEFAULT '[]'::jsonb,   -- Mảng ID các bài bỏ qua
    painful_exercises JSONB NOT NULL DEFAULT '[]'::jsonb,   -- Mảng ID các bài bị cảnh báo đau
    duration_spent INTEGER NOT NULL, -- giây thực tế thực hành
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 4. Bảng `user_tracking_events` (Đo lường & Phân tích metric)
* Lưu trữ hành vi chuyển tab, nhấn kích hoạt lộ trình phục vụ nghiên cứu UI/UX của sản phẩm.

```sql
CREATE TABLE public.user_tracking_events (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- e.g. 'tab_navigation' | 'plan_activated' | 'session_completed'
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## Ⅳ. TÍNH NĂNG CHỦ CHỐT (PRODUCT FEATURES)

### 1. Phân tích Sức Khỏe Tức Thời (Khám gáy mỏi)
* Cho phép chọn vùng đau (Cổ vai gáy, Cổ tay, Lưng trên, Thắt lưng, v.v.), độ đau (1-10), thời gian rảnh có sẵn và không gian tập (Văn phòng hoặc Tại nhà).
* Tích hợp **Cổng Cảnh Báo Lâm Sàng (Red Flags)**: Nếu người dùng báo các triệu chứng nghiêm trọng như tê bì xuống tay, chóng mặt, buồn nôn, hệ thống ngay lập tức chuyển trạng thái sang huấn luyện phục hồi an toàn nhẹ nhàng (các bài thở, bài mắt) và hiển thị thông báo khuyên người dùng thăm khám y tá chuyên khoa.

### 2. Thiết kế Lộ Trình Phục Hồi Cá Nhân Hóa (Gemini Generator AI)
* Sử dụng server-side Gemini AI kết hợp thư viện bài tập dãn cơ để tạo các Routine phục hồi độc bản.
* Trường hợp khóa học viên không có kết nối API internet, phương pháp Fallback thông minh chạy thuật toán lọc cục bộ tại chỗ giúp hệ thống phản hồi siêu tốc không gián đoạn trải nghiệm người dùng.

### 3. Giáo án Lộ trình Dài Hạn (3 Days & 7 Days Journey)
* **3 Ngày Cứu Lưng Cấp Kỳ:** Chuyên biệt hồi sinh thắt lưng trong thời gian ngắn nhất.
* **7 Ngày Rèn Dũa Dẻo Dai:** Lập trình thói quen giải phóng căng cứng phần thân trên toàn diện.

### 4. Bảng Đo Lường Thành Tích & Bộ Huy Chương
* Hệ thống theo dõi chuỗi kỉ lục tập liên tục (Streak), tổng số phút luyện tập.
* Kích hoạt tự động các huy chương ảo thú vị nhằm khích lệ tinh thần: *Chiến Binh Lưng Thẳng*, *Đôi Tay Vàng Trong Làng Gõ Phím*, *Thần Nhãn Tinh Anh*.

### 5. Cổng Kiểm Soát Cloud & Seeding Dữ Liệu
* Tại Tab cá nhân, khi có cấu hình Supabase, hệ thống cung cấp trung tâm hiển thị trạng thái đồng bộ rõ ràng.
* Hỗ trợ nút **🚀 Seeding 50 Bài Tập Gốc** để người quản lý đẩy cơ sở dữ liệu mẫu lên Supabase Cloud của riêng họ một cách trực quan trong vòng 1-click.

---

## Ⅴ. ĐỊNH HƯỚNG PHÁT TRIỂN TIẾP THEO

* **Tự động nhận diện tư thế qua Camera:** Sử dụng Google MediaPipe để kiểm định tư thế cúi cổ vai gáy của người dùng và phát âm thanh cảnh báo trực tiếp.
* **Tích hợp Supabase Auth:** Cung cấp đăng nhập bảo mật bằng tài khoản Google Workspace (Google SSO) đồng bộ sâu hơn tiến trình cá nhân qua nhiều thiết bị.
* **Hỗ trợ thông báo đẩy (Push Notification):** Nhắc nhở vận động nhẹ sau mỗi 45 phút học viên ngồi yên một vị trí.

---
*Tài liệu được bảo vệ và đồng hành phát triển cùng hệ thống Cô Em Công Sở.* 💃🏼🚀
