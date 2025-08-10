import { title } from "process";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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
    

    // @Column('array')
    // tags:string[]

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
}
