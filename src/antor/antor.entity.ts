import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class userTbl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  phone: string;

  @Column({ length: 500 })
  type: string;

  @Column({ nullable: true })
  otp:string;
  
  @Column({ nullable: true })
  status:string;


  @OneToMany(()=>PropertyTbl,(PropertyTbl)=>PropertyTbl.user)
  Properties:PropertyTbl[]
}


@Entity()
export class PropertyTbl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 500 })
  location: string;

  @Column()
  rent: number;

  @Column()
  sellerId: number;

  @Column({ nullable: true })
  status:string;

  @ManyToOne(()=>userTbl,(userTbl)=>userTbl.Properties)
  user:userTbl
}

