Hệ thống Masan Traceability là gì?
Hệ thống giúp Masan quản lý và truy xuất toàn bộ hồ sơ pháp lý, tiêu chuẩn chất lượng, và thành phần nguyên liệu của các sản phẩm — từ lúc nhập nguyên liệu từ nhà cung cấp cho đến khi thành phẩm ra thị trường. Mục tiêu là nếu có vấn đề với một sản phẩm bất kỳ, có thể truy ngược lại ngay lập tức: nguyên liệu đó từ đâu, tiêu chuẩn nào áp dụng, nhà cung cấp nào, và phiên bản hồ sơ nào đang có hiệu lực.

CÁC THỰC THỂ (ENTITIES)
Item — Danh mục vật tư / sản phẩm
Là gì: Đây là danh sách tất cả các loại "thứ" trong hệ thống — từ thành phẩm bán ra thị trường cho đến nguyên liệu đầu vào và bao bì. Mỗi Item có một mã duy nhất đồng bộ từ ERP.

Có 4 loại:

FG (Finished Goods — Thành phẩm): Sản phẩm bán ra ngoài, ví dụ: Nước tương Chinsu, Mì Omachi.
IP (In-Process — Bán thành phẩm): Sản phẩm trung gian chưa hoàn chỉnh, ví dụ: Nước cốt hầm xương bò (chỉ là nguyên liệu để làm Omachi).
RM (Raw Material — Nguyên liệu thô): Nguyên liệu đầu vào mua từ NCC, ví dụ: Hành sấy khô, Bột mì, Đường.
PG (Packaging — Bao bì): Vỏ chai, thùng carton, màng co... bọc bên ngoài sản phẩm.
Quan hệ với các thực thể khác: Item không có quan hệ FK cứng trong bảng riêng — ItemCode là chuỗi mã định danh được tham chiếu từ hầu hết tất cả các bảng khác. Đây là điểm trung tâm kết nối toàn bộ hệ thống.

Spec — Tiêu chuẩn chất lượng
Là gì: Mỗi Item (thành phẩm, nguyên liệu, bao bì...) đều phải có một tài liệu nêu rõ nó "phải đạt" những tiêu chí gì — đó là Spec (Tiêu chuẩn). Khi Spec được cập nhật (vì công thức thay đổi, quy định mới...), ta không xóa cái cũ mà tạo ra version mới, và version cũ vẫn tồn tại để truy xuất.

Có 2 loại:

TCCS (Tiêu chuẩn cơ sở): Chỉ dành cho Thành phẩm (FG). Đây là tiêu chuẩn do Masan tự đặt ra cho sản phẩm của mình. Spec TCCS là "xương sống" để tạo ra bộ hồ sơ công bố (HSCB) và đăng ký barcode.
SPEC (Tiêu chuẩn kiểm định): Dành cho tất cả các loại Item còn lại (IP, RM, PG). Là tài liệu kỹ thuật quy định chất lượng của nguyên liệu/bao bì. Các Spec này thường có thêm QloneCode — là mã hệ thống nội bộ quản lý kiểm nghiệm.
Cấu trúc quan hệ:

Spec (1)
└── Spec_Item (N) — ghi nhận Spec này áp dụng cho những ItemCode nào
Một Spec có thể áp dụng cho nhiều ItemCode (ví dụ: 1 TCCS gốc áp cho cả 6 size khác nhau của cùng một sản phẩm).

Quan hệ với module khác:

Spec TCCS → được liên kết từ HSCB (Hồ sơ công bố)
Spec → được liên kết từ Barcode
Spec → được chọn vào BOM_Line để chỉ định tiêu chuẩn đang áp dụng cho nguyên liệu đó trong mẻ nấu
Hscb / Hscb_Version / Hscb_Item — Hồ sơ tự công bố
Là gì: Khi Masan muốn bán một sản phẩm thực phẩm ra thị trường, theo quy định nhà nước phải nộp "Hồ sơ tự công bố" (HSCB) cho cơ quan quản lý (Cục ATTP). Hồ sơ này về cơ bản nói: "Sản phẩm của tôi đạt tiêu chuẩn X, thành phần Y, không chứa Z..."

