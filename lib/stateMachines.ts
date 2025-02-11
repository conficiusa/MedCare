import { assign, setup } from "xstate";

export const consultationMachine = setup({
  types: {
    events: {} as
      | { type: "PARTICIPANT_LEFT"; disconnectReason: number }
      | { type: "CONSULTATION_OVER" }
      | { type: "NOT_OVER" }
      | { type: "DONE" },
    context: {} as { disconnectReason: number },
  },
}).createMachine({
  initial: "idle",
  context: {
    disconnectReason: 0,
  },
  states: {
    idle: {
      on: {
        PARTICIPANT_LEFT: {
          actions: assign({
            disconnectReason: ({ event }) => event.disconnectReason,
          }),
          target: "decide",
        },
      },
    },
    decide: {
      always: [
        {
          guard: ({ context }) => context.disconnectReason === 1,
          target: "showDialogs",
        },
        {
          guard: ({ context }) => context.disconnectReason !== 1,
          target: "askIfOver",
        },
      ],
    },
    askIfOver: {
      on: {
        CONSULTATION_OVER: "showDialogs",
        NOT_OVER: "idle",
      },
    },
    showDialogs: {
      on: {
        DONE: "done",
      },
    },
    done: {
      type: "final",
    },
  },
});

