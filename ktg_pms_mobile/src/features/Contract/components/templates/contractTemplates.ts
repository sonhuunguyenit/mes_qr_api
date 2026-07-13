import { pdfStyles } from './pdfStyles';

const KTG_LOGO_BASE64 = 'data:image/webp;base64,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';

const formatHeader = (data: any) => `
  <table class="header-table">
    <tr>
      <td class="logo-cell">
        <img src="${KTG_LOGO_BASE64}" alt="Logo" style="width: 100px; height: auto" />
      </td>
      <td class="company-info">
        <span class="company-info-header">
          <strong>${data.companyName || 'CÔNG TY CỔ PHẦN KIM TÍN'}</strong>
        </span><br />
        Địa chỉ: ${data.companyAddress || 'Tầng 5, Tòa nhà Kim Tín, TP Hồ Chí Minh'}<br />
        Điện thoại: ${data.companyPhone || '028 3930 6666'} | Fax: ${data.companyFax || '028 3930 6667'}<br />
        Email: info@kimtingroup.com - Web: www.kimtingroup.com
      </td>
    </tr>
  </table>
`;

const formatParties = (data: any) => `
  <div class="section-title">BÊN SỬ DỤNG DỊCH VỤ (BÊN A): ${data.companyName || 'CÔNG TY CỔ PHẦN KIM TÍN'}</div>
  <table class="party-info">
    <tr>
      <td class="label">Mã số doanh nghiệp:</td>
      <td>${data.companyTaxCode || ''}</td>
    </tr>
    <tr>
      <td class="label">Địa chỉ:</td>
      <td>${data.companyAddress || ''}</td>
    </tr>
    <tr>
      <td class="label">Điện thoại:</td>
      <td>${data.companyPhone || ''}</td>
    </tr>
    <tr>
      <td class="label">Đại diện:</td>
      <td>${data.representativeName || ''}</td>
    </tr>
    <tr>
      <td class="label">Chức vụ:</td>
      <td>${data.representativePosition || ''}</td>
    </tr>
  </table>

  <div class="bold">VÀ</div>

  <div class="section-title">BÊN CUNG CẤP DỊCH VỤ (BÊN B): ${data.supplierInfo?.name || data.supplierName || ''}</div>
  <table class="party-info">
    <tr>
      <td class="label">Mã số doanh nghiệp:</td>
      <td>${data.supplierInfo?.code || ''}</td>
    </tr>
    <tr>
      <td class="label">Địa chỉ:</td>
      <td>${data.addressSeller || data.supplierInfo?.address || ''}</td>
    </tr>
    <tr>
      <td class="label">Điện thoại:</td>
      <td>${data.telSeller || data.supplierInfo?.phone || ''}</td>
    </tr>
    <tr>
      <td class="label">Tài khoản ngân hàng:</td>
      <td>${data.bankNumber || ''}</td>
    </tr>
    <tr>
      <td class="label">Ngân hàng:</td>
      <td>${data.bankName || ''} ${data.bankBranchName ? '- Chi nhánh: ' + data.bankBranchName : ''}</td>
    </tr>
    <tr>
      <td class="label">Đại diện:</td>
      <td>${data.representativeSeller || ''}</td>
    </tr>
    <tr>
      <td class="label">Chức vụ:</td>
      <td>${data.positionSeller || ''}</td>
    </tr>
  </table>
`;

const formatSignatures = (data: any) => `
  <table class="footer-sign">
    <tr>
      <td>ĐẠI DIỆN BÊN A</td>
      <td>ĐẠI DIỆN BÊN B</td>
    </tr>
    <tr style="height: 120px;">
      <td></td>
      <td></td>
    </tr>
    <tr style="font-weight: normal; font-style: italic;">
      <td>(Ký tên và đóng dấu)</td>
      <td>(Ký tên và đóng dấu)</td>
    </tr>
  </table>
`;

