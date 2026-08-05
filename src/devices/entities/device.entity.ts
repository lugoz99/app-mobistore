import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DeviceImage } from "./device-image.entity";


@Entity()
export class Device { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique:true
    })
    modelName: string;


    @Column('float', {
        default:0
    })
    price: number;

    @Column('text', {
        nullable:true
    })
    technicalDetails: string
    
    // url
    @Column('text', {
        unique: true,
    })
    modelSlug: string;

    @Column('int', {
        default:0
    })
    unitsInStock: number;

    @Column('text', {
        array:true
    })
    availableColor: string[]
    
    @Column('text')
    targetMarket: string
    

    @Column({
        type: 'text',
        array: true,
        default:[]
    })
    accessoriesIncluded:string[]


    // Relationships
    @OneToMany(
        ()=>DeviceImage,
        (devicImage)=>devicImage.device,
        {cascade:true, eager: true} // eager true -> con find* | load images | pero si uso querybilder no funciona
    )
    images?: DeviceImage[]

    @BeforeInsert()
    checkModelSlugInsert() {
        if ( !this.modelSlug ) {
            this.modelSlug = this.modelName
        }
        this.modelSlug = this.modelSlug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'",'')
    }


    @BeforeUpdate()
    checkSlugUpdate() {
        this.modelSlug = this.modelSlug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
