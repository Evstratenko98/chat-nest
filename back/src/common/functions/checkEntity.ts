import { IsNull, Repository } from 'typeorm';

export async function checkEntity<T>(
  repository: Repository<T>,
  options: any,
): Promise<T> {
  return await repository.findOne({
    where: {
      ...options,
      deletedAt: IsNull(),
    },
  });
}
