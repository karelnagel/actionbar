import { SES } from "@aws-sdk/client-ses";
import { EMAIL_SOURCE } from "./consts";

const credentials = {
  accessKeyId: process.env.ADMIN_AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.ADMIN_AWS_SECRET_ACCESS_KEY!,
};
const ses = new SES({ credentials });

export const sendEmail = async ({
  to,
  text,
  subject,
  replyTo = [EMAIL_SOURCE],
}: {
  to: string[];
  text: string;
  subject: string;
  replyTo?: string[];
}) => {
  await ses.sendEmail({
    Source: EMAIL_SOURCE,
    Destination: { ToAddresses: to },
    ReplyToAddresses: replyTo,
    Message: {
      Body: {
        Text: { Charset: "UTF-8", Data: text },
      },
      Subject: { Charset: "UTF-8", Data: subject },
    },
  });
};
