import { useState, useEffect } from 'react';
import { Table, Button, Tag, notification, Card, Popconfirm, Form, Input, Cascader, Select, DatePicker } from 'antd';
import { titleSty } from '@/styles/sty'
import Title from '@/components/Title';
import { Link } from 'react-router-dom';

import { getCateListAPI } from '@/api/Cate'
import { getTagListAPI } from '@/api/Tag'
import { delArticleDataAPI, getArticleListAPI } from '@/api/Article';
import type { Tag as ArticleTag } from '@/types/app/tag';
import type { Cate } from '@/types/app/cate';
import type { Article, FilterArticle, FilterForm } from '@/types/app/article';

import dayjs from 'dayjs';

const ArticlePage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [articleList, setArticleList] = useState<Article[]>([]);

    const { RangePicker } = DatePicker;

    const getArticleList = async () => {
        setLoading(true);

        const { data } = await getArticleListAPI();
        setArticleList(data as Article[]);

        setLoading(false);
    };

    useEffect(() => {
        getArticleList()
    }, []);

    const delArticleData = async (id: number) => {
        setLoading(true);

        await delArticleDataAPI(id);
        notification.success({ message: '🎉 删除文章成功' })
        getArticleList();

        setLoading(false);
    };

    // 标签颜色
    const colors = ['', '#2db7f5', '#87d068', '#f50', '#108ee9'];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 100,
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            width: 300,
            render: (text: string) => <div className='line-clamp-1'>{text}</div>,
        },
        {
            title: '摘要',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            width: 350,
            render: (text: string) => <div className='line-clamp-2'>{text ? text : '该文章暂未设置文章摘要'}</div>,
        },
        {
            title: '分类',
            dataIndex: 'cateList',
            key: 'cateList',
            align: 'center',
            render: (cates: Cate[]) => cates.map((item, index) => <Tag key={item.id} color={colors[index]}>{item.name}</Tag>)
        },
        {
            title: '标签',
            dataIndex: 'tagList',
            key: 'tagList',
            align: 'center',
            render: (tags: ArticleTag[]) => tags.map((item, index) => <Tag key={item.id} color={colors[index]}>{item.name}</Tag>)
        },
        {
            title: '浏览量',
            dataIndex: 'view',
            key: 'view',
            align: 'center',
        },
        {
            title: '评论数量',
            dataIndex: 'comment',
            key: 'comment',
            align: 'center',
            render: (data: string) => <span>{data}</span>,
        },
        {
            title: '发布时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center',
            width: 200,
            render: (text: string) => dayjs(+text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            align: 'center',
            render: (text: string, record: Article) => (
                <div className='flex space-x-2'>
                    <Link to={`/create?id=${record.id}`}>
                        <Button>修改</Button>
                    </Link>

                    <Popconfirm title="警告" description="你确定要删除吗" okText="确定" cancelText="取消" onConfirm={() => delArticleData(record.id!)}>
                        <Button type="primary" danger>删除</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const onSubmit = async (values: FilterForm) => {
        const query: FilterArticle = {
            key: values.title,
            cateIds: values.cateIds,
            tagId: values.tagId,
            startDate: values?.createTime[0].valueOf() + '',
            endDate: values?.createTime[1].valueOf() + '',
        }

        const { data } = await getArticleListAPI({ query });
        setArticleList(data as Article[]);
    }

    const [cateList, setCateList] = useState<Cate[]>([])
    const [tagList, setTagList] = useState<ArticleTag[]>([])

    const getCateList = async () => {
        const { data } = await getCateListAPI()
        setCateList(data.filter(item => item.type === "cate") as Cate[])
    }

    const getTagList = async () => {
        const { data } = await getTagListAPI()
        setTagList(data as ArticleTag[])
    }

    useEffect(() => {
        getCateList()
        getTagList()
    }, [])

    return (
        <>
            <Title value="文章管理" />

            <Card className='my-2 overflow-scroll'>
                <Form layout="inline" onFinish={onSubmit} autoComplete="off" className='flex-nowrap'>
                    <Form.Item label="标题" name="title" className='w-2/12'>
                        <Input placeholder='请输入关键词' />
                    </Form.Item>

                    <Form.Item label="分类" name="cateIds" className='w-2/12'>
                        <Cascader
                            options={cateList}
                            maxTagCount="responsive"
                            fieldNames={{ label: "name", value: "id" }}
                            placeholder="请选择分类"
                        />
                    </Form.Item>

                    <Form.Item label="标签" name="tagIds" className='w-2/12'>
                        <Select
                            allowClear
                            options={tagList}
                            fieldNames={{ label: 'name', value: 'id' }}
                            placeholder="请选择标签"
                        />
                    </Form.Item>

                    <Form.Item label="时间范围" name="createTime" className='w-3/12'>
                        <RangePicker placeholder={["选择起始时间", "选择结束时间"]} />
                    </Form.Item>

                    <Form.Item className='pr-6'>
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card className={`${titleSty}`}>
                <Table
                    rowKey="id"
                    dataSource={articleList}
                    columns={columns as any}
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        position: ['bottomCenter'],
                        defaultPageSize: 8,
                    }}
                />
            </Card>
        </>
    );
};

export default ArticlePage;