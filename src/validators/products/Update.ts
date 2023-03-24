import customJoi from "../../utils/CustomJoi";

export default async (data) => {
  const requestSchema = customJoi.object({
    productName: customJoi.string().htmlStrip().required().messages({
      "string.base": "Invalid product name value",
      "string.empty": "Product name is required",
      "any.required": "Product name is required",
    }),
    cost: customJoi.number().htmlStrip().min(5).multiple(5).max(100).messages({
      "string.base": "Invalid cost value",
      "number.min": "Product cost can not be less than 5",
      "number.max": "Product cost can not be more than 100",
      "number.multiple": "Product cost must be multiple of 5",
    }),
    amountAvailable: customJoi.number().htmlStrip().min(1).required().messages({
      "string.base": "Invalid quantity value",
      "string.empty": "Product quantity is required",
      "number.min": "Product quantity can not be less than 1",
      "any.required": "Product quantity is required",
    }),
  });

  return requestSchema.validateAsync(data);
};
