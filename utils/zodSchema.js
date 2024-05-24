import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" })
    .nonempty({ message: "Name is required" }),
  username: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" })
    .nonempty({ message: "Username is required" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be 8 or more characters long" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    })
    .nonempty({ message: "Password is required" }),
  bio: z
    .string()
    .min(7, { message: "Must be 7 or more characters long" })
    .nonempty({ message: "Bio is required" }),
  // avatar: z.object({
  //   public_id: z
  //     .string()
  //     .nonempty({ message: "public_id not created Failed to Upload Image" }),
  //   url: z
  //     .string()
  //     .nonempty({ message: "url not created Failed to Upload Image" }),
  // }),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" })
    .nonempty({ message: "Username is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be 8 or more characters long" })
    .nonempty({ message: "Password is required" }),
});
