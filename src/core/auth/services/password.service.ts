import { Injectable } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';

@Injectable()
export class PasswordService {
  public hashPassword(password: string): { salt: string; password: string } {
    const salt = this.createSalt();

    return {
      password: this.createHashPassword(password, salt),
      salt,
    };
  }

  public comparePassword(
    password: string,
    userPassword: string,
    userSalt: string,
  ): boolean {
    return this.createHashPassword(password, userSalt) === userPassword;
  }

  private createHashPassword(password: string, salt: string): string {
    return createHmac('sha512', salt).update(password).digest('hex');
  }

  private createSalt(): string {
    return createHash('sha512')
      .update(new Date().getTime().toString())
      .digest('hex');
  }
}
