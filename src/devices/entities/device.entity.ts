import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeviceImage } from './device-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'devices' })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  modelName: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('text', {
    nullable: true,
  })
  technicalDetails: string;

  // url
  @Column('text', {
    unique: true,
  })
  modelSlug: string;

  @Column('int', {
    default: 0,
  })
  unitsInStock: number;

  @Column('text', {
    array: true,
  })
  availableColor: string[];

  @Column('text')
  targetMarket: string;

  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  accessoriesIncluded: string[];

  // Relationships
  @OneToMany(
    () => DeviceImage,
    (devicImage) => devicImage.device,
    { cascade: true, eager: true }, // eager true -> con find* | load images | pero si uso querybilder no funciona
  )
  images?: DeviceImage[];

  // eager traiga la relacion
  @ManyToOne(() => User, (user) => user.devices, { eager: true })
  user?: User;

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
