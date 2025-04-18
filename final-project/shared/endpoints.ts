type Routes = {
  auth: {
    prefix: string;
    routes: { [key: string]: string };
  };
};

export const API = {
  auth: {
    prefix: "/auth",
    routes: {
      GET_NONCE: "/nonce",
      GET_SESSION: "/session",
      VERIFY: "/verify",
      SIGNOUT: "/signout",
    },
  },
} satisfies Routes;
