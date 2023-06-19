import { AppDataSource } from '../../dataSource';
import { NextFunction, Request, Response } from 'express';
import { User } from './user.entity';
import { APIError } from '../../middlewares/error-handler/api-error';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from '../../constants';
export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await this.userRepository.find();
      response.status(HTTP_STATUS_CODES.OK).send(users);
    } catch (error) {
      next(
        new APIError(
          RESPONSE_MESSAGES.USERS_GET_FAIL,
          'all',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
      response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        errors: [RESPONSE_MESSAGES.USERS_GET_FAIL],
      });
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (user) {
        response.status(HTTP_STATUS_CODES.OK).send(user);
      } else {
        response.status(HTTP_STATUS_CODES.NOT_FOUND).send({
          errors: [RESPONSE_MESSAGES.USER_NOT_FOUND(request.body.id)],
        });
      }
    } catch (error) {
      next(
        new APIError(
          RESPONSE_MESSAGES.USER_GET_FAIL,
          'all',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
      response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        errors: [RESPONSE_MESSAGES.USER_GET_FAIL],
      });
    }
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { firstName, lastName, age } = request.body;

      const user = Object.assign(new User(), {
        firstName,
        lastName,
        age,
      });

      response.status(HTTP_STATUS_CODES.OK).send(user);
    } catch (error) {
      next(
        new APIError(
          RESPONSE_MESSAGES.USER_UPDATE_FAIL,
          'all',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
      response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        errors: [RESPONSE_MESSAGES.USER_CREATE_FAIL],
      });
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      let userToRemove = await this.userRepository.findOneBy({ id });

      if (!userToRemove) throw Error('User does not exist');
      await this.userRepository.remove(userToRemove);

      response.status(HTTP_STATUS_CODES.NO_CONTENT).send();
    } catch (error) {
      response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        errors: [RESPONSE_MESSAGES.USER_DELETE_FAIL],
      });
    }
  }
}

