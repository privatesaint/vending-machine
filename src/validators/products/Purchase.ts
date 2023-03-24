import customJoi from "../../utils/CustomJoi";

export default async (data) => {
  const requestSchema = customJoi.object({
    productId: customJoi.string().htmlStrip().required().messages({
      "string.base": "Invalid product id value",
      "string.empty": "Product id is required",
      "any.required": "Product id is required",
    }),
    quantity: customJoi.number().htmlStrip().min(1).required().messages({
      "number.base": "Invalid quantity value",
      "number.empty": "Quantity is required",
      "number.min": "Quantity of product can not be less than 1",
      "any.required": "Quantity is required",
    }),
  });

  return requestSchema.validateAsync(data);
};
