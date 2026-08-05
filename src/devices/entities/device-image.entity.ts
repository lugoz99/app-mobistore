import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./device.entity";

@Entity({name:'device_images'})

export class DeviceImage{

  @PrimaryGeneratedColumn()
  id:number;

  @Column('text')
  url:string;


  @ManyToOne(
    ()=>Device,
    (device) => device.images,
    {onDelete: 'CASCADE'}
  )
  device: Device
}