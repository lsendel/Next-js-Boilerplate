import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { counter } from '@/server/db/models/Schema';

export const getCounter = async (id: number) => {
  const result = await db.query.counter.findFirst({
    where: eq(counter.id, id),
  });
  const count = result?.count ?? 0;

  logger.info('Counter fetched successfully');

  return count;
};
