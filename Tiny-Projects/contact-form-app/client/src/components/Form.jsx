import { useState } from "react";
import { z } from "zod";

// ✔ Zod Schema for Frontend Validation
const nameRegex = /^[A-Za-z\s'-]+$/;
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(nameRegex, "First name must contain only letters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(nameRegex, "Last name must contain only letters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const Form = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" or "error"

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✔ Validate with Zod before API call
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      setStatusType("error");
      setStatusMessage(result.error.issues[0].message);
      return;
    }

    // If valid → send to backend
    try {
      const response = await fetch("http://localhost:4000/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setStatusType("success");
      setStatusMessage(data.message);
    } catch (error) {
      setStatusType("error");
      setStatusMessage("Failed to submit form");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-12 space-y-6"
      >
        <h1 className="text-xl font-bold text-center text-gray-600">
          Simple Contact Form
        </h1>

        <div>
          <label className="font-mono text-sm ">First Name</label>
          <input
            type="text"
            name="firstName"
            className="w-full px-3 py-1 border rounded-xl"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="font-mono text-sm ">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="w-full px-3 py-1 border rounded-xl"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="font-mono text-sm text-s">Email Address</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-1 border rounded-xl"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="font-mono  text-sm text-s">Message</label>
          <textarea
            name="message"
            rows="4"
            className="w-full px-3 py-1 border rounded-xl"
            onChange={handleChange}
          ></textarea>
        </div>
        {statusMessage && (
          <p
            className={` text-xs mb-2 font-mono
              ${statusType === "success" ? "text-green-600" : "text-red-600"}
            `}
          >
            {statusMessage}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white p-1 rounded-xl hover:bg-orange-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
