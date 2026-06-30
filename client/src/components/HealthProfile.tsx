import { useState } from "react";
import { User, Weight, Ruler, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  gender: z.string().min(1, "Please select gender"),
  weight: z.string().min(1, "Required"),
  height: z.string().min(1, "Required"),
  goal: z.string().min(1, "Please select a goal"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function HealthProfile() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileValues | null>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: "",
      weight: "70",
      height: "175",
      goal: "",
    },
  });

  function onSubmit(data: ProfileValues) {
    setProfile(data);
    localStorage.setItem("hp_data", JSON.stringify(data));
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" data-testid="button-health-profile">
          <User className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-bold">Health Profile</DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Weight className="w-4 h-4" /> Weight (kg)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> Height (cm)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Target className="w-4 h-4" /> Health Goal
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="diet">Diet (Weight Loss)</SelectItem>
                      <SelectItem value="bulk">Bulk (Muscle Gain)</SelectItem>
                      <SelectItem value="maintain">Maintain</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Profile</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