Tại sao cần 3 bảng:

Hscb (bộ hồ sơ): Là đơn vị cao nhất — "Bộ hồ sơ HSCB của Nước tương Chinsu Tỏi Ớt". Một sản phẩm có 1 bộ HSCB.
Hscb_Version (phiên bản): Mỗi lần cập nhật nhãn mác, thay đổi công thức, hay làm nhãn mùa vụ (nhãn Tết, nhãn xuất khẩu...) → tạo thêm 1 phiên bản mới trong cùng bộ HSCB. Phiên bản cũ vẫn lưu để biết lịch sử.
Hscb_Item: Ghi nhận phiên bản HSCB này áp dụng cho ItemCode nào (vì có thể 1 phiên bản nhãn áp cho nhiều size).
Quan hệ:

Spec TCCS (1) ← được tham chiếu bởi → Hscb (1)
Hscb (1) → Hscb_Version (N) → Hscb_Item (N)
Một HSCB bắt buộc phải liên kết với một Spec TCCS. Nguyên tắc: Spec TCCS định nghĩa chất lượng, HSCB công bố ra bên ngoài dựa trên TCCS đó.

Quan hệ với module khác:

Hscb_Version → được chọn vào Bom (BOM Cha) để ghi nhận thành phẩm đó đang dùng phiên bản HSCB nào
Hscb_Version → được gắn vào Hscb_Shtt để lưu số đơn sở hữu trí tuệ
Hscb_Version → được chọn vào Bom_Line khi nguyên liệu con là một thành phẩm khác (có HSCB riêng)
Partner / PartnerItemMapping — Nhà cung cấp & Nhà sản xuất
Là gì: Danh sách các đối tác bên ngoài mà Masan mua nguyên liệu/bao bì từ đó.

Có 2 loại:

NCC (Nhà cung cấp): Đơn vị bán nguyên liệu/bao bì cho Masan. Họ chịu trách nhiệm cung cấp chứng từ, COA, hồ sơ dị ứng...
NSX (Nhà sản xuất): Đơn vị thực sự sản xuất ra nguyên liệu/bao bì đó. Đôi khi NCC và NSX là một, đôi khi khác nhau.
PartnerItemMapping — bảng ánh xạ:

Item (N) ←→ Partner (N)
Vì một ItemCode có thể có nhiều NCC/NSX khác nhau (ví dụ: Hành sấy khô RM-201 mua từ cả PARTNER-001 và PARTNER-011), và một NCC/NSX cũng cung cấp nhiều loại nguyên liệu khác nhau. Quan hệ này là nhiều-nhiều (M:N), cần bảng trung gian.

Doc / Doc_Item — Chứng từ từ nhà cung cấp
Là gì: Tất cả các loại giấy tờ, file PDF, file Excel mà nhà cung cấp nộp cho Masan. Hệ thống phân loại chúng theo DocType.

Các loại chứng từ (DocType):

Mã Tên Giải thích
COA Phân tích chất lượng Giấy chứng nhận cho từng lô hàng cụ thể, chứng minh lô hàng đó đạt chỉ tiêu
SPECIFICATION Bản đặc tính kỹ thuật Tài liệu NCC ban hành mô tả sản phẩm của họ là gì, chỉ tiêu kỹ thuật ra sao
HSCB Hồ sơ công bố (của NCC) Tài liệu pháp lý cho phép lưu hành sản phẩm của NCC — khác với HSCB của Masan
TCCS Tiêu chuẩn cơ sở (của NCC) Tiêu chuẩn NCC tự đặt ra cho sản phẩm của họ
DI_UNG Khai báo dị ứng File Excel NCC điền danh sách chất gây dị ứng có/không có trong nguyên liệu
DINH_DUONG Thông tin dinh dưỡng File Excel chứa các chỉ tiêu dinh dưỡng (calo, protein, chất béo...)
HDSD Hướng dẫn sử dụng Hướng dẫn cách dùng nguyên liệu trong chế biến
HD_BAO_QUAN Hướng dẫn bảo quản Yêu cầu về nhiệt độ, độ ẩm... khi bảo quản
CERTIFICATE Chứng chỉ ISO, HACCP, HALAL, các chứng nhận quốc tế của NCC
CO_KQKN C/O hoặc Kết quả kiểm nghiệm Chứng nhận xuất xứ hoặc kết quả kiểm nghiệm độc lập
KIEM_DICH Kiểm dịch Giấy kiểm dịch thực vật, kiểm định chất lượng
OTHER Khác Loại giấy tờ chưa phân loại
Cấu trúc:

