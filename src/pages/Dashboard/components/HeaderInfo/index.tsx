import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { useUserStore } from '@/stores';

const HeaderInfo: React.FC = () => {
    const { user } = useUserStore();

    return (
        <div className="flex items-center xs:px-6 container mx-auto">
            {/* 头像 */}
            <img 
                src={user?.avatar || 'https://q1.qlogo.cn/g?b=qq&nk=3311118881&s=640'} alt="avatar"
                className="w-16 xs:w-24 h-16 xs:h-24 rounded-full mr-10 transition-transform duration-300 transform hover:scale-125 avatar-animation"
            />

            {/* 信息 */}
            <div className="info">
                <div className="font-medium text-gradient">
                    <div className='text-2xl'>Hello <span className='pr-4'>{user?.name || '未命名'}!</span></div>
                    <div className='text-base xsm:text-lg xs:mt-2.5'>欢迎使用现代化博客管理系统</div>
                </div>
            </div>
        </div>
    );
};

export default HeaderInfo;
