import React, { useState, useEffect } from 'react';
import { Card, Button, message, Typography, Modal } from 'antd';
import { PlusOutlined, UserSwitchOutlined, DeleteOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import TalentTable from './components/TalentTable';
import TalentSearch from './components/TalentSearch';
import TalentStatusModal from './components/TalentStatusModal';
import TalentFormModal from './components/TalentFormModal';
import { TalentInfo, TalentSearchParams, TalentStatus, Gender } from '../../types/talent';
import type { RangePickerProps } from 'antd/es/date-picker';
import './components/buttonStyles.css'; // 导入按钮样式
// 导入需要使用的接口和方法
import { 
  deleteTalents, 
  queryTalents,
  TalentItem,
  TalentQueryParams,
  TalentListResponse
} from '../../api/talentapi';
const { Title } = Typography;

interface SearchFormValues {
  keyword?: string;
  status?: TalentStatus;
  recruitmentChannel?: string;
  timeRange?: RangePickerProps['value'];
}

const TalentManagement: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<TalentInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedTalents, setSelectedTalents] = useState<TalentInfo[]>([]);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingTalent, setEditingTalent] = useState<TalentInfo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<Partial<TalentSearchParams>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      // 将搜索参数转换为新API的查询参数格式
      const params: TalentQueryParams = {
        keyword: searchParams.keyword,
        statue: searchParams.status, // 注意字段名从status变为statue
        page: current,
        per_page: pageSize,
        start_date: searchParams.startTime,
        end_date: searchParams.endTime,
      };
      
      // 如果有id参数，添加到查询中
      if (searchParams.id) {
        params.id = searchParams.id;
      }
      
      console.log('查询参数:', params);
      const response = await queryTalents(params);
      console.log('查询结果:', response);
      
      // 处理API返回的数据
      // 根据http.ts中的处理，API响应在response.data.data中
      const apiResponseData = response.data?.data as TalentListResponse;
      const talentItems = apiResponseData?.dates || [];
      const totalCount = apiResponseData?.total || 0;
      
      // 将 TalentItem[] 转换为 TalentInfo[]
      const talentInfoList = talentItems.map((item: TalentItem) => ({
        id: String(item.id || ''),
        name: item.name || '',
        gender: (item.gender || '保密') as Gender,
        phone: item.phone || '',
        position: item.job || '', // job对应position
        recruitmentChannel: item.channel || '', // channel对应recruitmentChannel
        status: item.statue as TalentStatus || '新候选人', // statue对应status
        operator: item.inputer || '', // inputer对应operator
        createTime: '',  // API没有提供，设置默认值
        updateTime: '',  // API没有提供，设置默认值
      }));
      
      setDataSource(talentInfoList); 
      setTotal(totalCount);
    } catch (error) {
      console.error('获取人才列表失败:', error);
      message.error(intl.formatMessage({ id: 'talent.message.fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize, searchParams]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleSearch = (values: SearchFormValues) => {
    const { keyword, status, recruitmentChannel, timeRange } = values;
    
    const params: Partial<TalentSearchParams> = {
      keyword,
      status,
      recruitmentChannel,
    };

    if (timeRange && timeRange[0] && timeRange[1]) {
      params.startTime = timeRange[0].format('YYYY-MM-DD');
      params.endTime = timeRange[1].format('YYYY-MM-DD');
    }

    setCurrent(1); // 重置到第一页
    setSearchParams(params);
  };

  const handleReset = () => {
    setCurrent(1);
    setSearchParams({});
  };

  const handleSelectChange = (selectedKeys: React.Key[], selectedRows: TalentInfo[]) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedTalents(selectedRows);
  };

  const handleEdit = (record: TalentInfo) => {
    setEditingTalent(record);
    setFormModalVisible(true);
  };

  const handleAdd = () => {
    setEditingTalent(null);
    setFormModalVisible(true);
  };

  const getDeleteConfirmMessage = () => {
    const count = selectedTalents.length;
    
    // 显示所有选中的候选人姓名
    const names = selectedTalents.map(talent => talent.name).join('，');
    return intl.formatMessage(
      { id: 'talent.modal.batchDelete.contentWithNames' }, 
      { names, count }
    );
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    
    setDeleteLoading(true);
    try {
      // 转换id为数字类型，新API要求数字类型的id数组
      const ids = selectedRowKeys.map(key => Number(key));
      await deleteTalents(ids);
      
      message.success(intl.formatMessage(
        { id: 'talent.message.batchDeleteSuccess' }, 
        { count: selectedRowKeys.length }
      ));
      setDeleteModalVisible(false);
      setSelectedRowKeys([]);
      setSelectedTalents([]);
      fetchData();
    } catch (error) {
      console.error('批量删除失败:', error);
      message.error(intl.formatMessage({ id: 'talent.message.batchDeleteFailed' }));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden p-3 mx-auto">
      <Card className="h-full flex flex-col max-w-[98%] mx-auto">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <Title level={4} className="m-0 whitespace-nowrap">{intl.formatMessage({ id: 'talent.title' })}</Title>
          <div className="flex flex-wrap gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="no-outline-btn"
            >
              {intl.formatMessage({ id: 'talent.button.add' })}
            </Button>
            <Button
              icon={<UserSwitchOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={() => setStatusModalVisible(true)}
              className="no-outline-btn"
            >
              {intl.formatMessage({ id: 'talent.button.batchUpdateStatus' })}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={() => setDeleteModalVisible(true)}
              className="no-outline-btn"
            >
              {intl.formatMessage({ id: 'talent.button.batchDelete' })}
            </Button>
          </div>
        </div>

        <TalentSearch onSearch={handleSearch} onReset={handleReset} />

        <div className="flex-1 overflow-hidden">
          <TalentTable
            dataSource={dataSource}
            loading={loading}
            total={total}
            current={current}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onRefresh={fetchData}
            onEdit={handleEdit}
            onSelectChange={handleSelectChange}
          />
        </div>

        <TalentStatusModal
          visible={statusModalVisible}
          onCancel={() => setStatusModalVisible(false)}
          onSuccess={fetchData}
          selectedIds={selectedRowKeys.map(key => key.toString())}
        />

        <Modal
          title={intl.formatMessage({ id: 'talent.modal.batchDelete.title' })}
          open={deleteModalVisible}
          onOk={handleBatchDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText={intl.formatMessage({ id: 'talent.modal.batchDelete.confirm' })}
          cancelText={intl.formatMessage({ id: 'talent.modal.batchDelete.cancel' })}
          okButtonProps={{ loading: deleteLoading, className: "no-outline-btn" }}
          cancelButtonProps={{ className: "no-outline-btn" }}
          width={500}
        >
          <div style={{ whiteSpace: 'pre-line' }}>{getDeleteConfirmMessage()}</div>
        </Modal>

        <TalentFormModal
          visible={formModalVisible}
          onCancel={() => setFormModalVisible(false)}
          onSuccess={fetchData}
          editingTalent={editingTalent}
        />
      </Card>
    </div>
  );
};

export default TalentManagement; 