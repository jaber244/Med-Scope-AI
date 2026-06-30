import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAnalyzeSymptom } from "@/hooks/use-inquiries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Loader2, AlertCircle, ArrowRight, ArrowLeft, User, ClipboardList, CheckCircle2, History } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  symptoms: z.string().min(2, "Please describe your symptoms."),
  age: z.string().optional(),
  hadBefore: z.string().optional(),
  howManyTimes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type FollowUpQuestion = {
  id: string;
  question: string;
  options: string[];
};

type SelectedAnswers = Record<string, string[]>;

export default function SymptomChecker() {
  const [step, setStep] = useState<"input" | "followup" | "analyzing">("input");
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [symptomsData, setSymptomsData] = useState<FormValues>({ symptoms: "", age: "" });
  const { mutate: analyze, isPending } = useAnalyzeSymptom();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { symptoms: "", age: "", hadBefore: "", howManyTimes: "" }
  });

  const toggleAnswer = (questionId: string, option: string) => {
    setSelectedAnswers(prev => {
      const current = prev[questionId] || [];
      const updated = current.includes(option)
        ? current.filter(a => a !== option)
        : [...current, option];
      return { ...prev, [questionId]: updated };
    });
  };

  const fetchFollowUpQuestions = async (data: FormValues) => {
    setSymptomsData(data);
    setLoadingQuestions(true);
    try {
      const res = await fetch(api.followUp.path, {
        method: api.followUp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: data.symptoms,
          age: data.age,
          hadBefore: data.hadBefore,
          howManyTimes: data.howManyTimes,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to get questions");
      const result = api.followUp.responses[200].parse(await res.json());
      setQuestions(result.questions || []);
      setSelectedAnswers({});
      setStep("followup");
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not generate follow-up questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const submitFinalAnalysis = () => {
    const followUpAnswers = questions
      .filter(q => (selectedAnswers[q.id] || []).length > 0)
      .map(q => ({
        question: q.question,
        answers: selectedAnswers[q.id],
      }));

    analyze({
      symptoms: symptomsData.symptoms,
      age: symptomsData.age,
      hadBefore: symptomsData.hadBefore,
      howManyTimes: symptomsData.howManyTimes,
      followUpAnswers,
    });
  };

  const answeredCount = Object.values(selectedAnswers).filter(a => a.length > 0).length;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-blue-100 text-primary dark:bg-blue-900/20">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display">Symptom Checker</h1>
            <p className="text-muted-foreground">Describe how you're feeling to get an AI analysis.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${step === "input" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-primary-foreground/20 text-[10px]">1</span>
            Describe
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${step === "followup" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-primary-foreground/20 text-[10px]">2</span>
            Details
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${isPending ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-primary-foreground/20 text-[10px]">3</span>
            Results
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Enter Symptoms</CardTitle>
                  <CardDescription>
                    Be as specific as possible. Include duration, severity, and any other relevant details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(fetchFollowUpQuestions)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Age
                        <Badge variant="outline" className="text-[10px] font-normal">Optional</Badge>
                      </label>
                      <Input
                        {...form.register("age")}
                        type="number"
                        placeholder="e.g., 25"
                        className="max-w-[140px]"
                        data-testid="input-age"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <History className="w-4 h-4 text-muted-foreground" />
                        Have you had this before?
                        <Badge variant="outline" className="text-[10px] font-normal">Optional</Badge>
                      </label>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Select
                          value={form.watch("hadBefore") || ""}
                          onValueChange={(val) => {
                            form.setValue("hadBefore", val);
                            if (val === "no") form.setValue("howManyTimes", "");
                          }}
                        >
                          <SelectTrigger className="w-[140px]" data-testid="select-had-before">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.watch("hadBefore") === "yes" && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">How many times?</span>
                            <Select
                              value={form.watch("howManyTimes") || ""}
                              onValueChange={(val) => form.setValue("howManyTimes", val)}
                            >
                              <SelectTrigger className="w-[140px]" data-testid="select-how-many">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="once">Once</SelectItem>
                                <SelectItem value="2-3">2-3 times</SelectItem>
                                <SelectItem value="4-5">4-5 times</SelectItem>
                                <SelectItem value="many">Many times</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Symptoms</label>
                      <Textarea
                        {...form.register("symptoms")}
                        placeholder="e.g., I have had a throbbing headache on the left side for 2 days, accompanied by nausea..."
                        className="min-h-[180px] resize-none text-base"
                        data-testid="input-symptoms"
                      />
                      {form.formState.errors.symptoms && (
                        <p className="text-sm text-destructive font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {form.formState.errors.symptoms.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full md:w-auto px-8 rounded-full font-semibold shadow-lg shadow-primary/20"
                        disabled={loadingQuestions}
                        data-testid="button-next"
                      >
                        {loadingQuestions ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Preparing Questions...
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Be Specific</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Mention where it hurts, how long it's been happening, and if it comes and goes.</p>
                </div>
                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Related Factors</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Include details about recent travel, diet changes, or existing medical conditions.</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === "followup" && (
            <motion.div
              key="followup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Follow-Up Questions</CardTitle>
                      <CardDescription>
                        Select all that apply to help us give you a more accurate analysis.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {answeredCount} of {questions.length} answered
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.map((q, qIndex) => (
                    <div key={q.id} className="space-y-3">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {qIndex + 1}
                        </span>
                        {q.question}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                        {q.options.map((option) => {
                          const isSelected = (selectedAnswers[q.id] || []).includes(option);
                          return (
                            <label
                              key={option}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm hover-elevate ${
                                isSelected
                                  ? "border-primary bg-primary/5 text-foreground"
                                  : "border-border text-muted-foreground"
                              }`}
                              data-testid={`option-${q.id}-${option}`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleAnswer(q.id, option)}
                              />
                              <span>{option}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-primary ml-auto shrink-0" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      onClick={() => setStep("input")}
                      className="gap-2"
                      data-testid="button-back"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={submitFinalAnalysis}
                      className="rounded-full font-semibold shadow-lg shadow-primary/20 gap-2"
                      disabled={isPending}
                      data-testid="button-analyze"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Stethoscope className="w-4 h-4" />
                          Get Analysis
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
