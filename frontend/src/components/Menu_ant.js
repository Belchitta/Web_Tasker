import React from 'react';
import {
  Link
} from "react-router-dom";
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

function NavbarItem({name, href}) {
    return (
        <li>
          <Link to={href}>{name}</Link>
        </li>
        )
    }

export default function Navbar({navbarItems, auth, logout}) {
    let login_button = ''
    if (auth.is_login) {
    login_button = <button className="btn btn-outline-success my-2 my-sm-0" onClick={logout}>Hello, {auth.username} Logout</button>
    }
    else {
      login_button = <Link to='/login' className="btn btn-outline-success my-2 my-sm-0">Login</Link>
    }

    const Navbar: React.FC = () => {
      const {
        token: { colorBgContainer },
      } = theme.useToken();


      return (
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['4']}
              items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
                (icon, index) => ({
                  //key: String(index + 1),
                  icon: React.createElement(icon),
                  label: `index {navbarItems.map((item) => <NavbarItem name={item.name} href={item.href} />)}`,
                }),
              )}
            />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }} />
            <Content style={{ margin: '24px 16px 0' }}>
              <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>content</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
          </Layout>
        </Layout>
        );
      }
}