import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class TeacherFinancetracker {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    teacher_id:number
    @Column()
    status:number
    @Column()
    amount:number

}