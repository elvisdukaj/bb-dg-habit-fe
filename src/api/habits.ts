import { apiClient } from "./client";

export type Frequency = "daily" | "weekly";

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  frequency: Frequency;
  created_at: string;
  updated_at: string;
}

export interface HabitCreate {
  title: string;
  frequency: Frequency;
}

export interface HabitUpdate {
  title: string;
  frequency: Frequency;
}

export async function listHabits(): Promise<Habit[]> {
  const res = await apiClient.get<Habit[]>("/habits");
  return res.data;
}

export async function getHabit(id: string): Promise<Habit> {
  const res = await apiClient.get<Habit>(`/habits/${id}`);
  return res.data;
}

export async function createHabit(data: HabitCreate): Promise<Habit> {
  const res = await apiClient.post<Habit>("/habits", data);
  return res.data;
}

export async function updateHabit(id: string, data: HabitUpdate): Promise<Habit> {
  const res = await apiClient.put<Habit>(`/habits/${id}`, data);
  return res.data;
}

export async function deleteHabit(id: string): Promise<void> {
  await apiClient.delete(`/habits/${id}`);
}
