import { Tool as ToolInfo } from './tools';
import { User } from './users';

export type PendingRequest =
  | {
      type: 'applicant_request';
      user: User;
    }
  | {
      type: 'tool_request';
      tool: ToolInfo;
    };
