import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ProfilePage = () => {
  return (
    <Card title="User Profile">
      <Card.Meta
        avatar={<Avatar size={64} icon={<UserOutlined />} />}
        title="John Doe"
        description="Software Developer"
      />
      <p style={{ marginTop: '20px' }}>Email: john.doe@example.com</p>
      <p>Location: New York, USA</p>
      <p>Bio: Passionate about building great software and learning new technologies.</p>
    </Card>
  );
};

export default ProfilePage;