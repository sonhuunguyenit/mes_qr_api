1 Quản lý bộ hồ sơ tự công bố sản phẩm (HSCB)
2 Quản lý thông tin tiêu chuẩn NVL, Bao Bì, BTP, Thành phẩm (TCCS/Spec)
3 Quản lý chứng từ NCC (COA, Specification, hồ sơ công bố...)
4 Quản lý thông tin NCC và NSX của các item NVL, Bao bì
5 Quản lý BOM — HSCB & SPEC áp dụng cho từng item trong BOM
6 Truy xuất nguồn gốc từ lô thành phẩm
7 Quản lý thông tin sở hữu trí tuệ (SHTT) của thành phẩm
8 Quản lý thông tin Barcode theo item (nhãn, bao bì, thùng...)
9 Truy xuất nguồn gốc từ lô NVL (2 chiều: xuôi + ngược)
10 Quản lý thông tin và quy trình Recall thành phẩm

Tham khảo:
Module 1 — Quản lý bộ hồ sơ tự công bố sản phẩm

Mục đích: Số hóa việc quản lý dữ liệu bộ hồ sơ tự công bố sản phẩm
Yêu cầu tính năng/vận hành: Theo phương án 1: cho phép xem/sửa/duyệt theo phân quyền. Dữ liệu của file upload lên hệ thống: chỉ đọc những thông tin cần thiết, các bộ phận chốt thông tin nào được lưu trữ. Chốt phương án tạo dữ liệu ban đầu → APE thực hiện việc upload dữ liệu này.

Module 2 — Quản lý thông tin tiêu chuẩn của NVL, Bao Bì, BTP, Thành phẩm

Mục đích: Quản lý thông tin SPEC của item trong 1 phiên bản BOM
Yêu cầu tính năng/vận hành: Tích hợp thông tin BOM từ ERP, cho phép quản lý thông tin SPEC áp dụng cho từng item trong BOM. Giải pháp tự động → tránh overload. → Màn hình quản lý item trong BOM đang áp dụng SPEC nào.

Module 3 — Quản lý thông tin chứng từ khác (COA, Specification…) của các NCC cho NVL, Bao bì

Mục đích: Quản lý thông tin NCC, NSX gồm 2 nội dung: thông tin chung, thông tin hàng hóa
Yêu cầu tính năng/vận hành: Cấu trúc folder lưu trữ toàn bộ giấy tờ của NCC trên hệ thống (COA, SPC, hồ sơ công bố...) và liên kết chặt chẽ với Item Code. Cho phép upload 1 file → lưu thành nhiều loại chứng từ khác nhau (chung 1 file). Người được phân quyền vào review/duyệt/reject. Cho phép NCC vào bổ sung chứng từ. Thêm cảnh báo: thiếu chứng từ, chứng từ hết hạn, gửi email NCC. Thêm chức năng: quản lý thông tin dị ứng/dinh dưỡng cho NCC upload theo item code.

Module 4 — Quản lý thông tin NCC và NSX của các item NVL, Bao bì

Mục đích: 1 item → thuộc NCC/NSX nào. Bổ sung so với mục 3 cho các NCC không lên hệ thống
Yêu cầu tính năng/vận hành: Kế thừa thông tin mục 3, bổ sung tính năng cho phép tạo mới thêm thông tin item nào - NCC nào.

Module 5 — Quản lý bán thành phẩm, thành phẩm, NVL, bao bì của từng BOM là dùng thông tin tự công bố nào

Mục đích: Quản lý thông tin HSCB của các item code trong 1 phiên bản BOM
Yêu cầu tính năng/vận hành: Tích hợp thông tin BOM từ ERP, cho phép quản lý thông tin HSCB nào áp dụng cho từng item trong BOM. Giải pháp tự động → tránh overload. → Màn hình quản lý item/BOM đang áp dụng HSCB nào.

Module 6 — Quy trình thực hiện truy xuất nguồn gốc từ lô thành phẩm

