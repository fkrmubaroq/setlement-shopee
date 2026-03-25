import path from 'path';
import * as XLSX from 'xlsx';

export class ExcelReader {
  private workbook: XLSX.WorkBook;
  private workSheet?: XLSX.WorkSheet;

  constructor(filePath: string) {
    this.workbook = XLSX.readFile(filePath);
  }

  static fromFile(filePath: string) {
    return new ExcelReader(filePath);
  }

  static fromUploads(fileName: string) {
    const fullPath = path.join(process.cwd(), 'uploads', fileName);
    return new ExcelReader(fullPath);
  }

  sheet(sheetName: string = 'Sheet1') {
    const targetSheet = this.workbook.SheetNames.find(name =>
      name.toLowerCase().includes(sheetName.toLowerCase())
    );
    if (!targetSheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    this.workSheet = this.workbook.Sheets[targetSheet];
    return this;
  }

  toArray(range: number = 0) {
    if (!this.workSheet) {
      throw new Error('Sheet not selected. Call .sheet() first.');
    }
    return XLSX.utils.sheet_to_json(this.workSheet, { range, defval: '', raw:false });
  }

  getCellValue(cell: string) {
    if (!this.workSheet) {
      throw new Error('Sheet not selected. Call .sheet() first.');
    }
    const cellData = this.workSheet[cell];
    return cellData ? cellData.v : null;
  }
}

export function getPathFileExcel(fileName: string) {
  return path.join(process.cwd(), 'uploads', fileName);
}