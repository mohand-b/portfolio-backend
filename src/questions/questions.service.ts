import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionStatus } from './question-status.enum';

const ANIMAL_NAMES: string[] = ['lion', 'tiger', 'bear', 'shark', 'eagle'];

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const uniqueId: string = await this.generateUniqueQuestionId();
    const question: Question = this.questionsRepository.create({
      ...createQuestionDto,
      uniqueId,
      status: QuestionStatus.PENDING,
    });
    return this.questionsRepository.save(question);
  }

  async findAll(status?: QuestionStatus): Promise<Question[]> {
    if (status) {
      return this.questionsRepository.find({ where: { status } });
    }
    return this.questionsRepository.find();
  }

  async findOne(uniqueId: string): Promise<Question> {
    const question: Question = await this.questionsRepository.findOne({
      where: { uniqueId },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async remove(id: number): Promise<void> {
    const result = await this.questionsRepository.delete({
      id,
      status: QuestionStatus.PENDING,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Question not found or not in pending status',
      );
    }
  }

  async answerQuestion(uniqueId: string, response: string): Promise<Question> {
    const question: Question = await this.findOne(uniqueId);
    if (question.status !== QuestionStatus.PENDING) {
      throw new BadRequestException('Only pending questions can be answered');
    }
    question.status = QuestionStatus.ANSWERED;
    question.responseOrReason = response;
    return this.questionsRepository.save(question);
  }

  async rejectQuestion(uniqueId: string, reason: string): Promise<Question> {
    const question: Question = await this.findOne(uniqueId);
    if (question.status !== QuestionStatus.PENDING) {
      throw new BadRequestException('Only pending questions can be rejected');
    }
    question.status = QuestionStatus.REJECTED;
    question.responseOrReason = reason;
    return this.questionsRepository.save(question);
  }

  private async generateUniqueQuestionId(): Promise<string> {
    const randomInt = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min)) + min;
    let uniqueId: string;
    while (true) {
      const animal: string =
        ANIMAL_NAMES[randomInt(0, ANIMAL_NAMES.length)].toUpperCase();
      const number: number = randomInt(100, 1000);
      uniqueId = `${animal}${number}`;
      const existingQuestion: Question | undefined =
        await this.questionsRepository.findOne({ where: { uniqueId } });
      if (!existingQuestion) {
        break;
      }
    }
    return uniqueId;
  }
}
