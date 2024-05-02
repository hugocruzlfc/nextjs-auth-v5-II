import NextAuth, { User, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./libs/form-validations";
import { ZodError } from "zod";

export const BASE_PATH = "/api/auth";

const users = [
  {
    id: "test-user-1",
    userName: "test1",
    name: "Test 1",
    password: "pass",
    email: "test1@gmail.com",
  },
  {
    id: "test-user-2",
    userName: "test2",
    name: "Test 2",
    password: "pass",
    email: "test2@gmail.com",
  },
];

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        // username: { label: "Username", type: "text", placeholder: "jsmith" },
        // password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );
          const user = users.find(
            (user) => user.email === email && user.password === password
          );
          return user
            ? { id: user.id, name: user.name, email: user.email }
            : null;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
          throw error;
        }
      },
    }),
  ],
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
