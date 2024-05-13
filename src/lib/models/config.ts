import { z } from 'zod';

export const applicationConfigSchema = z.object({
  deejConfigPath: z.string(),
});

export type ApplicationConfig = z.infer<typeof applicationConfigSchema>;
