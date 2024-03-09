import z from 'zod';

export const NOISE_REDUCTION_VALUES = ['low', 'default', 'high'] as const;

export const comPortSchema = z.string().startsWith('COM');
export const listOfComPortsSchema = z.array(comPortSchema);

export const settingsSchema = z.object({
  invert_sliders: z.boolean(),
  com_port: comPortSchema.nullable(),
  baud_rate: z.number().min(0),
  noise_reduction: z.enum(NOISE_REDUCTION_VALUES),
});

export type Settings = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  baud_rate: 9600,
  com_port: null,
  invert_sliders: false,
  noise_reduction: 'default',
};
