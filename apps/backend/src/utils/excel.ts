import path from "path";
import * as XLSX from "xlsx";

export class ExcelReader {
  private workbook?: XLSX.WorkBook;
  private workSheet?: XLSX.WorkSheet;

  async fromUrl(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch file from ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    this.workbook = XLSX.read(buffer, { type: "buffer" });
    return this;
  }

  sheetIndex(sheetIndex: number = 0) {
    if (!this.workbook) {
      throw new Error("Workbook notfound");
    }
    const targetSheet = this.workbook.SheetNames[sheetIndex];
    if (!targetSheet) {
      throw new Error(`Sheet "${sheetIndex}" not found`);
    }
    this.workSheet = this.workbook.Sheets[targetSheet];
    return this;
  }

  sheet(sheetName: string = "Sheet1") {
    if (!this.workbook) {
      throw new Error("Workbook notfound");
    }

    const targetSheet = this.workbook.SheetNames.find((name) =>
      name.toLowerCase().includes(sheetName.toLowerCase()),
    );
    if (!targetSheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    this.workSheet = this.workbook.Sheets[targetSheet];
    return this;
  }

  toArray(range: number = 0) {
    if (!this.workSheet) {
      throw new Error("Sheet not selected. Call .sheet() first.");
    }
    return XLSX.utils.sheet_to_json(this.workSheet, {
      range,
      defval: "",
      raw: false,
    });
  }

  getCellValue(cell: string) {
    if (!this.workSheet) {
      throw new Error("Sheet not selected. Call .sheet() first.");
    }
    const cellData = this.workSheet[cell];
    return cellData ? cellData.v : null;
  }
}

export function getPathFileExcel(fileName: string) {
  return path.join(process.cwd(), "uploads", fileName);
}
