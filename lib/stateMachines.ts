import { createMachine } from "xstate";
const tourMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7WBXANgFwEM8BLDAOgDkB5AFQH0BlGgQQCUaBRAEQGIAnVKgC2ZWIT55IAbQAMAXUSgADqljESGRSAAeiAEx6yARgAsMgGx6ArABoQAT0QBmK2SsBfT3fSoIcLWiYuIQa6FoqaqFauggAtEYAHADsdo5xVnpeIIHY+ESk6JS0jCzs3OGq6gXRiPFOAJypzuZZOcH55ExsnFwVkdVIOohGSfVkSYlJtg7Nnp5AA */
  id: "consultation",
  initial: "NOT_STARTED",
  states: {
    NOT_STARTED: {
      on: {
        room_started: {
          target: "STARTED",
        },
      },
    },
    STARTED: {
      on: {
        participant_joined: [
          {
            guard: ({ event }) =>
              event.participant.attributes.role === "doctor",
            target: "DOCTOR_JOINED",
          },
          {
            guard: ({ event }) =>
              event.participant.attributes.role === "patient",
            target: "PATIENT_JOINED",
          },
        ],
      },
    },
    DOCTOR_JOINED: {
      on: {
        participatant_left: [
          {
            guard: ({ event }) =>
              event.participant.attributes.role === "doctor",
            target: "DOCTOR_LEFT",
          },
          {
            guard: ({ event }) =>
              event.participant.attributes.role === "patient",
            target: "PATIENT_LEFT",
          },
        ],

        room_finished: {
          target: "FINISHED",
        },
      },
    },
  },
});
