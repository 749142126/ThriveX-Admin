import { useState, useEffect } from 'react';
import { Card, message, Table, Popconfirm, Button, Modal, Form, Input, DatePicker } from 'antd';
import { getCommentListAPI } from '@/api/Comment';
import { delCommentDataAPI } from '@/api/Comment';
import { ColumnsType } from 'antd/es/table';
import { titleSty } from '@/styles/sty';
import Title from '@/components/Title';
import { Comment, FilterForm } from '@/types/app/comment'
import dayjs from 'dayjs';

const CommentPage = () => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState<Comment>();
    const [list, setList] = useState<Comment[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const getCommentList = async () => {
        const { data } = await getCommentListAPI();

        setList(data)
        setLoading(false)
    }

    const delCommentData = async (id: number) => {
        setLoading(true)
        await delCommentDataAPI(id);
        getCommentList();
        message.success('🎉 删除评论成功');
    };

    useEffect(() => {
        setLoading(true)
        getCommentList();
    }, []);

    const columns: ColumnsType = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: "center"
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
        },
        {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            width: 400,
            render: (text: string, record) => <span className="hover:text-primary cursor-pointer line-clamp-2" onClick={() => {
                setComment(record)
                setIsModalOpen(true)
            }}>{text}</span>
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => text ? text : '暂无邮箱',
        },
        {
            title: '网站',
            dataIndex: 'url',
            key: 'url',
            render: (url: string) => url ? <a href={url} className="hover:text-primary">{url}</a> : '无网站',
        },
        {
            title: '所属文章',
            dataIndex: 'articleTitle',
            key: 'articleTitle',
            render: (text: string) => (text ? text : '该评论暂未绑定文章'),
        },
        {
            title: '评论时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (date: string) => dayjs(+date).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            align: 'center',
            render: (text: string, record: Comment) => (
                <div className='flex justify-center space-x-2'>
                    <Button onClick={() => {
                        setComment(record)
                        setIsModalOpen(true)
                    }}>查看</Button>

                    <Popconfirm title="警告" description="你确定要删除吗" okText="确定" cancelText="取消" onConfirm={() => delCommentData(record.id)}>
                        <Button type="primary" danger>删除</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const { RangePicker } = DatePicker;

    const onSubmit = async (values: FilterForm) => {
        const query: FilterData = {
            key: values?.title,
            content: values?.content,
            startDate: values.createTime && values.createTime[0].valueOf() + '',
            endDate: values.createTime && values.createTime[1].valueOf() + ''
        }

        const { data } = await getCommentListAPI({ query });
        setList(data)
    }

    return (
        <>
            <Title value='评论管理' />

            <Card className='my-2 overflow-scroll'>
                <Form layout="inline" onFinish={onSubmit} autoComplete="off" className='flex-nowrap'>
                    <Form.Item label="标题" name="title" className='w-2/12'>
                        <Input placeholder='请输入标题关键词' />
                    </Form.Item>

                    <Form.Item label="内容" name="content" className='w-2/12'>
                        <Input placeholder='请输入内容关键词' />
                    </Form.Item>

                    <Form.Item label="时间范围" name="createTime" className='w-3/12'>
                        <RangePicker placeholder={["选择起始时间", "选择结束时间"]} />
                    </Form.Item>

                    <Form.Item className='pr-6'>
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card className={`${titleSty} mt-2`}>
                <Table
                    rowKey="id"
                    dataSource={list}
                    columns={columns}
                    loading={loading}
                    expandable={{ defaultExpandAllRows: true }}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        position: ['bottomCenter'],
                        defaultPageSize: 8,
                    }}
                />
            </Card>

            <Modal title='评论详情' open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <div className='pt-2 space-y-2'>
                    <div><b>所属文章：</b> {comment?.articleTitle}</div>
                    <div><b>评论时间：</b> {dayjs(comment?.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                    <div><b>评论用户：</b> {comment?.name}</div>
                    <div><b>邮箱：</b> {comment?.email ? comment?.email : "暂无邮箱"}</div>
                    <div><b>网站：</b> {comment?.url ? <a href={comment?.url} className="hover:text-primary">{comment?.url}</a> : '无网站'}</div>
                    <div><b>内容：</b> {comment?.content}</div>
                </div>
            </Modal>
        </>
    );
};

export default CommentPage;
