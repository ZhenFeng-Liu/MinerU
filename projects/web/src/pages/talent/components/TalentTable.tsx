import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { TalentInfo, TalentStatus } from '../../../types/talent';
import { deleteTalents } from '../../../api/talentapi';
import './buttonStyles.css'; // 导入按钮样式
import { useIntl } from 'react-intl';
import { useNavigate } from "react-router-dom";
interface TalentTableProps {
  dataSource: TalentInfo[];
  loading: boolean;
  total: number;
  current: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onRefresh: () => void;
  onEdit: (record: TalentInfo) => void;
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: TalentInfo[]) => void;
}

const statusColors: Record<TalentStatus, string> = {
  '新候选人': 'blue',
  '初选通过': 'cyan',
  '安排面试': 'geekblue',
  '面试通过': 'purple',
  '已发offer': 'gold',
  '待入职': 'lime',
  '已发offer未入职': 'orange',
  '已淘汰': 'gray'
};

const TalentTable: React.FC<TalentTableProps> = ({
  dataSource,
  loading,
  total,
  current,
  pageSize,
  onPageChange,
  onRefresh,
  onEdit,
  onSelectChange
}) => {
  const intl = useIntl();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<TalentInfo | null>(null);
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (!currentRecord) return;
    
    try {
      await deleteTalents([Number(currentRecord.id)]);
      message.success('删除成功');
      setDeleteModalVisible(false);
      onRefresh();
    } catch (error: unknown) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleView = (
    // originType: ExtractTaskType,
     id: string) => {
    // const type = originType?.split("-")[0];
    // const detailType = originType?.split("-")[1];

    // if (type === EXTRACTOR_TYPE_LIST.formula.toLowerCase()) {
    //   navigate(`/OpenSourceTools/Extractor/formula/${id}?type=${detailType}`);
    // } else if (type === EXTRACTOR_TYPE_LIST.pdf.toLowerCase()) {
      navigate(`/OpenSourceTools/Extractor/PDF/${id}`);
    // } else if (type === EXTRACTOR_TYPE_LIST.table.toLocaleLowerCase()) {
      // navigate(`/OpenSourceTools/Extractor/table/${id}`);
    // }
    return;
  };

  const columns: ColumnsType<TalentInfo> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 50,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 110,
    },
    {
      title: '应聘职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
      ellipsis: true,
    },
    {
      title: '招聘渠道',
      dataIndex: 'recruitmentChannel',
      key: 'recruitmentChannel',
      width: 100,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: TalentStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '入职时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      width: 90,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 70,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
              className="no-outline-btn" // 应用自定义样式
            ></Button>
          </Tooltip>
          <Tooltip title="查看简历">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => {
                console.log("record:", record);
                // 打印可能存在的analysis_task_id
                if (record.analysis_task_id !== undefined) {
                  handleView(String(record.analysis_task_id));
                }
              }} 
              className="no-outline-btn" // 应用自定义样式
            ></Button>
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => {
                setCurrentRecord(record);
                setDeleteModalVisible(true);
              }} 
              className="no-outline-btn" // 应用自定义样式
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="h-full">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current,
          pageSize,
          total,
          onChange: onPageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => intl.formatMessage(
            { id: 'talent.pagination.total' },
            { total }
          ),
          locale: {
            items_per_page: intl.formatMessage({ id: 'talent.pagination.items_per_page' }),
            jump_to: intl.formatMessage({ id: 'talent.pagination.jump_to' }),
            jump_to_confirm: intl.formatMessage({ id: 'talent.pagination.jump_to_confirm' }),
            page: intl.formatMessage({ id: 'talent.pagination.page' }),
            prev_page: intl.formatMessage({ id: 'talent.pagination.prev_page' }),
            next_page: intl.formatMessage({ id: 'talent.pagination.next_page' }),
            prev_5: intl.formatMessage({ id: 'talent.pagination.prev_5' }),
            next_5: intl.formatMessage({ id: 'talent.pagination.next_5' }),
          }
        }}
        rowSelection={{
          type: 'checkbox',
          onChange: onSelectChange
        }}
        scroll={{ y: 'calc(100vh - 340px)' }}
        className="h-full"
      />
      
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要删除 {currentRecord?.name} 的记录吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default TalentTable; 