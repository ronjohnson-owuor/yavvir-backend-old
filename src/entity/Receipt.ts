import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Receipt {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    customer_id: number

    @Column()
    receipt: string

    @Column()
    refference: string

    @Column({default:false})
    paid:boolean




}
