export const pdfStyles = `
body {
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
}

.a4-page {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
  text-align: justify;
  font-size: 19px;
  position: relative;
  padding: 20mm;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.company-info-header {
  font-size: 25px;
  text-transform: uppercase;
}

.header-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.header-table th,
.header-table td {
  font-size: 19px;
}

.logo-cell {
  width: 20%;
  text-align: center;
}
.company-info {
  width: 80%;
}
.contract-title {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
.contract-title h1 {
  margin: 5px;
  font-size: 25px;
  text-transform: uppercase;
}
.section-title {
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 20px;
  padding-bottom: 5px;
}
.party-info {
  width: 100%;
  margin-bottom: 15px;
  font-size: 19px;
}
.party-info td {
  padding: 3px 0;
  vertical-align: top;
  font-size: 19px;
}
.label {
  width: 180px;
}
table.data-table {
  width: 90%;
  border-collapse: collapse;
  margin: 20px auto;
}
table.data-table th,
table.data-table td {
  border: 1px solid #333;
  padding: 8px;
  text-align: left;
  font-size: 19px;
}
table.data-table th {
  border: 1px solid black;
  padding: 10px;
  background-color: #f2f2f2;
  text-align: center;
  font-weight: bold;
}
.article-title {
  font-weight: bold;
  margin-top: 15px;
}
.footer-sign {
  width: 100%;
  margin-top: 50px;
  text-align: center;
}
.footer-sign td {
  width: 50%;
  font-weight: bold;
  height: 150px;
  vertical-align: top;
  font-size: 19px;
}

.banNhap {
  text-align: center;
  width: 120px;
  border: 1px solid black;
  padding: 10px;
  font-weight: 800;
  margin-left: 30px;
}

.clause {
  margin: 8px 0;
  display: flex;
}
.clause-number {
  font-weight: bold;
  min-width: 50px;
  display: inline-block;
}
.clause-content {
  flex: 1;
}
.indent-1 {
  margin-left: 20px;
}
.indent-2 {
  margin-left: 40px;
}
.bullet-item {
  display: flex;
}
.bullet-char {
  min-width: 50px;
  text-align: center;
}
.bullet-item2 {
  display: flex;
  margin-left: 50px;
}

.bold {
  font-weight: 800;
}

.created-by {
  text-align: right;
  font-size: 16px;
  position: fixed;
  bottom: 0mm;
  right: 5mm;
}

.clause-content2 {
  white-space: pre-line;
  margin-left: 20px;
}

.bullet-item3 {
  display: flex;
  margin-left: 70px;
}
  
.alpha-list {
  list-style-type: lower-alpha;
  padding-left: 20px;
}

.mt-20 {
  margin-top: 35px;
}
`;
