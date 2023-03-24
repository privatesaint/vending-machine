import customJoi from "../../utils/CustomJoi";

export default async (data) => {
  const requestSchema = customJoi.object({
    amount: customJoi
      .number()
      .htmlStrip()
      .min(5)
      .valid(5, 10, 20, 50, 100)
      .required()
      .messages({
        "number.base": "Invalid amount value",
        "number.empty": "Deposit amount is required",
        "number.min": "Amount can not be less than 5",
        "any.only": "Invalid coin. Accepted coins are 5,10,20,50 and 100",
        "any.required": "Deposit amount is required",
      }),
  });

  return requestSchema.validateAsync(data);
};
