import z from "../zod";
import { leadEventSchemaTB } from "../zod/schemas";
import { tb } from "./client";

export const getLeadEvent = tb.buildPipe({
  pipe: "get_lead_event",
  parameters: z.object({
    customerId: z.string(),
  }),
  data: leadEventSchemaTB,
});
