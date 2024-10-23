import SendMessageForm from "@/components/blocks/sendMessageForm";

const SendMessage = () => {
  return (
    <section className="sm:bg-muted my-10 sm:p-14">
      <div className="min-h-[400px] max-w-lg mx-auto">
        <p className="text-sm sm:mb-6 mb-3 max-sm:font-semibold">
          Have a question? Send us a message
        </p>
        <SendMessageForm />
      </div>
    </section>
  );
};

export default SendMessage;
