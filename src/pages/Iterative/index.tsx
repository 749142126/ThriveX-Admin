import { Card, Select, Timeline, TimelineItemProps } from 'antd';
import { useEffect, useState } from 'react';
import GitHubCalendar from 'react-github-calendar';
import Title from '@/components/Title';
import dayjs from 'dayjs'

interface Commit {
    commit: {
        author: { date: string },
        message: string
    }
}

const Home = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [yearList, setYearList] = useState<{ value: number, label: string }[]>([])

    const [blog_iterativeRecording, setBlog_IterativeRecording] = useState<TimelineItemProps[]>([])
    const [admin_iterativeRecording, setAdmin_IterativeRecording] = useState<TimelineItemProps[]>([])
    const [server_iterativeRecording, setServer_IterativeRecording] = useState<TimelineItemProps[]>([])

    // 从github获取最近10次迭代记录
    const getCommitData = async (project: string) => {
        const res = await fetch(`https://api.github.com/repos/LiuYuYang01/${project}/commits?per_page=10`)
        const data = await res.json()
        const result = data.map((item: Commit) => (
            {
                label: dayjs(item.commit.author.date).format("YYYY-MM-DD HH:mm:ss"),
                children: item.commit.message
            }
        ))

        sessionStorage.setItem('blog_project_iterative', JSON.stringify(result))
        project === "Thrive_Blog" && setBlog_IterativeRecording(result)

        sessionStorage.setItem('admin_project_iterative', JSON.stringify(result))
        project === "Thrive_Admin" && setAdmin_IterativeRecording(result)

        sessionStorage.setItem('server_project_iterative', JSON.stringify(result))
        project === "Thrive_Api_Py" && setServer_IterativeRecording(result)
    }

    useEffect(() => {
        // 获取当前年份
        const currentYear = dayjs().year();
        // 生成最近10年的年份数组
        const yearList = Array.from({ length: 10 }, (_, i) => currentYear - i);
        setYearList(yearList.map(item => ({ value: item, label: item + '' })))

        // 如果缓存中有值就无需重新调接口
        const blog_project_iterative = JSON.parse(sessionStorage.getItem('blog_project_iterative') || '[]')
        blog_project_iterative.length ? setBlog_IterativeRecording(blog_project_iterative) : getCommitData("Thrive_Blog")

        const admin_project_iterative = JSON.parse(sessionStorage.getItem('admin_project_iterative') || '[]')
        admin_project_iterative.length ? setAdmin_IterativeRecording(admin_project_iterative) : getCommitData("Thrive_Admin")

        const server_project_iterative = JSON.parse(sessionStorage.getItem('server_project_iterative') || '[]')
        server_project_iterative.length ? setServer_IterativeRecording(server_project_iterative) : getCommitData("Thrive_Api_Py")
    }, [])

    return (
        <>
            <Title value='项目迭代记录'></Title>

            <Card className='mt-2'>
                <div className='flex flex-col items-center mt-2 mb-22'>
                    <div className='ml-5 mb-6'>
                        <span>年份切换：</span>

                        <Select
                            size='small'
                            defaultValue={year}
                            options={yearList}
                            onChange={setYear}
                            className='w-20'
                        />
                    </div>

                    <GitHubCalendar username="liuyuyang01" year={year} />
                </div>

                <div className='flex justify-between'>
                    <div className='flex-1'>
                        <h3 className='text-xl text-center pb-6 font-bold text-gradient block'>Thrive_Blog</h3>
                        <Timeline mode="left" items={blog_iterativeRecording} />
                    </div>

                    <div className='flex-1'>
                        <h3 className='text-xl text-center pb-6 font-bold text-gradient block'>Thrive_Admin</h3>
                        <Timeline mode="left" items={admin_iterativeRecording} />
                    </div>

                    <div className='flex-1'>
                        <h3 className='text-xl text-center pb-6 font-bold text-gradient block'>Thrive_Server</h3>
                        <Timeline mode="left" items={server_iterativeRecording} />
                    </div>
                </div>
            </Card>
        </>
    );
};

export default Home;