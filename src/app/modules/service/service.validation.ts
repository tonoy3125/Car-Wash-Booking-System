import { z } from 'zod'

const createServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    description: z.string({ required_error: 'Description is required' }),
    price: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val), {
        message: 'Price must be a valid number',
      }),
    duration: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val), {
        message: 'Duration Time must be a valid number',
      }),
    durationUnit: z.string({ required_error: 'Duration Unit is required' }),
    isDeleted: z.boolean().optional(),
  }),
})

const updateServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    price: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val), {
        message: 'Price must be a valid number',
      })
      .optional(),
    duration: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val), {
        message: 'Duration Time must be a valid number',
      })
      .optional(),
    durationUnit: z
      .string({ required_error: 'Duration Unit is required' })
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
})

export const ServiceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
}
