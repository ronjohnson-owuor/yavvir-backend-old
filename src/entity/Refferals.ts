import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Refferals {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userid: number

    @Column()
    ref_value: string

}
