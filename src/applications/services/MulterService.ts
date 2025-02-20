import multer from 'multer';

export class MulterService {
  private storage: multer.StorageEngine;

  constructor() {
    this.storage = multer.memoryStorage();  
  }

  single(fieldName: string) {
    return multer({ storage: this.storage }).single(fieldName);
  }
}