import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Teacherdetails {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id:number

    @Column({nullable:true})
    certificates: number  //link that specifies certificates of the teacher

    @Column({default:false})
    ground_tutor: boolean

    @Column({nullable:true})
    location: string


    @Column({nullable:true})
    school: string
    
    @Column({nullable:true})
    subjects: string

    @Column({nullable:true})
    bio: string

    @Column({nullable:true})
    extra_info: string

    @Column({default:false})
    premium:boolean

}