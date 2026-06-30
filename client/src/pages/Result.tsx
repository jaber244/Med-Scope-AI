import { useState, useRef, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useInquiry } from "@/hooks/use-inquiries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, ArrowLeft, ShieldAlert, Send, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Result() {
  const [match, params] = useRoute("/result/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: inquiry, isLoading, error } = useInquiry(id);
  const { toast } = useToast();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleAskQuestion = async () => {
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setQuestion("");
    setIsAsking(true);

    try {
      const res = await fetch(api.askFollowUp.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: id,
          question: trimmed,
          conversationHistory: chatMessages,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to get answer");

      const result = api.askFollowUp.responses[200].parse(await res.json());
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.answer },
      ]);
    } catch {
      toast({
        title: "Error",
        description: "Could not get a response. Please try again.",
        variant: "destructive",
      });
      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-12 w-64 mb-8 rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full rounded-2xl" />
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="inline-flex p-4 rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Analysis Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't retrieve the results for this inquiry.</p>
        <Link href="/">
          <Button variant="outline" data-testid="button-back-home">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const isSevere = inquiry.isSevere;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display" data-testid="text-title">Analysis Results</h1>
            <p className="text-muted-foreground">
              Generated on {new Date(inquiry.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          
          <div className={`
            px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-semibold
            ${isSevere 
              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50" 
              : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50"
            }
          `} data-testid="badge-severity">
            {isSevere ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {isSevere ? "Medical Attention Recommended" : "Standard Care Likely Sufficient"}
          </div>
        </div>

        {isSevere && (
          <div className="mb-8 p-6 bg-destructive/10 border-l-4 border-destructive rounded-r-xl">
            <h3 className="text-lg font-bold text-destructive mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Safety Alert
            </h3>
            <p className="text-foreground/90 leading-relaxed">
              Our analysis detected potential indicators of a condition that may require professional medical assessment. 
              Please consult a healthcare provider promptly.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-md border-border/60">
              <CardHeader className="border-b border-border/40 bg-muted/20">
                <CardTitle>AI Assessment</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 prose prose-slate dark:prose-invert max-w-none" data-testid="content-analysis">
                <ReactMarkdown>{inquiry.response}</ReactMarkdown>
              </CardContent>
            </Card>

            <Card className="shadow-md border-border/60">
              <CardHeader className="border-b border-border/40 bg-muted/20">
                <CardTitle>Your Input</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-muted/30 p-4 rounded-lg text-muted-foreground text-sm italic" data-testid="text-symptoms">
                  "{inquiry.symptoms || "No text description provided."}"
                </div>
                {inquiry.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Uploaded Image:</p>
                    <img 
                      src={inquiry.imageUrl} 
                      alt="Analyzed symptom" 
                      className="rounded-lg max-h-64 object-cover border border-border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md border-border/60">
              <CardHeader className="border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between gap-2 flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Have More Questions?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!showChat ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Want to learn more about your analysis? Ask follow-up questions and get more details.
                    </p>
                    <Button onClick={() => { setShowChat(true); setTimeout(() => textareaRef.current?.focus(), 100); }} data-testid="button-start-chat">
                      Ask a Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {chatMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg p-3 text-sm ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                            data-testid={`chat-message-${msg.role}-${i}`}
                          >
                            {msg.role === "assistant" ? (
                              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            ) : (
                              <p>{msg.content}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isAsking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted rounded-lg p-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Thinking...
                        </div>
                      </motion.div>
                    )}

                    <div ref={chatEndRef} />

                    <div className="flex items-end gap-2 pt-2 border-t border-border/40">
                      <Textarea
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your analysis..."
                        className="resize-none min-h-[44px] max-h-[120px] text-sm"
                        rows={1}
                        disabled={isAsking}
                        data-testid="input-followup-question"
                      />
                      <Button
                        size="icon"
                        onClick={handleAskQuestion}
                        disabled={!question.trim() || isAsking}
                        data-testid="button-send-question"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/10 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">Recommended Actions</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center shrink-0 border border-primary/20 font-bold text-xs">1</div>
                    <span>Review the analysis carefully.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center shrink-0 border border-primary/20 font-bold text-xs">2</div>
                    <span>Check your symptoms for any changes.</span>
                  </li>
                  {isSevere && (
                    <li className="flex items-start gap-3 text-sm font-semibold text-destructive">
                      <div className="w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center shrink-0 font-bold text-xs">!</div>
                      <span>Contact a doctor immediately.</span>
                    </li>
                  )}
                </ul>
                <div className="mt-6 pt-6 border-t border-primary/10">
                  <Button className="w-full shadow-lg shadow-primary/20" asChild>
                    <Link href="/symptoms" data-testid="link-check-another">Check Another Symptom</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
