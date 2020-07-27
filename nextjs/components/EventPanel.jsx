import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from "react-i18next";
import { Carousel } from 'antd';

@inject('environment', 'auth')
@observer
class EventPanel extends React.Component {
    render() {
        return (
            <div className="site-layout-content">
                <Carousel autoplay dotPosition='left' style={{
                    textAlign: 'center',
                    height: '500px',
                    overflow: 'hidden',
                    borderRadius: '20px',
                    margin: '20px',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)'
                }}>
                    <div>
                        <img src='https://cdn.wallpapersafari.com/82/13/nlpBKP.jpg' style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <img src='https://simracingsetup.com/wp-content/uploads/2020/02/F1-2020-All-Team-Desktop-Wallpaper.jpg' style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <img src='https://wallpaperaccess.com/full/890113.png' style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                    </div>
                </Carousel>
            </div>
        );
    }
}

export default withTranslation('EventPanel')(EventPanel);