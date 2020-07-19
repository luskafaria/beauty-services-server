import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUserService: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to authenticate', async () => {
    const userPassword = await fakeHashProvider.generateHash('123456');

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'test@test.com',
      password: userPassword,
    });

    const response = await authenticateUser.execute({
      email: 'test@test.com',
      password: userPassword,
    });

    await expect(response).toHaveProperty('token');
    await expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a user that his password does not match', async () => {
    const userPassword = await fakeHashProvider.generateHash('123456');
    const differentPassword = 'abcdefg';

    await createUserService.execute({
      name: 'John Doe',
      email: 'test@test.com',
      password: userPassword,
    });

    await expect(
      authenticateUser.execute({
        email: 'test@test.com',
        password: differentPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
