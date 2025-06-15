
export interface Book {
  id: string;
  title: string;
  author: string;
  serialNumber: number;
  subject: string;
  totalCopies: number;
  availableCopies: number;
  shelf?: string;
  column?: string;
  pages?: number;
  dateAdded: string;
}
