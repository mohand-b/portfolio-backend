import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionStatus } from './question-status.enum';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uniqueId: string;

  @Column('text')
  questionText: string;

  @Column({
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.PENDING,
  })
  status: QuestionStatus;

  @Column('text', { nullable: true })
  responseOrReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
