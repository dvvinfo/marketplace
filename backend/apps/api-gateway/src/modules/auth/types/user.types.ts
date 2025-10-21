import { User } from '@modules/user/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;
