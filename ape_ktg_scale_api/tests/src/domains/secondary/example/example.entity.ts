import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Example {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 500 })
  name!: string;

  @Column("text")
  description!: string;
}
