import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update users profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Mayer',
      email: 'johnmayer@test.com',
    });

    expect(updatedUser.name).toBe('John Mayer');
    expect(updatedUser.email).toBe('johnmayer@test.com');
  });

  it('should not be able to update users profile of a non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing-id',
        name: 'John Doe',
        email: 'test@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to use an already picked email address', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Teste',
      email: 'johntest@test.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Teste',
        email: 'test@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update users password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Mayer',
      email: 'johnmayer@test.com',
      password: '123456',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update users password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Mayer',
        email: 'johnmayer@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update users password with mismatch old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Mayer',
        email: 'johnmayer@test.com',
        old_password: 'mismatch_password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
