import { ToolRequestInfo } from './tools';
import { UserPublicInfo } from './users';

export type PendingRequest =
  | {
      type: 'applicant_request';
      request_id: string;
      user: UserPublicInfo;
      createdAt: string;
    }
  | {
      type: 'tool_request';
      tool: ToolRequestInfo;
      createdAt: string;
    };
