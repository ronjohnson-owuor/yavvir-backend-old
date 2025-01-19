import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userid: number

    @Column()
    token_value: string

}