export const getTemplate1Html = (data: any, isBanNhap = true) => `
  <div class="a4-page">
    ${formatHeader(data)}
    ${isBanNhap ? '<div class="banNhap">BẢN NHÁP</div>' : ''}

    <div class="contract-title">
      <h1 class="bold">HỢP ĐỒNG NGUYÊN TẮC</h1>
      <p class="bold">Số: ${data.foreignContractCode || ''}</p>
      <p>( V/v: ${data.name || 'Cung ứng dịch vụ vận chuyển quốc tế'} )</p>
    </div>

    <div style="font-style: italic; margin-bottom: 20px">
      <p>- Căn cứ Bộ Luật Dân sự số 91/2015/QH13 ngày 24/11/2015 của Quốc Hội nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam;</p>
      <p>- Căn cứ Luật Thương Mại số 36/2005/QH11 ngày 14/06/2015 của Quốc hội nước Cộng Hoà Xã Hội Chủ Nghĩa Việt Nam;</p>
      <p>- Căn cứ vào năng lực và nhu cầu của hai Bên.</p>
    </div>

    <p>Hôm nay tại TP Hồ Chí Minh, chúng tôi gồm các bên:</p>

    ${formatParties(data)}

    <div class="article-title">ĐIỀU 1: CÁC NGUYÊN TẮC CHUNG</div>
    <div class="clause">
      <span class="clause-number">1.1</span>
      <span class="clause-content">Các Bên tham gia ký kết Hợp Đồng này trên cơ sở quan hệ hợp tác, bình đẳng và cùng có lợi theo đúng các quy định của Pháp luật.</span>
    </div>
    <div class="clause">
      <span class="clause-number">1.2</span>
      <span class="clause-content">Mọi sửa đổi, bổ sung Hợp đồng phải được lập thành văn bản dưới dạng Phụ lục hợp đồng và là một phần không tách rời của Hợp đồng này.</span>
    </div>

    <div class="article-title">ĐIỀU 2: PHẠM VI CUNG CẤP DỊCH VỤ</div>
    <p>Bên B cung cấp dịch vụ vận chuyển hàng hoá bằng đường biển cho bên A từ các cảng của Việt Nam đến các cảng quốc tế và ngược lại.</p>

    <div class="article-title">ĐIỀU 3: GIÁ DỊCH VỤ VÀ PHƯƠNG THỨC THANH TOÁN</div>
    <p>Giá cước dịch vụ và các chi phí liên quan sẽ được hai bên thỏa thuận bằng văn bản hoặc phụ lục cụ thể cho mỗi tuyến vận chuyển.</p>
    <p>Địa điểm incoterm: ${data.incotermLocation2 || ''}</p>
    <p>Thời hạn khiếu nại chất lượng: ${data.qualityClaimTime || ''}</p>

    ${formatSignatures(data)}
  </div>
`;

export const getTemplate2Html = (data: any, isBanNhap = true) => `
  <div class="a4-page">
    ${formatHeader(data)}
    ${isBanNhap ? '<div class="banNhap">BẢN NHÁP</div>' : ''}

    <div class="contract-title">
      <h1 class="bold">HỢP ĐỒNG NGUYÊN TẮC VẬN CHUYỂN</h1>
      <p class="bold">Số: ${data.foreignContractCode || ''}</p>
      <p>( V/v: ${data.name || ''} )</p>
    </div>

    ${formatParties(data)}

    <div class="article-title">ĐIỀU 1: PHẠM VI CUNG CẤP DỊCH VỤ</div>
    <p>Bên A ủy thác cho Bên B thực hiện các dịch vụ vận tải container đường bộ, đường biển nội địa với các tiêu chuẩn sau:</p>
    <div class="clause">
      <span class="clause-number">-</span>
      <span class="clause-content">Vận chuyển hàng rời, vận chuyển hàng container đường bộ.</span>
    </div>
    <div class="clause">
      <span class="clause-number">-</span>
      <span class="clause-content">Hiển thị số lô: ${data.isShowLot ? 'Cho phép hiển thị' : 'Không hiển thị'}</span>
    </div>

    <div class="article-title">ĐIỀU 2: ĐIỀU KHOẢN THANH TOÁN</div>
    <p>Điều khoản thanh toán cước: ${data.freightPaymentTerm || 'Prepaid'}</p>

    ${formatSignatures(data)}
  </div>
`;

