import type { User } from "@clerk/nextjs/dist/types/server";
export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    name: user.firstName,
    imageUrl: user.imageUrl,
    externalUsername:
      user.externalAccounts.find((externalAccount) => externalAccount.provider === "oauth_github")?.username ?? null,
  };
};
