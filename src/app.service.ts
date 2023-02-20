import AxiosDigestAuth from '@mhoc/axios-digest-auth/dist';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ODKCredential } from './interfaces/odk_credentials.interface';
import * as fs from 'node:fs';

@Injectable()
export class AppService {
  private readonly configs: Record<string, ODKCredential>;
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {
    const filePath = `${__dirname}/config.json`;
    if (fs.existsSync(filePath)) {
      this.configs = JSON.parse(fs.readFileSync(filePath).toString());
      this.logger.log('config.json loaded!');
    } else {
      this.logger.error('No config.json exists');
      process.exit(1);
    }
  }

  getODkCredentials(configId: string): ODKCredential {
    if (this.configs[configId] === undefined) {
      throw new BadRequestException(`${configId} configId does not exists`);
    }

    return this.configs[configId];
  }

  async getODKAggregateBinaryData(
    url: string,
    username: string,
    password: string,
  ): Promise<{ status: number; data: string }> {
    const digestAuth = new AxiosDigestAuth({
      username: username,
      password: password,
    });

    const resp = await digestAuth.request({
      method: 'GET',
      url: encodeURI(url),
      responseType: 'arraybuffer',
    });

    if (resp.status != 200) {
      this.logger.error(resp.statusText);
    }

    return {
      status: resp.status,
      data: resp.data,
    };
  }

  getContentTypeMap(): Record<string, string> {
    return {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      doc: 'application/msword',
      dot: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
      docm: 'application/vnd.ms-word.document.macroEnabled.12',
      dotm: 'application/vnd.ms-word.document.macroEnabled.12',
      xls: 'application/vnd.ms-excel',
      xlt: 'application/vnd.ms-excel',
      xla: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
      xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
      xltm: 'application/vnd.ms-excel.template.macroEnabled.12',
      xlam: 'application/vnd.ms-excel.addin.macroEnabled.12',
      xlsb: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
      ppt: 'application/vnd.ms-powerpoint',
      pot: 'application/vnd.ms-powerpoint',
      pps: 'application/vnd.ms-powerpoint',
      ppa: 'application/vnd.ms-powerpoint',
    };
  }

  getContentType(filename: string): string {
    const contentTypeMap = this.getContentTypeMap();
    let contentType = 'application/octet-stream';
    Object.keys(contentTypeMap).forEach((ct) => {
      if (filename.includes(ct)) {
        contentType = contentTypeMap[ct];
      }
    });

    return contentType;
  }
}
