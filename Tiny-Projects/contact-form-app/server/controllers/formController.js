import { formSchema } from "../validation/formSchema.js";

export const submitForm = (req, res, next) => {
  try {
    const result = formSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.errors,
      });
    }

    const data = result.data;

    console.log("VALID DATA RECEIVED:", data);

    return res.json({
      success: true,
      message: "Form submitted successfully!",
    });
  } catch (err) {
    next(err);
  }
};
