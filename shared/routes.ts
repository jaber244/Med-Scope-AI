import { z } from 'zod';
import { insertInquirySchema, inquiries } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  followUp: {
    method: 'POST' as const,
    path: '/api/follow-up',
    input: z.object({
      symptoms: z.string().min(2, "Please describe your symptoms"),
      age: z.string().optional(),
      hadBefore: z.string().optional(),
      howManyTimes: z.string().optional(),
    }),
    responses: {
      200: z.object({
        questions: z.array(z.object({
          id: z.string(),
          question: z.string(),
          options: z.array(z.string()),
        })),
      }),
      400: errorSchemas.validation,
      500: errorSchemas.internal,
    },
  },
  analyze: {
    method: 'POST' as const,
    path: '/api/analyze',
    input: z.object({
      symptoms: z.string().min(2, "Please describe your symptoms"),
      age: z.string().regex(/^\d{1,3}$/, "Please enter a valid age").optional().or(z.literal("")),
      hadBefore: z.string().optional(),
      howManyTimes: z.string().optional(),
      followUpAnswers: z.array(z.object({
        question: z.string(),
        answers: z.array(z.string()),
      })).optional(),
    }),
    responses: {
      200: z.object({
        analysis: z.string(),
        isSevere: z.boolean(),
        inquiryId: z.number(),
      }),
      400: errorSchemas.validation,
      500: errorSchemas.internal,
    },
  },
  analyzeVision: {
    method: 'POST' as const,
    path: '/api/analyze-vision',
    input: z.object({
      image: z.string().min(1, "Image is required"),
      symptoms: z.string().optional(),
      age: z.string().optional(),
      hadBefore: z.string().optional(),
      howManyTimes: z.string().optional(),
      followUpAnswers: z.array(z.object({
        question: z.string(),
        answers: z.array(z.string()),
      })).optional(),
    }),
    responses: {
      200: z.object({
        analysis: z.string(),
        isSevere: z.boolean(),
        inquiryId: z.number(),
      }),
      400: errorSchemas.validation,
      500: errorSchemas.internal,
    },
  },
  askFollowUp: {
    method: 'POST' as const,
    path: '/api/ask-followup',
    input: z.object({
      inquiryId: z.number(),
      question: z.string().min(2, "Please enter a question"),
      conversationHistory: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
    }),
    responses: {
      200: z.object({
        answer: z.string(),
      }),
      400: errorSchemas.validation,
      404: errorSchemas.notFound,
      500: errorSchemas.internal,
    },
  },
  inquiries: {
    get: {
      method: 'GET' as const,
      path: '/api/inquiries/:id',
      responses: {
        200: z.custom<typeof inquiries.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AnalyzeInput = z.infer<typeof api.analyze.input>;
export type AnalyzeResponse = z.infer<typeof api.analyze.responses[200]>;
export type VisionInput = z.infer<typeof api.analyzeVision.input>;
