import { setup, assign, fromPromise, createActor } from "xstate";

const SendCode = async () => {
  const res = await fetch("/api/user/update/bank-details/", {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  if (res?.status !== 200) {
    throw new Error(data.error || "Failed to send code. Please try again.");
  }
  return data;
};

const handleVerifyCode = async (code: string) => {
  if (code.length !== 6) {
    throw new Error("Please enter a 6-digit code");
  }
  const res = await fetch("/api/user/update/bank-details/", {
    method: "POST",
    body: JSON.stringify({ token: code }),
  });
  const data = await res.json();
  if (res?.status !== 200) {
    throw new Error(data.error || "Failed to send code. Please try again.");
  }
  return data;
};

export const verificationMachine = setup({
  types: {
    context: {} as {
      allowResend: boolean;
      code: string;
      error: string;
      message: string;
    },
    input: {} as { code: string },
    events: {} as
      | { type: "REQUEST_CODE" }
      | { type: "CODE_SENT" }
      | { type: "CODE_SEND_FAILED" }
      | { type: "VERIFY_CODE"; code: string }
      | { type: "CODE_VERIFIED" }
      | { type: "CODE_FAILED" }
      | { type: "RESEND_CODE" },
  },
  guards: {
    isResendAllowed: (_, params: { resendAllowed: boolean }) => {
      return params.resendAllowed;
    },
  },
  actors: {
    sendCode: fromPromise(async () => SendCode()),
    verifyCode: fromPromise(async ({ input }: { input: { code: string } }) =>
      handleVerifyCode(input?.code)
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcwCcCWAzDBjAhgC4YD2AdgHQZkbH4A2AxAEoCiAigKqsDKAKgH0AwgHkAIqwDaABgC6iUAAcSsWqTIKQAD0QBOXQCYKARgBsADgDsAVgDMp6wdO3LxgDQgAnogPTpFawAWfV1jQ3MDe0sDAF8Yj1RMHAJicgpYMDIIaigBXBIIMEYIcjAqMmQSAGsyjKyhArAZeSQQZVVUjVadBGM-fwdTJwNo22Mndy8fa2MKaWDdCOtrS1NjWwi4hPRsPCJ1dMzsslz8wsZ0NBI0CkV6IixrgFtD+sbmzXa1ck0e40DbP5AsYrLoVkFnLpTB5vAgnP4VvpzOYhsZrKZVlsQIldikDmcwAI6hABFh8Bh6JBGB9Wl9Or9EGjpLNzCDLMjzCtTNJbLYYYhWRQDCFQtJWbpbPpTFiccl9mkCUTMoRGAA1VjMACSADEAJrCcRSOSfFTfLqgP7siicoYrCKRYUbfkIFaBCiWUKmCymQLBbm2GU7OWdCiKuoqrSwQhEMr4LCEdAACm5-QAlIxZXsQ2HlTSlKb6d1GVabQY7QYHRLzM7geYTAtQv9AhYNoGklmDgx6CQAO4CNBwI4sXisAByYgNEjzbQL6gZLsWFEGBk5YU5VkszsltgogUswXMe-XgXMULbuPllFlnhyeUaxVK5UqNQo14ahWndLnRYXdeXq8WawN2dZwjBsfp-gMAE90Cc9gwOa9bwJC40CuG47geZ5XyDTx3yaY1aVnH4f2sRd-xmQDgKmF0NmtEVTChdlLFcOCOzSTM8XIUlyUpCBhx4McJ1EKcCPzDpvwtPRDBMCwbHsRxnFcZ07EsChJRCMJdGkRZpGsOJ4hAMhGngVoOMvE1xOIySEAAWmhai7NYzjKGoNQGAss152RWZ0Q3QIV38-RrGdTlrXMXltPsXRojRSwnMvV5jlORoPMLazjGMSwd3BeYoN0fyLGC6iy10NSgihXTAR5FxYIMszs0aJUsm4ilIFSiTtEZUid2kWTOX0Hl1hCusNl5WwAVPaKxQDOqgzYygczIQh2qszqEH850Vx8kUzFsAx-jBOLZvbZyKC7Xt+0HLIVvNNbtxMQbbHKlwZl9GtMvrKVWTsXxmNq7YToSxCTjvQobvnXk3XsMsQUcKxwr5ajlhZT0GK9LSNnMeKQ0zSAiQAV1wXA4FgLB8foehYTEzyf1Waw1P6J6fTh1YQLsJdwLFMIXF8YxsYQubnJa3jwdp08hX27yoOYoJEdhdFZmkcDxg5VxeX0mIgA */
  id: "verification",
  initial: "initial",

  context: {
    allowResend: false,
    code: "",
    error: "",
    message: "",
  },

  states: {
    initial: {
      on: {
        REQUEST_CODE: {
          target: "sending_code",
        },
      },
    },
    sending_code: {
      invoke: {
        id: "sendCode",
        src: "sendCode",
        onDone: {
          target: "code_sent",
          actions: assign({
            allowResend: false,
            error: "",
            message: ({ event }) => event.output.message,
          }),
        },
        onError: {
          target: "code_send_failed",
          actions: assign({
            error: "Invalid or expired token",
            message: "Failed to verify token",
          }),
        },
      },
    },
    code_send_failed: {
      always: "initial",
    },
    code_sent: {
      after: {
        120000: { actions: assign({ allowResend: true }) },
      },
      on: {
        VERIFY_CODE: "verifying_code",
        RESEND_CODE: "sending_code",
      },
    },
    verifying_code: {
      invoke: {
        id: "verifyCode",
        src: "verifyCode",
        input: ({ event }) => ({
          code: event.type === "VERIFY_CODE" ? event.code : "",
        }),

        onDone: {
          target: "verified_successfully",
          actions: assign({
            allowResend: false,
            error: "",
            message: ({ event }) => event.output.message,
          }),
        },
        onError: {
          target: "verification_failed",
          actions: assign({
            error: ({ event }) => event.error as string,
            message: "Failed to verify token",
          }),
        },
      },
    },
    verified_successfully: {
      type: "final",
    },
    verification_failed: {
      on: {
        RESEND_CODE: {
          target: "sending_code",
          actions: assign({
            allowResend: false,
          }),
        },
        VERIFY_CODE: "verifying_code",
      },
    },
  },
});

const verificationActor = createActor(verificationMachine, {
  input: { code: "" },
});
export default verificationActor;
