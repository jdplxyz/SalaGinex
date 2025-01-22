import { z } from "zod";

export const userSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),

  apellido: z
    .string()
    .min(1, { message: "El apellido es requerido" })
    .max(50, { message: "El apellido no puede tener más de 50 caracteres" }),

  correo_electronico: z
    .string()
    .email({ message: "El correo electrónico no es válido" })
    .max(100, {
      message: "El correo electrónico no puede tener más de 100 caracteres",
    }),

  clave: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(150, { message: "La contraseña no puede tener más de 50 caracteres" })
    .regex(/[A-Z]/, {
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .regex(/[0-9]/, {
      message: "La contraseña debe contener al menos un número",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "La contraseña debe contener al menos un carácter especial",
    }),
});
