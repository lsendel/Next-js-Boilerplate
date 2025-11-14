import type { z } from 'zod';
import type { CounterValidation } from '@/shared/validators/counter.validator';

export const incrementCounter = async (
  data: z.infer<typeof CounterValidation>,
) => {
  const response = await fetch(`/api/counter`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to increment counter');
  }

  return response.json();
};
