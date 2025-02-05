import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Lesson {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    lesson_name: string

    @Column()
    lesson_uuid: string

    @Column()
    duration: number

    @Column()
    creator: number
    
    @Column()
    start_time: Date

    @Column({default:false})
    expired: boolean

}
