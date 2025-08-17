import z from "zod";

export class UserAuthenticationSchema {
  public static User = z.object({
    user_id: z.number().gte(0).optional(),
    google_id: z.string().optional(),
    email: z.string(),
    password: z.string().optional(),
    user_lvl: z.number().optional(),
    updated_at: z.date().optional(),
    created_at: z.date().optional(),
  })

  public static UserLocalStrategyRegistration = z.object({
    email: z.email("Invalid email format").nonempty(),
    password: z.string().nonempty(),
    repeat_password: z.string().nonempty()
  }).refine(data => data.password === data.repeat_password, {
    message: "The passwords do not match!",
    path: ["repeat_password"]
  });

  public static UserCredentials = z.object({
    user_id: z.number().gte(0).optional(),
    email: z.email("Invalid email format"),
    google_id: z.string().optional(),
    password: z.string().optional(),
  }).refine(data => {
    const hasEmail = data.email !== "" && data.email !== undefined;
    const hasPassword =  data.password !== "" && data.password !== undefined;
    const hasGoogleId = data.google_id !== "" && data.google_id !== undefined;

    if(hasGoogleId && (!hasEmail || !hasPassword)) {
      return false;
    }

    return !((hasEmail || hasPassword) && !hasGoogleId);


  }, {
    message: "Email and password must be provided, or Google Id must be provided",
    path: ['google_id','password','email']
  })
}