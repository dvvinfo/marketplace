import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum E_Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Column({ name: 'name_first', type: 'varchar' })
  nameFirst: string;

  @Column({ name: 'name_last', type: 'varchar' })
  nameLast: string;

  @Column({ name: 'birth_date', type: 'timestamp', nullable: true })
  birthDate: Date | null;

  @Column({ name: 'gender', type: 'enum', enum: E_Gender, nullable: true })
  gender: E_Gender | null;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
