import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Teacherbank {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  teacher_id: number;
  @Column()
  amount: number;
}
