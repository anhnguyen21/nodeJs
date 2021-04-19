import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { AppPrivilege } from './Privilege'

@Entity('app_role')
export class AppRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  globalRole: boolean

  @Column()
  projectRole: boolean

  @ManyToMany((_type) => AppPrivilege, { nullable: true })
  @JoinTable({
    name: 'app_role_privilege',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: {
      name: 'privilege_id'
    }
  })
  privileges: AppPrivilege[]
}
