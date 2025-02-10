import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Lessonprice {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  lesson_uuid: string;
  @Column()
  lesson_price: number;
}
