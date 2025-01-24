import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Emailcode {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    code: number

}