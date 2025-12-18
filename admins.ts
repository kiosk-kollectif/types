import { Tool as ToolInfo } from './tools';
import { User } from './users';

export type PendingRequest =
  | {
      type: 'applicant_request';
      request_id: string;
      user: User;
      createdAt: string;
    }
  | {
      type: 'tool_request';
      tool: ToolInfo;
      createdAt: string;
    };
