declare const process: any;

import { mockItems } from "./item";
import { mockPartners } from "./partner";
import { mockDocs } from "./doc";
import { mockBarcodes } from "./barcode";
import { mockShttMappings, mockIpmsInfo } from "./shtt";
import { mockSpecs } from "./spec";
import { mockHscbs } from "./hscb";
import { mockBoms } from "./bom";
import { mockRecallDecisions } from "./recall";

let errorsCount = 0;

function logError(msg: string) {
  errorsCount++;
  console.error(`❌ Validation Error: ${msg}`);
}

const itemCodes = new Set(mockItems.map((i) => i.ItemCode));
const partnerIds = new Set(mockPartners.map((p) => p.PartnerId));
const specIds = new Set(mockSpecs.map((s) => s.SpecId));

// Map specId -> Spec
const specMap = new Map(mockSpecs.map((s) => [s.SpecId, s]));

// Map HscbVersionId -> Hscb
const hscbVersionsMap = new Map();
mockHscbs.forEach((h) => {
  h.HscbVersions?.forEach((v) => {
    hscbVersionsMap.set(v.HscbVersionId, { hscb: h, version: v });
  });
});

console.log("Starting relational integrity validation of mock data...");

// 1. Specs validation
mockSpecs.forEach((s) => {
  s.SpecItems?.forEach((si) => {
    if (!itemCodes.has(si.ItemCode)) {
      logError(
        `Spec ${s.SpecId} references non-existent ItemCode ${si.ItemCode}`,
      );
    }
    if (si.SpecId !== s.SpecId) {
      logError(
        `Spec_Item ${si.SpecItemId} has mismatch SpecId: ${si.SpecId} vs ${s.SpecId}`,
      );
    }
  });
});

// 2. HSCB validation
mockHscbs.forEach((h) => {
  if (h.SpecId) {
    if (!specIds.has(h.SpecId)) {
      logError(`HSCB ${h.HscbId} references non-existent SpecId ${h.SpecId}`);
    } else {
      const spec = specMap.get(h.SpecId);
      if (spec) {
        // Quy tắc: Nếu có ql-one code thì nó là tiêu chuẩn nội bộ, không phải tiêu chuẩn pháp lý (TCCS),
        // nên không được gán cho HSCB. HSCB chỉ dành cho TCCS (không có mã QL-One).
        if (spec.SpecType !== "TCCS") {
          logError(
            `HSCB ${h.HscbId} liên kết với Spec ${h.SpecId} có loại là ${spec.SpecType}. HSCB chỉ được liên kết với tiêu chuẩn cơ sở (TCCS).`,
          );
        }
        if (spec.QloneCode) {
          logError(
            `HSCB ${h.HscbId} liên kết với Spec ${h.SpecId} có mã QL-One là '${spec.QloneCode}'. Tiêu chuẩn nội bộ có mã QL-One không được gán cho HSCB.`,
          );
        }
      }
    }
  }
  h.HscbVersions?.forEach((v) => {
    if (v.HscbId !== h.HscbId) {
      logError(
        `HscbVersion ${v.HscbVersionId} has mismatch HscbId: ${v.HscbId} vs ${h.HscbId}`,
      );
    }
    v.HscbItems?.forEach((hi) => {
      if (!itemCodes.has(hi.ItemCode)) {
        logError(
          `HscbVersion ${v.HscbVersionId} references non-existent ItemCode ${hi.ItemCode}`,
        );
      }
      if (hi.HscbVersionId !== v.HscbVersionId) {
        logError(
          `HscbItem ${hi.HscbItemId} has mismatch HscbVersionId: ${hi.HscbVersionId} vs ${v.HscbVersionId}`,
        );
      }
    });
  });
});

// 3. Docs validation
mockDocs.forEach((d) => {
  if (!partnerIds.has(d.PartnerId)) {
    logError(`Doc ${d.DocId} references non-existent PartnerId ${d.PartnerId}`);
  }
  d.DocItems?.forEach((di) => {
    if (!itemCodes.has(di.ItemCode)) {
      logError(
        `Doc ${d.DocId} references non-existent ItemCode ${di.ItemCode}`,
      );
    }
    if (di.DocId !== d.DocId) {
      logError(
        `DocItem ${di.DocItemId} has mismatch DocId: ${di.DocId} vs ${d.DocId}`,
      );
    }
  });
});

