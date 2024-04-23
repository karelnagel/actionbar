import { useState } from "react";
import { client, useAPI } from "../trpc/client";
import { Locale } from "@template/i18n";

export const ContactForm = ({ locale }: { locale: Locale }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { mutate, data, error, isLoading } = useAPI(client.contact.contact.mutate);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await mutate({ name, email, message, locale });
    console.log(result);
  };
  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-2">
      <input
        placeholder="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {error && <div>{error.message}</div>}
      {data && <div>{data.message}</div>}
      <button type="submit" className="button" disabled={isLoading}>
        {isLoading ? "Loading" : "Submit"}
      </button>
    </form>
  );
};
