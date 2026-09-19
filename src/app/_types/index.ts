import type { clerkClient } from "@clerk/tanstack-react-start/server";

export type User = Awaited<ReturnType<ReturnType<typeof clerkClient>["users"]["getUserList"]>>["data"][0];
