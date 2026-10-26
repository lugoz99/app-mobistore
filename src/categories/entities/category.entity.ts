import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device } from '../../devices/entities';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @OneToMany(() => Device, (device) => device.category)
  devices: Device[];

  @BeforeInsert()
  checkNameBeforeInsert() {
    this.name = this.name.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkNameBeforeUpdate() {
    this.name = this.name.toLocaleLowerCase().trim();
  }
}
