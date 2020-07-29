import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { Carousel, Tag } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

@inject('environment', 'auth')
@observer
class EventPanel extends React.Component {
    render() {
        const { events } = this.props;
        return (
            <div className="site-layout-content" style={{ overflow: 'hidden', margin: '10px', height: '200px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' }}>
                <Carousel autoplay dotPosition='left' style={{
                    height: '200px',
                    overflow: 'hidden',
                    borderRadius: '20px'
                }}>
                    {
                        events.map((event, index) => {
                            return (
                                <div key={index} style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                                    <img src={event.thumbnail} style={{ position: 'absolute', width: '100%', height: '200px', objectFit: 'cover', opacity: 0.5, zIndex: -1, borderRadius: '20px' }} />
                                    <div style={{ height: '200px', zIndex: 2, paddingLeft: '30px', paddingRight: '30px', paddingTop: '16px' }}>
                                        <div style={{ fontSize: '3.5em', color: 'white', textShadow: '2px 2px 2px gray' }}>{event.title}</div>
                                        <div style={{ fontSize: '1.5em', color: 'white', textShadow: '2px 2px 2px gray' }}>{event.description}</div>
                                        <div style={{ marginTop: '10px' }}>
                                            <Tag color='geekblue'><CalendarOutlined /> {event.begin} ~ <CalendarOutlined /> {event.end}</Tag>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </Carousel>
            </div>
        );
    }
}

export default withTranslation('EventPanel')(EventPanel);