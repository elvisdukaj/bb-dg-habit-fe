import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHabit,
  deleteHabit,
  listHabits,
  updateHabit,
  type Habit,
  type HabitCreate,
} from "../api/habits";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import Modal from "../components/Modal";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; habit: Habit }
  | { type: "delete"; habit: Habit };

export default function HabitsPage() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const { data: habits = [], isLoading, isError } = useQuery({
    queryKey: ["habits"],
    queryFn: listHabits,
  });

  const createMutation = useMutation({
    mutationFn: (data: HabitCreate) => createHabit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      setModal({ type: "none" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: HabitCreate }) =>
      updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      setModal({ type: "none" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      setModal({ type: "none" });
    },
  });

  const dailyHabits = habits.filter((h) => h.frequency === "daily");
  const weeklyHabits = habits.filter((h) => h.frequency === "weekly");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">Habit Tracker</span>
          </div>
          <Button variant="ghost" onClick={logout} className="gap-1.5 text-slate-500">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Habits</h2>
            <p className="text-sm text-slate-500">
              {habits.length === 0
                ? "No habits yet"
                : `${habits.length} habit${habits.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <Button onClick={() => setModal({ type: "create" })} className="gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New habit
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <svg
              className="h-8 w-8 animate-spin text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load habits. Please refresh the page.
          </div>
        )}

        {!isLoading && !isError && habits.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
              <svg
                className="h-7 w-7 text-indigo-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="font-medium text-slate-700">No habits yet</p>
            <p className="mt-1 text-sm text-slate-400">Add your first habit to get started</p>
            <Button
              onClick={() => setModal({ type: "create" })}
              className="mt-4 gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add habit
            </Button>
          </div>
        )}

        {dailyHabits.length > 0 && (
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Daily
            </h3>
            <div className="flex flex-col gap-3">
              {dailyHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={(h) => setModal({ type: "edit", habit: h })}
                  onDelete={(h) => setModal({ type: "delete", habit: h })}
                />
              ))}
            </div>
          </section>
        )}

        {weeklyHabits.length > 0 && (
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Weekly
            </h3>
            <div className="flex flex-col gap-3">
              {weeklyHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={(h) => setModal({ type: "edit", habit: h })}
                  onDelete={(h) => setModal({ type: "delete", habit: h })}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Create modal */}
      <Modal
        open={modal.type === "create"}
        title="New habit"
        onClose={() => setModal({ type: "none" })}
      >
        <HabitForm
          submitLabel="Create habit"
          onCancel={() => setModal({ type: "none" })}
          onSubmit={(data) => createMutation.mutateAsync(data).then(() => {})}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={modal.type === "edit"}
        title="Edit habit"
        onClose={() => setModal({ type: "none" })}
      >
        {modal.type === "edit" && (
          <HabitForm
            defaultValues={{
              title: modal.habit.title,
              frequency: modal.habit.frequency,
            }}
            submitLabel="Save changes"
            onCancel={() => setModal({ type: "none" })}
            onSubmit={(data) =>
              updateMutation.mutateAsync({ id: modal.habit.id, data }).then(() => {})
            }
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={modal.type === "delete"}
        title="Delete habit"
        onClose={() => setModal({ type: "none" })}
      >
        {modal.type === "delete" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                "{modal.habit.title}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setModal({ type: "none" })}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(modal.habit.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
