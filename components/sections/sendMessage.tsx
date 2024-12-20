import SendMessageForm from "@/components/blocks/sendMessageForm";

const SendMessage = () => {
  return (
    <section className="sm:bg-muted py-10 sm:p-14 mt-10">
      <div className="min-h-[400px] max-w-lg mx-auto">
        <p className="text-lg sm:mb-6 mb-3 max-sm:font-semibold">
          Have a question? Leave us a message
        </p>
        <SendMessageForm />
      </div>
    </section>
  );
};

export default SendMessage;
