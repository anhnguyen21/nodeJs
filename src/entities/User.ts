import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { AppRole } from './Role'

@Entity('app_user')
export class AppUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userName: string

  @Column()
  email: string

  @Column({ select: false })
  password: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  socialMediaLinks: string

  @Column({ nullable: true })
  facebookId: string

  @Column({ nullable: true })
  googleId: string

  @Column({ nullable: true })
  linkedinId: string

  @Column()
  isEnable: boolean

  @Column({ select: false })
  resetPasswordToken: string

  @Column({ select: false })
  resetPasswordTokenExpired: Date

  @Column({ select: false })
  verifiedAccountToken: string

  @Column({ select: false })
  verifiedAccountTokenExpired: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date

  @Column()
  createdBy: number

  @Column()
  modifiedBy: number

  @ManyToMany((_type) => AppRole, { nullable: true })
  @JoinTable({
    name: 'app_user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: {
      name: 'role_id'
    }
  })
  roles: AppRole[]
}
