export type TalentStatus = 
  | '新候选人'
  | '初选通过'
  | '安排面试'
  | '面试通过'
  | '已发offer'
  | '待入职'
  | '已发offer未入职'
  | '已淘汰';

export type Gender = '男' | '女' | '保密';

export interface TalentInfo {
  id: string;
  name: string;
  gender: Gender;
  phone: string;
  position: string;
  recruitmentChannel: string;
  status: TalentStatus;
  statue?: TalentStatus;
  entryTime?: string;
  operator: string;
  createTime: string;
  updateTime: string;
}

export interface TalentSearchParams {
  id?: string;
  keyword?: string;
  status?: TalentStatus;
  statue?: TalentStatus;
  recruitmentChannel?: string;
  startTime?: string;
  endTime?: string;
  current?: number;
  pageSize?: number;
  page?: number;
  per_page?: number;
  start_date?: string;
  end_date?: string;
}

export interface TalentListResponse {
  data: TalentInfo[];
  total: number;
  current: number;
  pageSize: number;
} 