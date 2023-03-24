import { RoleType } from "../../types/users/roletype";
import customJoi from "../../utils/CustomJoi";

export default async (data) => {
  const requestSchema = customJoi.object({
    username: customJoi.string().trim().htmlStrip().required().messages({
      "string.base": "Invalid username value",
      "string.empty": "Username is required",
      "any.required": "Username is required",
    }),
    password: customJoi.string().htmlStrip().required().min(8).messages({
      "string.base": "Invalid password value",
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.min": "Password can not be less than 8",
    }),
    role: customJoi
      .string()
      .trim()
      .htmlStrip()
      .required()
      .valid(...Object.values(RoleType))
      .required()
      .messages({
        "string.base": "Invalid role value",
        "string.empty": "Role is required",
        "any.required": "Role is required",
        "any.only": "Invalid role value",
      }),
  });

  return requestSchema.validateAsync(data);
};
