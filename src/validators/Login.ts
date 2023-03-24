import customJoi from "../utils/CustomJoi";

export default (data) => {
  const userSchema = customJoi.object({
    username: customJoi.string().trim().htmlStrip().required().messages({
      "string.base": "Invalid username provided.",
      "string.empty": "Username is required.",
      "any.required": "Username is required.",
    }),

    password: customJoi.string().required().htmlStrip().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });

  return userSchema.validateAsync(data);
};
