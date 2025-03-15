import { NextFunction, Request, Response } from 'express';
import { DirectoryUsecase } from "../../applications/usecases/DirectoryUsecase";
import { DIRECTORY_MESSAGES } from '../messages/directoryMessages';

export class DirectoryController {
  constructor(private directoryUsecase: DirectoryUsecase) {}

  async createFolder(req: Request, res: Response, next: NextFunction)  {
    try {
      const { name, workspaceId, userId } = req.body;

      if (!name || !workspaceId || !userId) {
        return res.status(400).json({ error: DIRECTORY_MESSAGES.ERROR.MISSING_FOLDER_NAME });
      }

      const result = await this.directoryUsecase.createFolder(name, workspaceId, userId);

      if (!result) {
        return res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_CREATE_FOLDER });
      }

      return res.status(201).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDER_CREATED, folder: result });
    } catch (error: any) {
      if (error.message.includes("Folder limit exceeded")) {
        return res.status(403).json({ message: DIRECTORY_MESSAGES.ERROR.FOLDER_LIMIT_EXCEEDED });
      }
      next(error);
    }
  }

  async updateFolder(req: Request, res: Response, next: NextFunction)  {
    try {
      const { folderId } = req.params;
      const { name, email } = req.body;

      if (!name) {
        return res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_FOLDER_NAME });
      }

      const folder = await this.directoryUsecase.updateFoldername(folderId, name, email);

      if (!folder) {
        return res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_UPDATE_FOLDER });
      }

      return res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDER_UPDATED, folder });
    } catch (error) {
      next(error);
    }
  }

  async fetchFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.body;

      if (!workspaceId) {
        return res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_WORKSPACE_ID });
      }

      const folders = await this.directoryUsecase.fetchFolders(workspaceId);

      if (!folders) {
        return res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_FETCH_FOLDERS });
      }

      return res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDERS_FETCHED, folders });
    } catch (error) {
      next(error);
    }
  }

  async fetchTrashItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.body;

      if (!workspaceId) {
        return res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_WORKSPACE_ID });
      }

      const result = await this.directoryUsecase.fetchTrash(workspaceId);

      if (!result) {
        return res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_FETCH_TRASH_ITEMS });
      }

      return res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.TRASH_ITEMS_FETCHED, result });
    } catch (error) {
      next(error);
    }
  }

  async movetoTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const { folderId, workspaceId, email } = req.body;

      if (!folderId) {
        return res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_FOLDER_ID });
      }

      const data = await this.directoryUsecase.moveToTrash(folderId, workspaceId, email);

      if (!data) {
        return res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_MOVE_TO_TRASH });
      }

      return res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDER_MOVED_TO_TRASH });
    } catch (error) {
      next(error);
    }
  }

  async restoreFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { folderId, email } = req.body;

      if (!folderId) {
        return res.status(400).json({ message: DIRECTORY_MESSAGES.ERROR.MISSING_FOLDER_ID });
      }

      const data = await this.directoryUsecase.restoreFolder(folderId, email);

      if (!data) {
        return res.status(404).json({ message: DIRECTORY_MESSAGES.ERROR.UNABLE_TO_RESTORE_FOLDER });
      }

      return res.status(200).json({ message: DIRECTORY_MESSAGES.SUCCESS.FOLDER_RESTORED, data });
    } catch (error) {
      next(error);
    }
  }
}