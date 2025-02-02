import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Certificates {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userid: number

    @Column()
    certificate_path: string

}
