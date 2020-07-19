import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to change user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'test.jpg',
    });

    expect(user.avatar).toBe('test.jpg');
  });

  it('should not be able to change user avatar from a non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: '123',
        avatarFilename: 'test.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete a existing user avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    user.avatar = 'existing.png';

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'test.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('existing.png');
    expect(user.avatar).toBe('test.jpg');
  });
});
