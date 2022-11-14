import { HttpException, HttpStatus } from '@nestjs/common';

export const createError = (status: HttpStatus, error: string) => {
  throw new HttpException(
    {
      status,
      error,
    },
    status,
  );
};
