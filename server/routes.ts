import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { db } from "./db";
import * as schema from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.followUp.path, async (req, res) => {
    try {
      const { symptoms, age, hadBefore, howManyTimes } = api.followUp.input.parse(req.body);

      const recurrenceInfo = hadBefore === "yes" 
        ? `The patient has experienced this before${howManyTimes ? ` (${howManyTimes} times)` : ""}.`
        : hadBefore === "no" ? "This is the first time the patient is experiencing this." : "";

      const prompt = `
        You are MedScope AI, a medical assistant. A patient describes these symptoms: "${symptoms}".
        ${age ? `Patient age: ${age} years old.` : ""}
        ${recurrenceInfo}
        
        Generate 3-4 relevant follow-up questions to better understand their condition.
        Each question should have 3-5 selectable options the patient can choose from (they can pick multiple).
        
        Return JSON format:
        {
          "questions": [
            {
              "id": "q1",
              "question": "How long have you been experiencing these symptoms?",
              "options": ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week", "More than a month"]
            }
          ]
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      res.json({ questions: result.questions || [] });

    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to generate follow-up questions." });
      }
    }
  });

  app.post(api.analyze.path, async (req, res) => {
    try {
      const { symptoms, age, hadBefore, howManyTimes, followUpAnswers } = api.analyze.input.parse(req.body);

      const recurrenceInfo = hadBefore === "yes" 
        ? `The patient has experienced this before${howManyTimes ? ` (${howManyTimes} times)` : ""}.`
        : hadBefore === "no" ? "This is the first time the patient is experiencing this." : "";

      let followUpContext = "";
      if (followUpAnswers && followUpAnswers.length > 0) {
        followUpContext = "\n\nFollow-up information provided by the patient:\n" +
          followUpAnswers.map(a => `- ${a.question}: ${a.answers.join(", ")}`).join("\n");
      }

      const prompt = `
        You are MedScope AI, a helpful medical assistant. 
        ${age ? `Patient age: ${age} years old.` : ""}
        ${recurrenceInfo}
        Analyze the following symptoms: "${symptoms}".
        ${followUpContext}
        
        Provide a structured response with:
        1. Analysis: Potential causes and explanation.
        2. Action Plan: Clear steps on what to do next.
        3. Safety Alerts: Important warning signs or red flags.
        
        If the symptoms indicate a medical emergency or severe condition, set 'isSevere' to true.
        
        Return JSON format: { "analysis": "string (markdown allowed)", "isSevere": boolean }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      
      const inquiry = await storage.createInquiry({
        symptoms,
        response: result.analysis || "Analysis failed.",
        type: "text",
        isSevere: result.isSevere || false,
      });

      res.json({
        analysis: inquiry.response,
        isSevere: inquiry.isSevere ?? false,
        inquiryId: inquiry.id,
      });

    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to analyze symptoms." });
      }
    }
  });

  app.post(api.analyzeVision.path, async (req, res) => {
    try {
      const { image, symptoms, age, hadBefore, howManyTimes, followUpAnswers } = api.analyzeVision.input.parse(req.body);

      const recurrenceInfo = hadBefore === "yes" 
        ? `The patient has experienced this before${howManyTimes ? ` (${howManyTimes} times)` : ""}.`
        : hadBefore === "no" ? "This is the first time the patient is experiencing this." : "";

      let followUpContext = "";
      if (followUpAnswers && followUpAnswers.length > 0) {
        followUpContext = "\n\nFollow-up information provided by the patient:\n" +
          followUpAnswers.map(a => `- ${a.question}: ${a.answers.join(", ")}`).join("\n");
      }

      const prompt = `
        You are MedScope AI. Analyze this medical image.
        ${age ? `Patient age: ${age} years old.` : ""}
        ${recurrenceInfo}
        ${symptoms ? `Patient symptoms: "${symptoms}"` : ""}
        ${followUpContext}
        
        Provide:
        1. Analysis: Describe what you see and potential conditions.
        2. Action Plan: Recommended next steps.
        3. Safety Alerts: Warning signs.
        
        Disclaimer: You are an AI, not a doctor.
        If it looks severe, set 'isSevere' to true.
        
        Return JSON format: { "analysis": "string (markdown allowed)", "isSevere": boolean }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");

      const inquiry = await storage.createInquiry({
        symptoms: symptoms || "Image Analysis",
        response: result.analysis || "Analysis failed.",
        type: "vision",
        imageUrl: "Image uploaded", // Don't store full base64 in DB for now to save space, or maybe we should? Schema has text, base64 might be too large for 'text' column depending on DB. Postgres TEXT is fine but let's keep it simple.
        isSevere: result.isSevere || false,
      });

      res.json({
        analysis: inquiry.response,
        isSevere: inquiry.isSevere ?? false,
        inquiryId: inquiry.id,
      });

    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to analyze image." });
      }
    }
  });

  app.post(api.askFollowUp.path, async (req, res) => {
    try {
      const { inquiryId, question, conversationHistory } = api.askFollowUp.input.parse(req.body);

      const inquiry = await storage.getInquiry(inquiryId);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }

      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        {
          role: "system",
          content: `You are MedScope AI, a helpful medical assistant. The user previously received the following analysis for their symptoms:

Symptoms: "${inquiry.symptoms}"
Analysis: ${inquiry.response}

Answer the user's follow-up questions about this analysis. Be concise, helpful, and medically informative. Always remind them that you are an AI and not a substitute for professional medical advice. Use markdown formatting for readability.`,
        },
      ];

      if (conversationHistory && conversationHistory.length > 0) {
        for (const msg of conversationHistory) {
          messages.push({ role: msg.role, content: msg.content });
        }
      }

      messages.push({ role: "user", content: question });

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages,
      });

      const answer = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
      res.json({ answer });

    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to answer follow-up question." });
      }
    }
  });

  app.get(api.inquiries.get.path, async (req, res) => {
    const inquiry = await storage.getInquiry(Number(req.params.id));
    if (!inquiry) return res.status(404).json({ message: "Not found" });
    res.json(inquiry);
  });

  // Seed data
  const existingInquiries = await db.select().from(schema.inquiries).limit(1);
  if (existingInquiries.length === 0) {
    await storage.createInquiry({
      symptoms: "Mild headache and fatigue",
      response: JSON.stringify({
        analysis: "Common tension headache or dehydration.",
        actionPlan: "Drink water, rest, take over-the-counter pain relief.",
        safetyAlerts: "Seek help if headache becomes severe or is accompanied by vision changes."
      }),
      type: "text",
      isSevere: false,
    });
    console.log("Seeded database with example inquiry");
  }

  return httpServer;
}
