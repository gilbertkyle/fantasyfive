import type { User } from "@clerk/tanstack-react-start/server";
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
