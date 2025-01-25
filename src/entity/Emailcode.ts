import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Emailcode {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    code: number

    @CreateDateColumn({type:'timestamp'})
    createdAt:Date

}