// 4. Barcodes validation
mockBarcodes.forEach((b) => {
  if (b.SpecId && !specIds.has(b.SpecId)) {
    logError(
      `Barcode ${b.BarcodeId} references non-existent SpecId ${b.SpecId}`,
    );
  }
  b.BarcodeItems?.forEach((bi) => {
    if (!itemCodes.has(bi.ItemCode)) {
      logError(`BarcodeItem references non-existent ItemCode ${bi.ItemCode}`);
    }
    if (bi.BarcodeId !== b.BarcodeId) {
      logError(
        `BarcodeItem ${bi.BarcodeItemId} has mismatch BarcodeId: ${bi.BarcodeId} vs ${b.BarcodeId}`,
      );
    }
  });
});

// 5. SHTT validation
mockShttMappings.forEach((m) => {
  if (!hscbVersionsMap.has(m.HscbVersionId)) {
    logError(
      `SHTT Mapping ${m.HscbShttId} references non-existent HscbVersionId ${m.HscbVersionId}`,
    );
  }
  if (!mockIpmsInfo[m.ShttCode]) {
    logError(
      `SHTT Mapping ${m.HscbShttId} references non-existent ShttCode registry ${m.ShttCode}`,
    );
  }
});

// 6. BOM validation
mockBoms.forEach((b) => {
  if (!itemCodes.has(b.ItemCode)) {
    logError(
      `BOM ${b.BomId} references non-existent parent ItemCode ${b.ItemCode}`,
    );
  }
  b.BomLines?.forEach((l) => {
    if (l.BomId !== b.BomId) {
      logError(
        `BOM Line ${l.BomLineId} has mismatch BomId: ${l.BomId} vs ${b.BomId}`,
      );
    }
    if (!itemCodes.has(l.ErpItemCode)) {
      logError(
        `BOM Line ${l.BomLineId} references non-existent ErpItemCode ${l.ErpItemCode}`,
      );
    }
    if (l.Selected_SpecId) {
      if (!specIds.has(l.Selected_SpecId)) {
        logError(
          `BOM Line ${l.BomLineId} references non-existent Selected_SpecId ${l.Selected_SpecId}`,
        );
      } else {
        const spec = specMap.get(l.Selected_SpecId);
        const appliesToItem = spec?.SpecItems?.some(
          (si) => si.ItemCode === l.ErpItemCode,
        );
        if (!appliesToItem) {
          logError(
            `BOM Line ${l.BomLineId} references Spec ${l.Selected_SpecId} which does NOT apply to Item ${l.ErpItemCode}`,
          );
        }
      }
    }
    if (l.Selected_HscbVersionId) {
      const match = hscbVersionsMap.get(l.Selected_HscbVersionId);
      if (!match) {
        logError(
          `BOM Line ${l.BomLineId} references non-existent Selected_HscbVersionId ${l.Selected_HscbVersionId}`,
        );
      } else {
        const hscb = match.hscb;
        if (hscb.SpecId !== l.Selected_SpecId) {
          logError(
            `BOM Line ${l.BomLineId} has Spec-HSCB relationship violation! Selected_SpecId is ${l.Selected_SpecId} but Selected_HscbVersionId belongs to HSCB ${hscb.HscbId} linked to Spec ${hscb.SpecId}`,
          );
        }
      }
    }
  });
});

// 7. Recall validation
mockRecallDecisions.forEach((r) => {
  if (!itemCodes.has(r.ItemCode)) {
    logError(
      `Recall decision ${r.RecallId} references non-existent ItemCode ${r.ItemCode}`,
    );
  }
});

if (errorsCount === 0) {
  console.log(
    "✅ SUCCESS: All mock data relational integrity validations passed successfully!",
  );
} else {
  console.error(`❌ FAILED: Found ${errorsCount} validation errors.`);
  process.exit(1);
}
