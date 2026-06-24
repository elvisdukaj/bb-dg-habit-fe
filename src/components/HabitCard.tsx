import type { Habit } from "../api/habits";
import Button from "./Button";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

const frequencyBadge: Record<string, string> = {
  daily: "bg-emerald-100 text-emerald-700",
  weekly: "bg-violet-100 text-violet-700",
};

export default function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{habit.title}</p>
          <span
            className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
              frequencyBadge[habit.frequency] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {habit.frequency}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" onClick={() => onEdit(habit)} className="p-2">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </Button>
        <Button variant="ghost" onClick={() => onDelete(habit)} className="p-2 text-red-500 hover:bg-red-50">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
