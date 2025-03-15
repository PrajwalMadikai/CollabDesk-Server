import { NextFunction, Request, Response } from "express";
import { FileUsecase } from "../../applications/usecases/FileUsecase";
import { FILE_MESSAGES } from "../messages/fileMessages";

export class FileController {
  constructor(private fileUsecase: FileUsecase) {}

  async createFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { folderId, email } = req.body;

      if (!folderId) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_FOLDER_ID });
      }

      let file = await this.fileUsecase.createFile(folderId, email);

      if (!file) {
        return res.status(404).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_CREATE_FILE });
      }

      return res.status(201).json({ message: FILE_MESSAGES.SUCCESS.FILE_CREATED, file });
    } catch (error) {
      next(error);
    }
  }

  async movetoTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId, folderId } = req.body;

      if (!folderId || !fileId) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_FOLDER_ID });
      }

      let result = await this.fileUsecase.movetoTrash(fileId, folderId);

      if (!result) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_DELETE_FILE });
      }

      return res.status(200).json({ message: FILE_MESSAGES.SUCCESS.FILE_DELETED });
    } catch (error) {
      return next(error);
    }
  }

  async contentFetch(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_FILE_ID });
      }

      let file = await this.fileUsecase.fetchContent(fileId);

      if (!file) {
        return res.status(404).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_FIND_FILE });
      }

      return res.status(200).json({ message: FILE_MESSAGES.SUCCESS.FILE_CONTENT_FETCHED, file });
    } catch (error) {
      next(error);
    }
  }

  async fetchFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { folderId } = req.body;

      if (!folderId) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_FOLDER_ID });
      }

      const file = await this.fileUsecase.fetchFile(folderId);

      if (!file) {
        return res.status(404).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_FIND_FILE });
      }

      return res.status(200).json({ message: FILE_MESSAGES.SUCCESS.FILES_FETCHED, file });
    } catch (error) {
      next(error);
    }
  }

  async updateFileName(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;
      const { name, folderId, email } = req.body;

      if (!folderId) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_FOLDER_ID });
      }

      const file = await this.fileUsecase.updateFileName(fileId, folderId, name, email);

      if (!file) {
        return res.status(404).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_UPDATE_FILE });
      }

      return res.status(200).json({ message: FILE_MESSAGES.SUCCESS.FILE_UPDATED, file });
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;
      const image = req.file;

      if (!fileId || !image) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_IMAGE });
      }

      const file = await this.fileUsecase.uploadImage(fileId, image.buffer);

      if (!file) {
        return res.status(404).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_UPDATE_FILE });
      }

      res.status(200).json({
        message: FILE_MESSAGES.SUCCESS.IMAGE_UPLOADED,
        file,
      });
    } catch (error) {
      next(error);
    }
  }

  async fileRestore(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId, email } = req.body;

      if (!fileId) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_FILE_ID });
      }

      const data = await this.fileUsecase.restoreFile(fileId, email);

      if (!data) {
        return res.status(404).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_RESTORE_FILE });
      }

      return res.status(200).json({ message: FILE_MESSAGES.SUCCESS.FILE_RESTORED, data });
    } catch (error) {
      next(error);
    }
  }

  async makeDocOnline(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_FILE_ID });
      }

      const data = await this.fileUsecase.publishDoc(fileId);

      if (!data) {
        return res.status(404).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_PUBLISH_DOC });
      }

      return res.status(200).json({ message: FILE_MESSAGES.SUCCESS.DOC_PUBLISHED, data });
    } catch (error) {
      next(error);
    }
  }

  async getFileReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return res.status(400).json({ message: FILE_MESSAGES.ERROR.MISSING_FILE_ID });
      }

      const file = await this.fileUsecase.fetchPreview(fileId);

      if (!file) {
        return res.status(404).json({ message: FILE_MESSAGES.ERROR.UNABLE_TO_FETCH_PREVIEW });
      }

      return res.status(200).json({ message: FILE_MESSAGES.SUCCESS.PREVIEW_FETCHED, file });
    } catch (error) {
      next(error);
    }
  }
}