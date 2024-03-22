import type { clerkClient } from "@clerk/nextjs";

export type User = Awaited<ReturnType<typeof clerkClient.users.getUserList>>[0];
