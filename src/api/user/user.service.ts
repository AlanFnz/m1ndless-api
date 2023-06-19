import { User } from './user.entity';
import { AppDataSource } from '../../dataSource';
import { UserObject } from './user.types';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: UserObject['id']) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(userObject: UserObject) {
    const { firstName, lastName, age } = userObject;
    const user = Object.assign(new User(), {
      firstName,
      lastName,
      age,
    });

    return await this.userRepository.save(user);
  }

  async removeUser(id: UserObject['id']) {
    let userToRemove = await this.userRepository.findOne({ where: { id } });
    if (!userToRemove) throw Error('User does not exist');
    await this.userRepository.remove(userToRemove);
  }
}