Partner (1) → Doc (N) → Doc_Item (N — áp dụng cho ItemCode nào)
Barcode — Mã vạch GS1
Là gì: Mã barcode (dạng EAN-13, GS1...) được đăng ký chính thức cho sản phẩm. Một TCCS có thể được cấp nhiều mã barcode (vì cùng 1 tiêu chuẩn nhưng sản phẩm có nhiều size, nhiều dạng đóng gói khác nhau).

Cấu trúc:

Spec TCCS (1) → Barcode (N) → Barcode_Item (N — ItemCode nào dùng barcode này)
Bom / Bom_Line — Định mức nguyên liệu (Bill of Materials)
Là gì: BOM là "công thức" của một sản phẩm — liệt kê tất cả nguyên liệu/bao bì/bán thành phẩm cần dùng để sản xuất. ERP quản lý định mức (số lượng), còn hệ thống này quản lý thêm: tiêu chuẩn nào và hồ sơ nào đang áp dụng cho từng nguyên liệu đó.

Tại sao cần 2 bảng:

Bom (BOM Cha): Thông tin của sản phẩm được sản xuất — tên sản phẩm (ItemCode), phiên bản, ngày hiệu lực, và HSCB đang dùng.
Bom_Line (BOM Con): Từng dòng nguyên liệu trong BOM — mã nguyên liệu, và Spec + HSCB đang áp dụng cho nguyên liệu đó.
Logic nghiệp vụ quan trọng:

Chỉ Thành phẩm (FG) mới có Selected_HscbVersionId ở BOM Cha. BTP/NVL thì bỏ trống.
BOM_Line có Selected_HscbVersionId chỉ khi nguyên liệu con là một Thành phẩm (FG) có HSCB riêng (ví dụ: FG-003 dùng FG-001 và FG-002 làm nguyên liệu — lúc này cần chỉ định phiên bản HSCB của FG-001 và FG-002 đang dùng).
Đồng bộ ERP: ErpVersion là version từ ERP, Version là version trong hệ thống này. Nếu ErpVersion > Version → cảnh báo cần nâng cấp BOM.
Cây BOM nhiều cấp: FG chứa IP, IP chứa IP khác, IP chứa RM... Tối đa hiển thị 7 cấp.
Hscb_Shtt — Sở hữu trí tuệ (SHTT) của thành phẩm
Là gì: Khi HSCB được nộp, trong bộ hồ sơ có đính kèm thông tin về nhãn hiệu đã đăng ký (số đơn SHTT). Bảng này lưu liên kết giữa phiên bản HSCB và số đơn SHTT đó.

Tại sao gắn với Hscb_Version chứ không phải Hscb? Vì mỗi phiên bản nhãn có thể dùng nhãn hiệu khác nhau (ví dụ: phiên bản nhãn xuất khẩu dùng logo khác, có số SHTT khác).

Có 3 loại SHTT:

PRIMARY_BRAND: Nhãn hiệu chính (ví dụ: CHIN-SU)
SECONDARY_BRAND: Nhãn phụ (ví dụ: logo phụ trên bao bì)
INDUSTRIAL_DESIGN: Kiểu dáng công nghiệp (hình dạng chai, hộp...)
Tra cứu thông tin SHTT (IPMS):

Từ ShttCode (số đơn), hệ thống tra sang mockIpmsInfo (về sau là API IPMS của Cục SHTT) để lấy: tên nhãn hiệu, chủ sở hữu, file PDF văn bằng, trạng thái hiệu lực.

