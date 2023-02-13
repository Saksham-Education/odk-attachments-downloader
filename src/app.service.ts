import AxiosDigestAuth from '@mhoc/axios-digest-auth/dist';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getODKBinaryData(url: string): Promise<any> {
    const digestAuth = new AxiosDigestAuth({
      username: this.configService.getOrThrow('ODK_USERNAME'),
      password: this.configService.getOrThrow('ODK_PASSWORD'),
    });

    const resp = await digestAuth.request({
      method: 'GET',
      url: encodeURI(url),
      headers: {
        Accept: '*/*',
      },
      responseType: 'arraybuffer',
    });

    if (resp.status != 200) {
      this.logger.error(resp.statusText);
    }

    // console.log(resp.data);

    return {
      status: resp.status,
      data: resp.data,
    };
  }
}