Mục đích: Màn hình truy xuất nguồn gốc từ lô thành phẩm
Yêu cầu tính năng/vận hành: Thiết kế màn hình thể hiện đầy đủ thông tin chi tiết theo nhu cầu (cấu trúc ở cột D). Truy xuất xuôi: nhập item code thành phẩm → truy xuất ra các thông tin theo file excel/format từ phía Masan cung cấp. Truy xuất ngược từ NVL: tương tự, thống nhất 1 quy tắc thực hiện.

Module 7 — Quản lý thông tin sở hữu trí tuệ của thành phẩm

Mục đích: Số hóa việc liên kết Số đơn với Item thành phẩm, đồng bộ hóa thông tin truy xuất và thông tin SHTT giữa hai hệ thống
Yêu cầu tính năng/vận hành: Trong bộ hồ sơ công bố (TN01) - file đính kèm có thông tin cho phép quản lý nhiều số đơn SHTT. BP R&D upload file - hệ thống tự động ghi nhận. Các thông tin cần hiển thị khi truy xuất chi tiết 1 số đơn SHTT: số đơn, tên nhãn hiệu, tên KDCN, chủ sở hữu, bản PDF văn bằng.

Module 8 — Quản lý thông tin barcode theo item thành phẩm, nhãn, bao bì, thùng...

Mục đích: Liên kết Barcode với TCCS và Item, thay thế hệ thống khai báo Mobile application, giảm việc double work
Yêu cầu tính năng/vận hành: Liên kết dữ liệu với app mobile để lấy tất cả thông tin: barcode (nhãn, thùng,...)

Module 9 — Quy trình thực hiện truy xuất thông tin master data mới cho từng lô NVL

Mục đích: Cung cấp màn hình tra cứu, truy xuất thông tin
Yêu cầu tính năng/vận hành: Thiết kế màn hình thể hiện đầy đủ thông tin chi tiết theo nhu cầu (cấu trúc ở cột D). Truy xuất xuôi: nhập item code thành phẩm → truy xuất ra các thông tin theo file excel/format từ phía Masan cung cấp. Truy xuất ngược từ NVL: tương tự, thống nhất 1 quy tắc thực hiện.

Module 10 — Quản lý thông tin và quy trình recall thành phẩm

Mục đích: Số hóa quy trình Recall
Yêu cầu tính năng/vận hành: Option 2: tính năng nhập thông tin recall — thông tin cần nhập tham khảo sheet thông tin recall.

LotCode được cấu hình từ:
240526 (6 ký tự đầu tiên): Thể hiện ngày, tháng, năm nhập hàng vào kho (cụ thể ở đây là ngày 26 tháng 05 năm 2024)
. Chị Tuyền đã nhấn mạnh rất rõ rệt: Đây là ngày nhận hàng nội bộ, tuyệt đối không được hiểu ngầm đây là ngày sản xuất của lô nguyên liệu đó
ABC (Cụm ký tự tiếp theo): Là mã viết tắt định danh tên của Nhà cung cấp giao lô hàng đó
. Backend của bạn sẽ lấy cụm ký tự này đối chiếu với bảng "Từ điển danh mục Nhà cung cấp" do QA thiết lập để nội suy ra tên công ty đầy đủ (Ví dụ: Công ty TNHH ABC).
12345 (Phần đuôi còn lại): Là mã Lô gốc của chính Nhà cung cấp đó, được team QA bê nguyên xi dán vào
. Phần mã gốc này có thể là một chuỗi số ngẫu nhiên (random) hoặc mang ý nghĩa ngày sản xuất tùy theo cách tự định nghĩa của từng Vendor

Yêu cầu truy xuất:

I. Thông tin Doanh nghiệp phải Khai báo / Cập nhật lên hệ thống (Bắt buộc trước khi lưu thông)
Đây là 11 trường dữ liệu cốt lõi mà hệ thống phải thu thập từ các nguồn (HSCB, ERP, Legal) để định danh sản phẩm:

