import { NextFunction, Request, Response } from 'express';
import { DirectoryUsecase } from "../../applications/usecases/DirectoryUsecase";
import { DIRECTORY_MESSAGES } from '../messages/directoryMessages';

export class DirectoryController {
  constructor(private directoryUsecase: DirectoryUsecase) {}

  async createFolder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, workspaceId, userId } = req.body;

      if (!name || !workspaceId || !userId) {
         res.status(400).json({ error: DIRECTORY_MESSAGES.ERROR.MISSING_FOLDER_NAME });
         return
      }

      const result = await this.directoryUsecase.createFolder(name, workspaceId, userId);

      if (!result) {
         res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_CREATE_FOLDER });
         return
      }

       res.status(201).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDER_CREATED, folder: result });
       return
    } catch (error: any) {
      if (error.message.includes("Folder limit exceeded")) {
         res.status(403).json({ message: DIRECTORY_MESSAGES.ERROR.FOLDER_LIMIT_EXCEEDED });
         return
      }
      next(error);
    }
  }

  async updateFolder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { folderId } = req.params;
      const { name, email } = req.body;

      if (!name) {
        res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_FOLDER_NAME });
        return
      }

      const folder = await this.directoryUsecase.updateFoldername(folderId, name, email);

      if (!folder) {
         res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_UPDATE_FOLDER });
         return
      }

       res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDER_UPDATED, folder });
       return
    } catch (error) {
      next(error);
    }
  }

  async fetchFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.body;

      if (!workspaceId) {
         res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_WORKSPACE_ID });
         return
      }

      const folders = await this.directoryUsecase.fetchFolders(workspaceId);

      if (!folders) {
         res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_FETCH_FOLDERS });
         return
      }

       res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDERS_FETCHED, folders });
       return
    } catch (error) {
      next(error);
    }
  }

  async fetchTrashItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.body;

      if (!workspaceId) {
         res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_WORKSPACE_ID });
         return
      }

      const result = await this.directoryUsecase.fetchTrash(workspaceId);

      if (!result) {
         res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_FETCH_TRASH_ITEMS });
         return
      }

       res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.TRASH_ITEMS_FETCHED, result });
       return
    } catch (error) {
      next(error);
    }
  }

  async movetoTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const { folderId, workspaceId, email } = req.body;

      if (!folderId) {
         res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_FOLDER_ID });
        return
      }

      const data = await this.directoryUsecase.moveToTrash(folderId, workspaceId, email);

      if (!data) {
        res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_MOVE_TO_TRASH });
        return
      }

       res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDER_MOVED_TO_TRASH });
       return
    } catch (error) {
      next(error);
    }
  }

  async restoreFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { folderId, email } = req.body;

      if (!folderId) {
         res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_FOLDER_ID });
         return
      }

      const data = await this.directoryUsecase.restoreFolder(folderId, email);

      if (!data) {
         res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_RESTORE_FOLDER });
         return
      }

       res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDER_RESTORED, data });
       return
    } catch (error) {
      next(error);
    }
  }
}