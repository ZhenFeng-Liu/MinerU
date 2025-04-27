import http from './http';

// API 接口路径
const TALENT_API = '/api/v2/talentpool/handler';

// 接口类型定义
/**
 * 人才库条目数据结构
 */
export interface TalentItem {
  id?: number;              // 条目ID，创建时可选
  name?: string;             // 姓名
  gender?: string;           // 性别
  phone?: string;            // 电话
  job?: string;              // 职位
  channel?: string;          // 渠道
  statue?: string;           // 状态
  inputer?: string;          // 录入人
  analysis_task_id?:string | number; // 分析任务ID
  create_date?: string;      // 入库时间
}

/**
 * 查询参数接口
 */
export interface TalentQueryParams {
  id?: string;                // 按ID查询
  keyword?: string;           // 关键词搜索
  statue?: string;            // 状态筛选
  page?: string | number;     // 页码
  per_page?: string | number; // 每页条数
  start_date?: string;        // 开始日期
  end_date?: string;          // 结束日期
}

/**
 * 人才列表响应结构
 */
export interface TalentListResponse {
  dates: TalentItem[];       // 人才列表数据
  total: number;             // 总记录数
}

// API 方法
/**
 * 创建人才库条目
 * @param data 人才信息
 * @returns Promise 创建结果
 */
export const createTalent = (data: TalentItem) => {
  return http.post<TalentItem>(TALENT_API, data);
};

/**
 * 更新人才库条目
 * @param data 更新的人才信息（必须包含id）
 * @returns Promise 更新结果
 * @throws Error 当未提供id时抛出错误
 */
export const updateTalent = (data: TalentItem) => {
  if (!data.id) {
    throw new Error('更新操作需要提供人才ID');
  }
  return http.put<TalentItem>(TALENT_API, data);
};

/**
 * 删除人才库条目（支持批量删除）
 * @param ids 要删除的条目ID数组
 * @returns Promise 删除结果
 */
export const deleteTalents = (ids: number[]) => {
  return http.delete(TALENT_API, {
    data: { ids }
  });
};

/**
 * 批量更新人才状态
 * @param ids 要更新的条目ID数组
 * @param statue 新状态
 * @returns Promise 更新结果
 */
export const updateTalentStatus = (ids: number[], statue: string) => {
  return http.patch(TALENT_API, {
    ids,
    statue
  });
};

/**
 * 查询人才库条目
 * @param params 查询参数
 * @returns Promise 查询结果，包含列表数据和分页信息
 */
export const queryTalents = (params: TalentQueryParams) => {
  return http.get<TalentListResponse>(TALENT_API, { params });
}; 