- Tên sản phẩm: Tên đầy đủ của sản phẩm, hàng hóa (Nguồn: HSCB).
- Hình ảnh sản phẩm: Ảnh sản phẩm/bao bì rõ ràng, phục vụ nhận diện (Nguồn: HSCB/OneTech, tạm thời mock).
- Xuất xứ hàng hóa: Quốc gia/vùng lãnh thổ sản xuất (Nguồn: HSCB).
- Đơn vị sản xuất hoặc kinh doanh: Tên đơn vị sản xuất, địa chỉ doanh nghiệp (Nguồn: HSCB).
- Thương hiệu / Nhãn hiệu: Tên Brand name đã đăng ký (Nguồn: Bản scan từ phòng Legal / IPMS).
- Số lô sản xuất: Mã lô (batch number) phục vụ truy xuất ngược (Nguồn: ERP).
- Hạn sử dụng (HSD): Expiry date đối với các sản phẩm có quy định (Nguồn: ERP).
- Tiêu chuẩn chất lượng áp dụng: TCVN, QCVN, TCCS, ISO... đang áp dụng cho lô hàng (Nguồn: HSCB).
- Đơn vị nhập khẩu (Bắt buộc với hàng NK): Tên, địa chỉ đơn vị nhập khẩu chính thức.
- Nhà phân phối chính thức tại VN (Bắt buộc với hàng NK): Tên nhà phân phối độc quyền/chính thức.
- Văn bằng bảo hộ SHTT (Không bắt buộc): Bằng sáng chế, nhãn hiệu được bảo hộ (Nguồn: Bản scan từ phòng Legal).

I. Yêu cầu nội bộ thêm
PHỤ LỤC 1 (PL1) - Báo cáo kết quả thực hiện truy xuất nguồn gốc
Bao gồm 16 trường thông tin cơ bản về lô hàng và sự kiện thu hồi (áp dụng cho cả Thành phẩm và Nguyên vật liệu)
:
Tên sản phẩm
Quy cách đóng gói (Khối lượng hoặc thể tích thực)
Số lô
NSX (Thành Phẩm)
NSX (NVL, Bao Bì)
HSD (Hạn sử dụng)
Lý do truy xuất nguồn gốc
Thông tin về số lượng sản phẩm không bảo đảm an toàn thực phẩm
Số lượng đã sản xuất (Thành Phẩm)
Số lượng đã nhập kho (NVL, Bao Bì)
Số lượng đã nhập khẩu
Số lượng đã tiêu thụ (Thành Phẩm)
Số lượng đã thu hồi
Số lượng chưa thu hồi được
Danh sách tên, địa chỉ, các địa điểm tập kết sản phẩm không an toàn
Hình thức xử lý sản phẩm không an toàn
📑 PHỤ LỤC 2 (PL2) - Thông tin truy xuất theo Điều 5 Thông tư 11
Bao gồm các trường thông tin chi tiết và phức tạp hơn, phân rã theo 7 nhóm đối tượng tham gia chuỗi cung ứng
:

1. Nhóm Cơ sở kinh doanh Thành Phẩm (TP)
   Tên cơ sở kinh doanh.
   Địa chỉ.
   Thông tin liên hệ.
   Mã số doanh nghiệp.
   Giấy phép kinh doanh.
   Giấy chứng nhận cơ sở đủ điều kiện ATTP.
