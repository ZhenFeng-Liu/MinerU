export type ExtractTaskType =
  | "pdf"
  | "formula-detect"
  | "formula-extract"
  | "table-recogn"
  | "talent";

export const EXTRACTOR_TYPE_LIST = {
  table: "table",
  formula: "formula",
  pdf: "PDF",
  talent: "talent",
};

export enum FORMULA_TYPE {
  extract = "extract",
  detect = "detect",
}

export enum MD_PREVIEW_TYPE {
  preview = "preview",
  code = "code",
}
