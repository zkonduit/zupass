import urlJoin from "url-join";
import {
  CheckTicketRequest,
  CheckTicketReponseValue as CheckTicketResponseValue,
  TicketError
} from "../RequestTypes";
import { APIResult } from "./apiResult";
import { httpPost } from "./makeRequest";

/**
 * For Devconnect tickets, pre-check a ticket before attempting check-in.
 *
 * Sends a serialized PCD. See {@link requestCheckTicketById} for an
 * alternative API which sends only the ticket ID.
 *
 * Does NOT check in the user, rather checks whether the ticket is valid and
 * can be used to check in.
 *
 * Never rejects. All information encoded in the resolved response.
 */
export async function requestCheckTicket(
  zupassServerUrl: string,
  postBody: CheckTicketRequest
): Promise<CheckTicketResult> {
  return httpPost<CheckTicketResult>(
    urlJoin(zupassServerUrl, "/issue/check-ticket"),
    {
      onValue: async (resText) => JSON.parse(resText) as CheckTicketResult,
      onError: async (): Promise<CheckTicketResult> => ({
        error: { name: "ServerError" },
        success: false
      })
    },
    postBody
  );
}

export type CheckTicketResult = APIResult<
  CheckTicketResponseValue,
  TicketError
>;
