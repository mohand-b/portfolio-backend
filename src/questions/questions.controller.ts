import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './create-question.dto';
import { Question } from './question.entity';
import { QuestionStatus } from './question-status.enum';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionsService.create(createQuestionDto);
  }

  @Get(':uniqueId')
  async findOne(@Param('uniqueId') uniqueId: string): Promise<Question> {
    return this.questionsService.findOne(uniqueId);
  }

  @Get()
  async findByStatus(
    @Query('status') status?: QuestionStatus,
  ): Promise<Question[]> {
    return this.questionsService.findAll(status);
  }

  @Patch('answer/:uniqueId')
  async answer(
    @Param('uniqueId') uniqueId: string,
    @Body('response') response: string,
  ): Promise<Question> {
    return this.questionsService.answerQuestion(uniqueId, response);
  }

  @Patch('reject/:uniqueId')
  async reject(
    @Param('uniqueId') uniqueId: string,
    @Body('reason') reason: string,
  ): Promise<Question> {
    return this.questionsService.rejectQuestion(uniqueId, reason);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ detail: string }> {
    await this.questionsService.remove(id);
    return { detail: 'Question deleted successfully.' };
  }
}
