import {
  ApplicantRequest,
  ApplicantRequestDocument,
} from 'src/applicants/applicants.schema';
import { Tool, type ToolDocument } from 'src/tools/tools.schema';
import { PendingRequest } from 'src/types/admins';
import { UserDocument } from 'src/users/users.schema';

export function parseRenewQueue(
  queue: (ToolDocument | ApplicantRequestDocument)[],
): PendingRequest[] {
  const pendingRequest: PendingRequest[] = [];
  for (const request of queue) {
    const model = request.collection.name;
    if (model === 'tools') {
      pendingRequest.push({
        type: 'tool_request',
        //@ts-ignore
        tool: request.getInfo(),
        createdAt: request.createdAt.toString(),
      });
    } else if (model === 'applicant_requests') {
      pendingRequest.push({
        type: 'applicant_request',
        //@ts-ignore
        user: request.user_id.getUserProfil(),
        createdAt: request.createdAt.toString(),
      });
    }
  }

  return pendingRequest;
}
