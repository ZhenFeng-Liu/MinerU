/* eslint-disable @typescript-eslint/no-unused-vars */
import { TalentInfo, TalentListResponse, TalentSearchParams, TalentStatus, Gender } from '../types/talent';

// 模拟数据
const generateMockData = (): TalentInfo[] => {
  const statusOptions: TalentStatus[] = [
    '新候选人',
    '初选通过',
    '安排面试',
    '面试通过',
    '已发offer',
    '待入职',
    '已发offer未入职',
    '已淘汰'
  ];

  const genderOptions: Gender[] = ['男', '女'];

  const positions = [
    '前端开发工程师',
    '后端开发工程师',
    'UI设计师',
    '产品经理',
    '数据分析师',
    'DevOps工程师',
    '测试工程师',
    '全栈开发工程师',
    '项目经理',
    '运维工程师'
  ];

  const recruitmentChannels = [
    '前程无忧',
    'Boss直聘',
    '智联招聘',
    '拉勾网',
    '猎聘网',
    '中国人才热线',
    '58同城',
    '赶集网',
    '大街网',
    '中华英才网',
    '内部推荐',
    '员工推荐',
    '微信招聘',
    '其他'
  ];

  const operators = [
    '小明',
    '小红',
    '小李',
    '小张',
    '小王'
  ];

  const surnames = [
    '张', '李', '王', '赵', '刘', 
    '陈', '杨', '黄', '周', '吴', 
    '徐', '孙', '马', '朱', '胡', 
    '林', '郭', '何', '高', '罗'
  ];

  const names = [
    '伟', '芳', '娜', '秀英', '敏', 
    '静', '丽', '强', '磊', '军', 
    '洋', '勇', '艳', '杰', '娟', 
    '涛', '明', '超', '秀兰', '霞', 
    '平', '刚', '桂英', '文', '云',
    '建国', '建华', '建军', '国强', '国庆'
  ];

  const mockData: TalentInfo[] = [];

  // 生成50条模拟数据
  for (let i = 1; i <= 50; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const fullName = surname + name;
    
    const gender = genderOptions[Math.floor(Math.random() * genderOptions.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const recruitmentChannel = recruitmentChannels[Math.floor(Math.random() * recruitmentChannels.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    // 生成随机的创建时间（过去90天内）
    const now = new Date();
    const createDate = new Date(now.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);
    const createTime = createDate.toISOString().split('T')[0];
    
    // 更新时间（创建时间之后的10天内）
    const updateDate = new Date(createDate.getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000);
    const updateTime = updateDate.toISOString().split('T')[0];
    
    // 入职时间仅对"待入职"状态的人才有效
    let entryTime = undefined;
    if (status === '待入职') {
      const entryDate = new Date(updateDate.getTime() + Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000);
      entryTime = entryDate.toISOString().split('T')[0];
    }

    // 生成手机号
    const phonePrefix = ['138', '139', '137', '136', '135', '134', '188', '187', '183', '182', '159', '158', '157', '152', '151', '150'];
    const selectedPrefix = phonePrefix[Math.floor(Math.random() * phonePrefix.length)];
    const phoneNumber = selectedPrefix + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

    mockData.push({
      id: `talent_${i}`,
      name: fullName,
      gender,
      phone: phoneNumber,
      position,
      recruitmentChannel,
      status,
      entryTime,
      operator,
      createTime,
      updateTime
    });
  }

  return mockData;
};

const mockData = generateMockData();

// 获取人才列表 - 使用模拟数据
export const getTalentList = async (params: TalentSearchParams): Promise<TalentListResponse> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 筛选数据
  let filteredData = [...mockData];

  // 关键词筛选（姓名、手机号、职位）
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.phone.includes(keyword) || 
      item.position.toLowerCase().includes(keyword)
    );
  }

  // 状态筛选
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status);
  }
  
  // 招聘渠道筛选
  if (params.recruitmentChannel) {
    filteredData = filteredData.filter(item => item.recruitmentChannel === params.recruitmentChannel);
  }

  // 入职时间范围筛选
  if (params.startTime && params.endTime) {
    filteredData = filteredData.filter(item => {
      if (!item.entryTime) return false;
      return item.entryTime >= params.startTime! && item.entryTime <= params.endTime!;
    });
  }

  // 计算分页
  const total = filteredData.length;
  const startIndex = (params.current - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 返回结果
  return {
    data: paginatedData,
    total,
    current: params.current,
    pageSize: params.pageSize
  };
};

// 获取单个人才详情
export const getTalentDetail = async (id: string): Promise<TalentInfo> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const talent = mockData.find(item => item.id === id);
  if (!talent) {
    throw new Error('人才不存在');
  }
  
  return talent;
};

// 创建新人才
export const createTalent = async (data: Omit<TalentInfo, 'id' | 'createTime' | 'updateTime'>): Promise<{ success: boolean; id: string }> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 在实际环境中此处应该调用真实API
  // 这里我们模拟生成一个新ID并返回
  const newId = `talent_${mockData.length + 1}`;
  
  // 添加到模拟数据中
  const now = new Date().toISOString().split('T')[0];
  
  const newTalent: TalentInfo = {
    id: newId,
    name: data.name,
    gender: data.gender,
    phone: data.phone,
    position: data.position,
    recruitmentChannel: data.recruitmentChannel,
    status: data.status,
    entryTime: data.entryTime,
    operator: data.operator,
    createTime: now,
    updateTime: now
  };
  
  mockData.push(newTalent);
  
  return { success: true, id: newId };
};

// 更新人才信息
export const updateTalent = async (data: Partial<TalentInfo> & { id: string }): Promise<{ success: boolean }> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 在实际环境中此处应该调用真实API
  // 这里我们在模拟数据中查找并更新
  const index = mockData.findIndex(item => item.id === data.id);
  if (index !== -1) {
    mockData[index] = {
      ...mockData[index],
      ...data,
      updateTime: new Date().toISOString().split('T')[0]
    };
  }
  
  return { success: true };
};

// 批量更新人才状态
export const batchUpdateStatus = async (_ids: string[], _status: TalentStatus): Promise<{ success: boolean }> => {
  // 在实际环境中此处应该调用真实API
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};

// 批量删除人才
export const batchDeleteTalent = async (_ids: string[]): Promise<{ success: boolean }> => {
  // 在实际环境中此处应该调用真实API
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true };
};

// 删除人才
export const deleteTalent = async (_id: string): Promise<{ success: boolean }> => {
  // 在实际环境中此处应该调用真实API
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}; 