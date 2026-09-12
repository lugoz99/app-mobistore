import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeviceImage } from './device-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

@Entity({ name: 'devices' })
export class Device {
  @ApiProperty({
    example: '041afad2-3bdb-4b4b-ac5f-f4f649752e21',
    description: 'Devide Id',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-mobile store',
    description: 'Device model name',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  modelName: string;

  @ApiProperty({
    example: 0,
    description: 'Current device price in the catalog',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty()
  @Column('text', {
    nullable: true,
  })
  technicalDetails: string;

  @ApiProperty({
    example: 't_mobile_4T',
    description: 'Device slug for ceo',
    uniqueItems: true,
  })
  // url
  @Column('text', {
    unique: true,
  })
  modelSlug: string;

  @ApiProperty()
  @Column('int', {
    default: 0,
  })
  unitsInStock: number;

  @ApiProperty()
  @Column('text', {
    array: true,
  })
  availableColor: string[];

  @ApiProperty({
    example: ['premium', 'budget', 'mid-range', 'flagship'],
  })
  @Column('text')
  targetMarket: string;

  @ApiProperty()
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  accessoriesIncluded: string[];

  @ApiProperty()
  // Relationships
  @OneToMany(
    () => DeviceImage,
    (deviceImage) => deviceImage.device,
    { cascade: true, eager: true }, // eager true -> con find* | load images | pero si uso querybilder no funciona
  )
  images?: DeviceImage[];

  // eager traiga la relacion
  @ManyToOne(() => User, (user) => user.devices, { eager: true })
  user?: User;

  @ManyToOne(() => Category, (category) => category.devices)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.device)
  orderItems: OrderItem[];

  @BeforeInsert()
  checkModelSlugInsert() {
    if (!this.modelSlug) {
      this.modelSlug = this.modelName;
    }
    this.modelSlug = this.modelSlug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.modelSlug = this.modelSlug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
