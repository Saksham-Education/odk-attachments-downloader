import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { PreviewDto } from './dto/preview.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  async preview(@Query() queryParams: PreviewDto, @Res() response: Response) {
    const config = this.appService.getODkCredentials(queryParams.configId);
    let resp: { status: number; data: string } | null = null;

    if (config.odkType === 'aggregate') {
      resp = await this.appService.getODKAggregateBinaryData(
        queryParams.url,
        config.odkUsername,
        config.odkPassword,
      );
    }

    if (!resp) {
      return response.send('Something went wrong').status(500);
    }

    if (resp.status !== 200) {
      return response.send(resp.data).status(resp.status);
    }

    let contentType: string;
    if (queryParams.type && queryParams.type !== 'application/octet-stream') {
      contentType = queryParams.type;
    } else {
      contentType = this.appService.getContentType(queryParams.filename);
    }

    response.set({
      'Content-Type': contentType,
    });

    return response.send(resp.data);
  }

  @Post('/submission')
  pocODKSubmission(@Body() body: { [K: string]: any }) {
    console.log('serialized', JSON.stringify(body));
    this.logger.log(body);
    console.log(body);
  }
}