2. Nhóm Cơ sở sản xuất Thành Phẩm (TP)
   Tên sản phẩm.
   Hình ảnh sản phẩm.
   Mã số mã vạch.
   Chất liệu bao bì, thành phần trong thực phẩm để phục vụ cho truy xuất.
   Thời hạn (Shelf-life).
   Bộ tiêu chuẩn áp dụng: Tiêu chuẩn quốc gia (TCVN) / Quy chuẩn kỹ thuật quốc gia (QCVN) / Tiêu chuẩn cơ sở (TCCS) / Tiêu chuẩn quốc tế, khu vực / Nội dung Hồ sơ tự công bố (Phụ lục danh mục chỉ tiêu và mức công bố TCCS).
   Địa điểm diễn ra sự kiện truy xuất.
   Thời gian diễn ra sự kiện truy xuất.
   Tên, địa chỉ, MST của: Khách hàng / Đại lý / Trung tâm phân phối (DC) / Nhà phân phối (NPP).
   Tên, địa chỉ, MST của: Đơn vị vận chuyển / Bảo quản / Lưu kho.
   Thông tin chi tiết lô/mẻ NL/BTP: Tên, Khối lượng, Số lượng, Thời gian giao nhận, HSD, Bao bì, Phụ gia.
3. Nhóm Cơ sở kinh doanh bổ sung
   Bổ sung thêm địa điểm, thời gian sự kiện truy xuất của cơ sở kinh doanh.
4. Nhóm Thực phẩm nhập khẩu
   Tên, địa chỉ, thông tin liên hệ của nhà sản xuất/xuất khẩu.
   Tên, địa chỉ, thông tin liên hệ, mã số doanh nghiệp của nhà nhập khẩu.
   Chứng nhận C/O hoặc Kết quả kiểm nghiệm (KQ KN) tại nước xuất xứ.
   Khối lượng, số lượng, mã số lô hàng nhập khẩu.
5. Nhóm Thực phẩm xuất khẩu
   Thị trường Nga: Mã CZ Code (Các thị trường khác hiện tại chưa yêu cầu).
6. Nhóm Xuất xứ thành phẩm
   Bộ tiêu chuẩn áp dụng: Tiêu chuẩn quốc gia (TCVN) / Quy chuẩn kỹ thuật (QCVN) / TCCS / Tiêu chuẩn quốc tế / Hồ sơ tự công bố (tương tự như nhóm Cơ sở sản xuất).
7. Nhóm Thương Hiệu, Nhãn Hiệu Sản Phẩm
   Brand (Thương hiệu của sản phẩm - Ví dụ: Chinsu, Nam Ngư...).

III. Thông tin hiển thị cho Người tiêu dùng (Khi quét mã QR truy xuất)
Khi người tiêu dùng hoặc cơ quan chức năng tra cứu miễn phí, hệ thống phải hiển thị 7 nhóm thông tin cơ bản để minh bạch nguồn gốc:

- Tên sản phẩm & hình ảnh.
- Đơn vị sản xuất hoặc kinh doanh.
- Địa chỉ doanh nghiệp.
- Thương hiệu / Nhãn hiệu.
- Số lô sản xuất.
- Số sê-ri (nếu có).
- Hạn sử dụng.

IV. Quy trình Truy xuất E2E - Khi xảy ra sự cố / Recall (Tích hợp Phụ lục 1 & 2)
Hệ thống phải hỗ trợ luồng nghiệp vụ gồm 5 bước khi có sự kiện cần thu hồi (Recall) hoặc kiểm tra:

- Bước 1: Xác định chính xác Tên sản phẩm / Mã lô / Ngày sản xuất bị lỗi.
- Bước 2: Rà soát lại hồ sơ sản xuất và hồ sơ kiểm nghiệm (Lab/QL-One) của mẻ đó.
- Bước 3: Truy xuất ngược và liên hệ với Nhà cung cấp Nguyên vật liệu / Bán thành phẩm / Bao bì cấu thành nên lô hàng đó.
- Bước 4: Thông báo khẩn cấp cho Nhà phân phối (NPP) / Đại lý để chốt số liệu: Số lượng đã sản xuất, số lượng đã tiêu thụ, tồn kho và tiến hành thu hồi.
- Bước 5: Lập báo cáo kết quả (Theo biểu mẫu Phụ lục 1 - TT31/TT11) để nộp cho cơ quan thẩm quyền.
