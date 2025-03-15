import { NextFunction, Request, Response } from "express";
import { WorkspaceUsecase } from "../../applications/usecases/WorkspaceUsecase";
import { WORKSPACE_MESSAGES } from "../messages/workspaceMessages";

export class WorkspaceController {
  constructor(private workspaceUsecase: WorkspaceUsecase) {}

  async newWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { spaceName, userId } = req.body;

      const space = await this.workspaceUsecase.createSpace(spaceName, userId);

      if (!space) {
        return res.status(409).json({ message: WORKSPACE_MESSAGES.ERROR.WORKSPACE_EXISTS });
      }

      res.status(201).json({ message: WORKSPACE_MESSAGES.SUCCESS.WORKSPACE_CREATED, workspace: space });
      return;
    } catch (error: any) {
      if (error.message.includes("Workspace limit exceeded")) {
        return res.status(403).json({ message: WORKSPACE_MESSAGES.ERROR.WORKSPACE_LIMIT_EXCEEDED });
      }
      next(error);
    }
  }

  async getUserWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;

      let result = await this.workspaceUsecase.fetchWorkspace(userId);
      if (!result) {
        return res.status(404).json({ message: WORKSPACE_MESSAGES.ERROR.USER_NOT_FOUND });
      }

      return res.status(200).json({ message: WORKSPACE_MESSAGES.SUCCESS.WORKSPACE_FETCHED, workspace: result });
    } catch (error: any) {
      next(error);
    }
  }

  async addCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, workspaceId, invitedEmail } = req.body;

      if (!email || !workspaceId) {
        return res.status(400).json({ message: WORKSPACE_MESSAGES.ERROR.MISSING_FIELDS });
      }

      const result = await this.workspaceUsecase.addUsertoWorkspace(email, workspaceId, invitedEmail);
      if (!result) {
        return res.status(404).json({ message: WORKSPACE_MESSAGES.ERROR.COLLABORATOR_ADD_FAILED });
      }

      return res.status(200).json({ message: WORKSPACE_MESSAGES.SUCCESS.COLLABORATOR_ADDED, user: result });
    } catch (error: any) {
      next(error);
    }
  }

  async fetchCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.body;

      if (!workspaceId) {
        return res.status(400).json({ message: WORKSPACE_MESSAGES.ERROR.MISSING_FIELDS });
      }

      const space = await this.workspaceUsecase.findCollaborators(workspaceId);
      if (!space) {
        return res.status(404).json({ message: WORKSPACE_MESSAGES.ERROR.WORKSPACE_NOT_FOUND });
      }

      return res.status(200).json({ message: WORKSPACE_MESSAGES.SUCCESS.COLLABORATORS_FETCHED, user: space });
    } catch (error: any) {
      next(error);
    }
  }

  async renameworkspaceName(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, newName } = req.body;

      if (!workspaceId || !newName) {
        return res.status(400).json({ message: WORKSPACE_MESSAGES.ERROR.MISSING_FIELDS });
      }

      const space = await this.workspaceUsecase.updateSpaceName(workspaceId, newName);
      if (!space) {
        return res.status(404).json({ message: WORKSPACE_MESSAGES.ERROR.WORKSPACE_RENAME_FAILED });
      }

      return res.status(200).json({ message: WORKSPACE_MESSAGES.SUCCESS.WORKSPACE_RENAMED, space });
    } catch (error: any) {
      next(error);
    }
  }

  async removeCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, workspaceId } = req.body;

      if (!email || !workspaceId) {
        return res.status(400).json({ message: WORKSPACE_MESSAGES.ERROR.MISSING_FIELDS });
      }

      const space = await this.workspaceUsecase.removeCollaborator(email, workspaceId);
      if (!space) {
        return res.status(404).json({ message: WORKSPACE_MESSAGES.ERROR.COLLABORATOR_REMOVE_FAILED });
      }

      return res.status(200).json({ message: WORKSPACE_MESSAGES.SUCCESS.COLLABORATOR_REMOVED });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.body;

      if (!workspaceId) {
        return res.status(400).json({ message: WORKSPACE_MESSAGES.ERROR.MISSING_FIELDS });
      }

      const data = await this.workspaceUsecase.deleteWorkspace(workspaceId);
      if (!data) {
        return res.status(404).json({ message: WORKSPACE_MESSAGES.ERROR.WORKSPACE_DELETE_FAILED });
      }

      return res.status(200).json({ message: WORKSPACE_MESSAGES.SUCCESS.WORKSPACE_DELETED, data });
    } catch (error: any) {
      next(error);
    }
  }
}