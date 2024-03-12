import { z } from 'zod';

export const ProcessSchema = z.object({
  pid: z.number(),
  parent_pid: z.number().nullable(),
  name: z.string(),
  window: z.string().nullable(),
  icon: z.string().nullable().optional(),
  exe: z.string(),
});

export type Process = z.infer<typeof ProcessSchema>;
