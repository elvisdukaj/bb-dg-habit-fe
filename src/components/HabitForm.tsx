import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { HabitCreate } from "../api/habits";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  frequency: z.enum(["daily", "weekly"] as const),
});

type FormValues = z.infer<typeof schema>;

interface HabitFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: HabitCreate) => Promise<unknown>;
  submitLabel: string;
  onCancel: () => void;
}

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

export default function HabitForm({
  defaultValues,
  onSubmit,
  submitLabel,
  onCancel,
}: HabitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", frequency: "daily", ...defaultValues },
  });

  async function handleFormSubmit(values: FormValues) {
    try {
      await onSubmit(values);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Something went wrong";
      setError("root", { message: msg });
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <Input
        label="Title"
        placeholder="e.g. Drink water"
        error={errors.title?.message}
        {...register("title")}
      />
      <Select
        label="Frequency"
        options={frequencyOptions}
        error={errors.frequency?.message}
        {...register("frequency")}
      />
      {errors.root && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
          {errors.root.message}
        </p>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export type { FormValues as HabitFormValues };
