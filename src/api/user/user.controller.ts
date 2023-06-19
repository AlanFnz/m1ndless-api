import { NextFunction, Request, Response } from 'express';
import { APIError } from '../../middlewares/error-handler/api-error';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from '../../constants';
import { UserService } from './user.service';
export class UserController {
  private userService = new UserService();

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      response.status(HTTP_STATUS_CODES.OK).send(users);
    } catch (error) {
      next(
        new APIError(
          RESPONSE_MESSAGES.USERS_GET_FAIL,
          'all',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id, 10);
      const user = await this.userService.getUserById(id);

      if (user) {
        response.status(HTTP_STATUS_CODES.OK).send(user);
      } else {
        response.status(HTTP_STATUS_CODES.NOT_FOUND).send({
          errors: [RESPONSE_MESSAGES.USER_NOT_FOUND(id.toString())],
        });
      }
    } catch (error) {
      next(
        new APIError(
          RESPONSE_MESSAGES.USER_GET_FAIL,
          'one',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await this.userService.createUser(request.body);
      response.status(HTTP_STATUS_CODES.CREATED).send(user);
    } catch (error) {
      next(
        new APIError(
          RESPONSE_MESSAGES.USER_CREATE_FAIL,
          'save',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id, 10);
      await this.userService.removeUser(id);
      response.status(HTTP_STATUS_CODES.NO_CONTENT).send();
    } catch (error) {
      next(
        new APIError(
          RESPONSE_MESSAGES.USER_DELETE_FAIL,
          'remove',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
}

