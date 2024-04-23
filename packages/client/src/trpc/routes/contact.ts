import { z } from "zod";
import { publicProcedure, root } from "../root";
// import { sendEmail } from "@actionbar/shared/email";
// import { EMAIL } from "@actionbar/shared/consts";

export const contact = root.router({
  contact: publicProcedure
    .input(z.object({ name: z.string(), email: z.string(), message: z.string() }))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input: { email, name, message } }) => {
      // await sendEmail({
      //   to: [EMAIL],
      //   subject: "Contact Form Submission",
      //   text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nLocale: ${locale}`,
      // });
      // await sendEmail({
      //   to: [email],
      //   subject: t.emails.contact.subject,
      //   text: t.emails.contact.text,
      // });
      return {
        message: `${name} ${email} ${message} configure SES to email!`,
      };
    }),
});
