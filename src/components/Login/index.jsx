import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { ProFormText } from '@ant-design/pro-components'
import React from 'react'

const login = () => {
    return (
        <>
            <ProFormText
                name="username"
                fieldProps={{
                    size: 'middle',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={' admin or user'}
                rules={[
                    {
                        required: true,
                        message: 'Must Provide username!',
                    },
                ]} 
                />
            <ProFormText.Password
                name="password"
                fieldProps={{
                    size: 'middle',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'ant.design'}
                rules={[
                    {
                        required: true,
                        message: 'Must provide password！',
                    },
                ]} 
                />
        </>
    )
}

export default login
