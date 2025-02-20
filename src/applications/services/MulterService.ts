import multer from "multer";
import path from "path";

export class MulterService {
  private storage: multer.StorageEngine;

  constructor() {
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "src/presentation/public"));
      },
      filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
      },
    });
  }

  single(fieldName: string) {
    return multer({ storage: this.storage }).single(fieldName);
  }
}