Template_Master / Allergen_Master / Nutrition_Master — Bảng cấu hình mẫu
Là gì: Khi NCC nộp file Excel khai báo dị ứng hoặc dinh dưỡng, hệ thống cần biết "ô Excel nào chứa thông tin gì" để đọc tự động. Đây là các bảng cấu hình.

Template_Master: Lưu file Excel mẫu đã được cấu hình sẵn.
Allergen_Master: Danh sách chuẩn các chất gây dị ứng và tọa độ ô Excel tương ứng.
Nutrition_Master: Danh sách chuẩn các chỉ tiêu dinh dưỡng và tọa độ ô Excel tương ứng.
Item_Partner_Allergen / Item_Partner_Nutrition — Kết quả khai báo
Là gì: Sau khi hệ thống đọc file Excel của NCC, kết quả được lưu vào 2 bảng này dưới dạng từng dòng riêng lẻ.

Item_Partner_Allergen: "Nguyên liệu X, từ NCC Y, dựa trên file Z, CÓ chứa chất dị ứng A."
Item_Partner_Nutrition: "Nguyên liệu X, từ NCC Y, dựa trên file Z, có Năng lượng = 364.5 kcal/100g."
Thiết kế này cho phép so sánh thông tin khai báo của cùng một nguyên liệu từ nhiều NCC khác nhau, và truy ngược được file gốc NCC đã nộp.

RecallDecision — Lệnh thu hồi
Là gì: Khi phát hiện sản phẩm có vấn đề, đây là bản ghi lệnh thu hồi: sản phẩm nào, lô nào, lý do gì, ngày nào, đang ở trạng thái nào.

CÁC MODULE
Module 1 — Quản lý HSCB (Hồ sơ tự công bố)
Làm gì: Đây là nơi nhập, theo dõi và duyệt bộ hồ sơ tự công bố sản phẩm của Masan nộp cho cơ quan nhà nước.

Thực thể dùng: Hscb, Hscb_Version, Hscb_Item

Liên kết với module khác:

Cần đọc Spec (Module 2) để biết TCCS nào đang áp dụng
Cung cấp Hscb_Version cho Module 5 (BOM) chọn vào
Cung cấp Hscb_Version cho Module 7 (SHTT) gắn số đơn
Luồng hoạt động:

Tạo một bộ HSCB → gắn với TCCS tương ứng
Upload file PDF → tạo Hscb_Version đầu tiên
Khi có nhãn mới (Tết, xuất khẩu...) → thêm Hscb_Version mới, không xóa version cũ
Người có quyền duyệt → version chuyển sang APPROVED
Module 2 — Quản lý Tiêu chuẩn (SPEC / TCCS)
Làm gì: Quản lý tất cả các tài liệu tiêu chuẩn chất lượng — từ tiêu chuẩn của thành phẩm Masan tự đặt ra (TCCS), đến tiêu chuẩn kiểm định nội bộ cho nguyên liệu/bao bì (SPEC).

Thực thể dùng: Spec, Spec_Item

Liên kết với module khác:

Được Module 1 (HSCB) tham chiếu: 1 TCCS → 1 bộ HSCB
Được Module 5 (BOM) chọn vào Bom_Line: mỗi nguyên liệu trong BOM phải có 1 Spec áp dụng
Được Module 8 (Barcode) tham chiếu: 1 TCCS → N barcode
Module 3 — Quản lý Chứng từ NCC
Làm gì: Lưu trữ, phân loại và theo dõi trạng thái duyệt của tất cả giấy tờ do nhà cung cấp nộp (COA, Specification, HSCB, Dị ứng, Dinh dưỡng...).

Thực thể dùng: Doc, Doc_Item

Liên kết với module khác:

Cần Partner (Module 4) để biết NCC nào nộp chứng từ này
Các file DI_UNG và DINH_DUONG → được parse và lưu vào Item_Partner_Allergen / Item_Partner_Nutrition
Được Module 6 (Truy xuất) tổng hợp khi tra cứu nguyên liệu của lô hàng
Module 4 — Quản lý NCC & NSX
Làm gì: Quản lý danh sách nhà cung cấp và nhà sản xuất, đồng thời ghi nhận mỗi NCC/NSX cung cấp nguyên liệu/bao bì nào.

