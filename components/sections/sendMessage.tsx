import SendMessageForm from "@/components/blocks/sendMessageForm";

const SendMessage = () => {
  return (
    <section className="bg-muted my-10 p-14">
      <div className="min-h-[400px] max-w-md mx-auto">
        <p className="text-sm mb-6">Have a question? Send us a message</p>
        <SendMessageForm />
      </div>
    </section>
  );
};

export default SendMessage;
