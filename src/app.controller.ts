import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async viewBinaryData(
    @Query('url') url: string,
    @Query('filename') filename: string,
    @Query('type') type: string,
    @Res() response: Response,
  ) {
    const resp: {
      status: number;
      data: any;
    } = await this.appService.getODKBinaryData(url);
    if (resp.status !== 200) {
      return response.send(resp.data).status(resp.status);
    }

    let contentType = type;
    // let contentDisposition = `attachment; filename=${filename}`;

    if (type == 'application/octet-stream') {
      if (filename.includes('pdf')) {
        contentType = 'application/pdf';
        // contentDisposition = 'attachment; filename=myfile.pdf';
      } else if (filename.includes('docx')) {
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (filename.includes('jpg')) {
        contentType = 'image/jpeg';
      }
    }

    response.set({
      'Content-Type': contentType,
      // 'Content-Disposition': contentDisposition,
    });

    return response.send(resp.data);
  }
}
