import { assign, createActor, setup } from "xstate";

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
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiABQEEAlAFQEkBhVhgOWYH0AMgFEAYswDaABgC6iUAAcA9rFwAXXIvxyQAD0QBGAGyGSks5KMBWSwE4AHACYb+gMwAaEAE9ED-ZZIA7AEuACzBwfr2vgC+0R5oWHiEpBBgmOQ0UrJIIEoq6praegghdjYk+g4hNjYBho6WkoYOhh7eCFUBFcYBfnb6+pIhlgF2sfEYOATEJKnpqdTi+tkKymoaWjnFpeWV1bX1Do3NrV4GLg6m5pFh9o4BDuMgCVPJJOiwANasAGYA8gA3MAAJ2o7D+3AAygBVATMehsCF8P4ANSEjCy2jy60KW0QQXK9hCR30owcZUsITaBiq3UMDweVWGxksTxeSRmH2+-yBoO4f34qPRmJy2IKm1AxUs+hCJBC9QCjUs-Wa1mpCH6JEaZhcxha9JsLhcbMmHNIsGwigA7gARXDoCiKKCwag2iFCEWrfIbIoGPyyhyhKplZqk1zqwNdYz03yNOx2EZ1WJxED4RSpeA5dnTIhYtbi30IAC0p3aRf8NRqlhc1kMkR1hhNiRzZEoYDz3txksQxIjLkkJGcMZCupZDybrxmcwyHZxEt0iBcAQHlUaVkkDiCTL75XMkkpdmJkQGE7N7y+v0BINnBbxCEM1kHh4uFksxhchvVexI0YZDiZb4PqeLYWtadoOk6mZenOhaDJIXROMYho2CMTifmcHQuHYdIPH4kjxomxoptmbwQJo7aivmPp3quhLVvhDwhGERruBhgYmEOy7BKG1jBMm0RAA */
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
