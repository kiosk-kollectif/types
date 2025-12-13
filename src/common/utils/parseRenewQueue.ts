import { ApplicantRequestDocument } from 'src/applicants/applicants.schema';
import { type ToolDocument } from 'src/tools/tools.schema';
import { PendingRequest } from 'src/types/admins';
import { UserDocument } from 'src/users/users.schema';

export function parseRenewQueue(
  queue: (ToolDocument | ApplicantRequestDocument)[],
): PendingRequest[] {
  const pendingRequest: PendingRequest[] = [];
  for (const request of queue) {
    if (isToolRequest(request)) {
      pendingRequest.push({
        type: 'tool_request',
        tool: request.getInfo(),
        createdAt: request.createdAt.toString(),
      });
    } else if (isApplicantRequest(request)) {
      pendingRequest.push({
        type: 'applicant_request',
        user: request.user_id.getUserProfil(),
        createdAt: request.createdAt.toString(),
      });
    }
  }

  return pendingRequest;
}

function isApplicantRequest(req: unknown): req is ApplicantRequestDocument & {
  user_id: UserDocument;
  collection: { name: 'applicant_requests' };
} {
  if (
    typeof req == 'object' &&
    req !== null &&
    'collection' in req &&
    typeof req.collection == 'object' &&
    req.collection !== null &&
    'name' in req.collection &&
    typeof req.collection.name == 'string'
  ) {
    return req.collection.name === 'applicant_requests';
  }
  return false;
}

function isToolRequest(req: unknown): req is ToolDocument {
  if (
    typeof req == 'object' &&
    req !== null &&
    'collection' in req &&
    typeof req.collection == 'object' &&
    req.collection !== null &&
    'name' in req.collection &&
    typeof req.collection.name == 'string'
  ) {
    return req.collection.name === 'tools';
  }
  return false;
}
