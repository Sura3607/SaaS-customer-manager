# 🔄 Hướng dẫn Khôi phục Load Balancer (ALB) cho Backend

**Mục đích:** Vì AWS không cho phép "Tắt" Load Balancer (ALB), chúng ta phải xóa nó đi để tiết kiệm tiền khi không code. Tài liệu này hướng dẫn các bước tạo lại ALB và nối mạng thành công trong vòng 3 phút.

**Điều kiện tiên quyết:** - Đã bật lại Database (RDS).
- Đã bật lại Backend Server (ECS Fargate Desired Tasks = 1).

---

## Bước 1: Tạo mới Application Load Balancer
1. Đăng nhập vào AWS Console, tìm dịch vụ **EC2** -> Nhìn menu bên trái kéo xuống mục **Load Balancing** -> Chọn **Load Balancers**.
2. Bấm nút màu cam **Create load balancer**.
3. Chọn loại **Application Load Balancer** (bấm *Create*).
4. **Basic configuration:**
   - Load balancer name: Nhập `saas-alb`
   - Scheme: Chọn **Internet-facing**
   - IP address type: Chọn **IPv4**
5. **Network mapping:**
   - VPC: Chọn VPC mặc định (Default VPC).
   - Mappings: Tích chọn **Ít nhất 2 vùng khả dụng (Availability Zones)** - thường là `us-east-1a` và `us-east-1b`.
6. **Security groups:**
   - Xóa cái `default` đi.
   - Chọn Security Group dành riêng cho ALB của dự án (ví dụ: `alb-sg` - phải có rule mở Port 80 và 443).

## Bước 2: Cấu hình cổng kết nối (Listeners and routing)
*Đây là bước nối ALB vào cái Backend ECS đang chạy.*

1. Ở mục **Listeners and routing**, mặc định đang có sẵn cổng `HTTP: 80`.
2. Dòng *Default action*, bấm vào ô **Select a target group** và chọn Target Group của Backend (ví dụ: `saas-backend-tg`).
3. *(Quan trọng)* Bấm **Add listener** để thêm cổng bảo mật:
   - Protocol: Chọn **HTTPS**, Port: **443**
   - Default action: Vẫn trỏ vào Target Group `saas-backend-tg`.
4. Kéo xuống phần **Secure listener settings**:
   - Khung *Default SSL/TLS certificate*, chọn **From ACM** và sổ danh sách xuống, chọn cái Chứng chỉ SSL của tên miền (ví dụ: `*.group-02.compsci.studio`).
5. Kéo xuống cùng, bấm **Create load balancer**.

## Bước 3: Cập nhật DNS để thông mạng
*Vì ALB mới sẽ có một cái link mới tinh, chúng ta phải báo cho tên miền biết để chuyển khách hàng vào đúng nhà.*

1. Ngay khi tạo xong, ở trang danh sách Load Balancers, copy toàn bộ nội dung ở cột **DNS name** (Định dạng: `saas-alb-xxx.us-east-1.elb.amazonaws.com`).
2. Mở hệ thống quản lý tên miền (Squarespace / Route 53...).
3. Tìm đến bản ghi **CNAME** của `api` (Tên miền Backend).
4. Sửa giá trị (Value) cũ thành cái **DNS name mới** vừa copy.
5. Lưu lại và đợi khoảng 1-2 phút để DNS toàn cầu cập nhật.

✅ **HOÀN TẤT!** Lúc này Frontend sẽ tự động gọi được API thông qua tên miền `https://api...` mà không cần bất cứ ai phải sửa hay build lại code!