export const getTemplate3Html = (data: any, isBanNhap = true) => `
  <div class="a4-page">
    ${formatHeader(data)}
    ${isBanNhap ? '<div class="banNhap">DRAFT</div>' : ''}

    <div class="contract-title">
      <h1 class="bold">PRINCIPLE CONTRACT</h1>
      <p class="bold">No: ${data.foreignContractCode || ''}</p>
      <p>( Ref: ${data.name || ''} )</p>
    </div>

    <div class="section-title">BUYER: ${data.companyName || ''}</div>
    <p>Address: ${data.companyAddress || ''}</p>
    <p>Tax code: ${data.companyTaxCode || ''}</p>

    <div class="section-title">SELLER: ${data.supplierInfo?.name || data.supplierName || ''}</div>
    <p>Address: ${data.addressSeller || data.supplierInfo?.address || ''}</p>
    <p>Bank number: ${data.bankNumber || ''}</p>

    <div class="article-title">ARTICLE 1: SCOPE OF SERVICES</div>
    <p>Incoterm Location: ${data.incotermLocationEn || ''}</p>
    <p>Partial Delivery: ${data.partialDeliveryEn || 'Allowed'}</p>
    <p>Transshipment: ${data.transshipmentEn || 'Allowed'}</p>

    ${formatSignatures(data)}
  </div>
`;

export const getTemplate4Html = (data: any, isBanNhap = true) => `
  <div class="a4-page">
    ${formatHeader(data)}
    ${isBanNhap ? '<div class="banNhap">BẢN NHÁP</div>' : ''}

    <div class="contract-title">
      <h1 class="bold">HỢP ĐỒNG MUA BÁN HÀNG HÓA</h1>
      <p class="bold">Số: ${data.foreignContractCode || ''}</p>
    </div>

    ${formatParties(data)}

    <div class="article-title">ĐIỀU 1: HÀNG HÓA VÀ CHẤT LƯỢNG</div>
    <p>Chất lượng hàng hóa: ${data.quality || 'Theo tiêu chuẩn nhà sản xuất'}</p>
    <p>Bao bì đóng gói: ${data.packaging || 'Quy chuẩn đóng gói xuất khẩu'}</p>

    ${formatSignatures(data)}
  </div>
`;

export const getTemplate5Html = (data: any, isBanNhap = true) => `
  <div class="a4-page">
    ${formatHeader(data)}
    ${isBanNhap ? '<div class="banNhap">BẢN NHÁP</div>' : ''}

    <div class="contract-title">
      <h1 class="bold">HỢP ĐỒNG THƯƠNG MẠI</h1>
      <p class="bold">Số: ${data.foreignContractCode || ''}</p>
    </div>

    ${formatParties(data)}

    <div class="article-title">ĐIỀU 1: BẢN GIAO HÀNG</div>
    <p>Điểm giao hàng: ${data.deliveryPoint || ''}</p>
    <p>Điểm đến: ${data.destination || ''}</p>
    <p>Thời hạn bảo hành: ${data.warrantyTerms || ''}</p>

    ${formatSignatures(data)}
  </div>
`;

export const getTemplate6Html = (data: any, isBanNhap = true) => `
  <div class="a4-page">
    ${formatHeader(data)}
    ${isBanNhap ? '<div class="banNhap">BẢN NHÁP</div>' : ''}

    <div class="contract-title">
      <h1 class="bold">HỢP ĐỒNG DỊCH VỤ TỔNG HỢP</h1>
      <p class="bold">Số: ${data.foreignContractCode || ''}</p>
    </div>

    ${formatParties(data)}

    <div class="article-title">ĐIỀU KHOẢN CHUNG</div>
    <p>Điều khoản khác: ${data.otherTerms || ''}</p>

    ${formatSignatures(data)}
  </div>
`;

export const generateContractHtml = (templateId: string, data: any, isBanNhap = true): string => {
  let templateHtml = '';
  switch (templateId) {
    case 'TEMPLATE_1':
      templateHtml = getTemplate1Html(data, isBanNhap);
      break;
    case 'TEMPLATE_2':
      templateHtml = getTemplate2Html(data, isBanNhap);
      break;
    case 'TEMPLATE_3':
      templateHtml = getTemplate3Html(data, isBanNhap);
      break;
    case 'TEMPLATE_4':
      templateHtml = getTemplate4Html(data, isBanNhap);
      break;
    case 'TEMPLATE_5':
      templateHtml = getTemplate5Html(data, isBanNhap);
      break;
    case 'TEMPLATE_6':
      templateHtml = getTemplate6Html(data, isBanNhap);
      break;
    default:
      templateHtml = getTemplate1Html(data, isBanNhap);
      break;
  }
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      ${pdfStyles}
    </style>
  </head>
  <body>
    ${templateHtml}
  </body>
</html>`;
};
