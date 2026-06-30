import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type AnalyzeInput, type VisionInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Helper to handle API requests safely
async function handleRequest<T>(promise: Promise<Response>, schema: any): Promise<T> {
  const res = await promise;
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "An error occurred");
  }
  const data = await res.json();
  // Validate with Zod schema if provided
  if (schema) {
    return schema.parse(data);
  }
  return data as T;
}

// Hook for fetching a single inquiry result
export function useInquiry(id: number) {
  return useQuery({
    queryKey: [api.inquiries.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.inquiries.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch inquiry");
      return api.inquiries.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

// Hook for analyzing symptoms (Text)
export function useAnalyzeSymptom() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: AnalyzeInput) => {
      // Validate input before sending
      const validated = api.analyze.input.parse(data);
      
      const res = await fetch(api.analyze.path, {
        method: api.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Analysis failed");
      }

      return api.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed successfully.",
      });
      setLocation(`/result/${data.inquiryId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook for analyzing vision (Image + Text)
export function useAnalyzeVision() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: VisionInput) => {
      const validated = api.analyzeVision.input.parse(data);

      const res = await fetch(api.analyzeVision.path, {
        method: api.analyzeVision.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Vision analysis failed");
      }

      return api.analyzeVision.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({
        title: "Vision Analysis Complete",
        description: "Your image has been analyzed successfully.",
      });
      setLocation(`/result/${data.inquiryId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
