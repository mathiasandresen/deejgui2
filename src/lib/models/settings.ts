import z from 'zod';

export const NOISE_REDUCTION_VALUES = ['low', 'default', 'high'] as const;

export const COMPortSchema = z.string().startsWith('COM');
export const ListOfCOMPortsSchema = z.array(COMPortSchema);

export const SliderSchema = z.array(z.string()).or(z.string());
export type Slider = z.infer<typeof SliderSchema>;
export const SliderMappingSchema = z.record(z.string(), SliderSchema);
export type SliderMapping = z.infer<typeof SliderMappingSchema>;

export const SettingsSchema = z.object({
  invert_sliders: z.boolean(),
  com_port: COMPortSchema.nullable(),
  baud_rate: z.number().min(0),
  noise_reduction: z.enum(NOISE_REDUCTION_VALUES),
  slider_mapping: SliderMappingSchema,
});

export type Settings = z.infer<typeof SettingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  baud_rate: 9600,
  com_port: null,
  invert_sliders: false,
  noise_reduction: 'default',
  slider_mapping: {},
};