Thực thể dùng: Partner, PartnerItemMapping

Liên kết với module khác:

Partner được Module 3 (Chứng từ) tham chiếu để biết file này của ai
PartnerItemMapping giúp Module 6 (Truy xuất) biết với một ItemCode cụ thể, có thể có bao nhiêu NCC/NSX
Module 5 — Quản lý BOM (Tiêu chuẩn & HSCB áp dụng)
Làm gì: Đây là module "chốt" — cho từng phiên bản BOM của mỗi thành phẩm, ghi nhận rõ: nguyên liệu nào đang dùng Spec nào, và thành phẩm đó đang dùng phiên bản HSCB nào. Đây là nền tảng để truy xuất nguồn gốc chính xác.

Thực thể dùng: Bom, Bom_Line

Liên kết với module khác:

Đọc Item (để lấy danh sách mã) từ ERP
Đọc Spec (Module 2) để gán cho từng dòng nguyên liệu
Đọc Hscb_Version (Module 1) để gán cho thành phẩm và nguyên liệu con là FG
Cung cấp dữ liệu cho Module 6 (Truy xuất)
Module 6 — Truy xuất nguồn gốc từ lô thành phẩm
Làm gì: Cho phép tra cứu một lô thành phẩm cụ thể và ra đầy đủ thông tin: BOM của lô đó là gì, nguyên liệu nào, từ NCC nào, Spec và HSCB đang dùng, chứng từ còn hiệu lực không.

Liên kết với module khác: Tổng hợp từ hầu hết tất cả các module: Bom → Spec → Hscb → Doc → Partner.

Module 7 — Quản lý Sở hữu trí tuệ (SHTT)
Làm gì: Ghi nhận số đơn SHTT của từng nhãn hiệu gắn với phiên bản HSCB. Kết nối với hệ thống IPMS bên ngoài để tra cứu thông tin đầy đủ của số đơn đó.

Thực thể dùng: Hscb_Shtt

Liên kết với module khác: Phụ thuộc vào Module 1 (HSCB) — cần có Hscb_Version trước mới gắn được SHTT.

Module 8 — Quản lý Barcode
Làm gì: Quản lý các mã barcode GS1 đã đăng ký, gắn với TCCS và ItemCode cụ thể. Thay thế hệ thống khai báo trên mobile app, đồng bộ dữ liệu hai chiều.

Thực thể dùng: Barcode, Barcode_Item

Liên kết với module khác: Phụ thuộc Module 2 (Spec TCCS) — chỉ thành phẩm có TCCS mới đăng ký được barcode.

Module 9 — Truy xuất từ lô nguyên liệu
Làm gì: Ngược chiều với Module 6 — cho một lô nguyên liệu (RM) cụ thể, tìm ra: NCC nào giao, chứng từ nào, đã đưa vào sản xuất thành phẩm nào.

Module 10 — Quản lý Recall
Làm gì: Khi phát hiện sản phẩm có vấn đề, tạo lệnh thu hồi với đầy đủ thông tin. Tích hợp với Module 6 để biết lô hàng đó đang phân phối ở đâu.

Thực thể dùng: RecallDecision

SƠ ĐỒ TỔNG QUAN QUAN HỆ

Item (mã ERP — trung tâm)
│
├── Spec ─────────────────────────→ Barcode
│ └── Spec_Item (N) └── Barcode_Item (N)
│
├── Hscb ←── (FK SpecId TCCS)
│ └── Hscb_Version (N)
│ ├── Hscb_Item (N)
│ └── Hscb_Shtt (N) → tra cứu IPMS bên ngoài
│
├── Partner
│ ├── PartnerItemMapping (M:N với Item)
│ └── Doc (N)
│ └── Doc_Item (N)
│ ├── Item_Partner_Allergen
│ └── Item_Partner_Nutrition
│
└── Bom (BOM Cha — Selected HscbVersionId)
└── Bom_Line (N — Selected SpecId + Selected HscbVersionId)
Template_Master / Allergen_Master / Nutrition_Master → cấu hình đọc file Excel
RecallDecision → ghi nhận lệnh thu hồi
