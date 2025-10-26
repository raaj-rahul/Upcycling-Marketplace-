// src/lib/auth.ts
export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // NOTE: demo only (plain text). Backend will replace with secure auth.
  location?: string;
  avatarUrl?: string; // optional future field
};

const USERS_KEY = "rc_users";
const AUTH_FLAG_KEY = "rc_auth";
const CURRENT_USER_KEY = "rc_user";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(list: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(u: User | null) {
  if (u) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  // notify header & others
  window.dispatchEvent(new StorageEvent("storage", { key: CURRENT_USER_KEY }));
}

export function isAuthed(): boolean {
  return localStorage.getItem(AUTH_FLAG_KEY) === "1";
}

function setAuthed(flag: boolean) {
  if (flag) localStorage.setItem(AUTH_FLAG_KEY, "1");
  else localStorage.removeItem(AUTH_FLAG_KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: AUTH_FLAG_KEY }));
}

export function registerUser(input: { name: string; email: string; password: string; location?: string }): { ok: true; user: User } | { ok: false; error: string } {
  const users = readUsers();
  const exists = users.find(u => u.email.toLowerCase() === input.email.toLowerCase());
  if (exists) return { ok: false, error: "Email already registered" };

  const user: User = {
    id: uid(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password, // demo only
    location: input.location?.trim(),
  };
  users.push(user);
  writeUsers(users);

  setAuthed(true);
  setCurrentUser(user);
  return { ok: true, user };
}

export function loginUser(email: string, password: string): { ok: true; user: User } | { ok: false; error: string } {
  const users = readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) return { ok: false, error: "Invalid email or password" };
  setAuthed(true);
  setCurrentUser(user);
  return { ok: true, user };
}

export function logoutUser() {
  setAuthed(false);
  setCurrentUser(null);
}

export function updateCurrentUser(patch: Partial<Omit<User, "id" | "email" | "password">> & { name?: string; location?: string; avatarUrl?: string }) {
  const cu = getCurrentUser();
  if (!cu) return;
  const users = readUsers();
  const idx = users.findIndex(u => u.id === cu.id);
  if (idx === -1) return;

  const updated: User = { ...cu, ...patch };
  users[idx] = updated;
  writeUsers(users);
  setCurrentUser(updated);
}

export function changePassword(oldPw: string, newPw: string): { ok: true } | { ok: false; error: string } {
  const cu = getCurrentUser();
  if (!cu) return { ok: false, error: "Not logged in" };
  if (cu.password !== oldPw) return { ok: false, error: "Current password is incorrect" };

  const users = readUsers();
  const idx = users.findIndex(u => u.id === cu.id);
  if (idx === -1) return { ok: false, error: "User not found" };

  users[idx] = { ...users[idx], password: newPw };
  writeUsers(users);
  setCurrentUser(users[idx]);
  return { ok: true };
}
