import React from 'react';
import playback from '../static/spacex.mp4'

const BackgroundVideo = () => {
    return (
        <section >
            <video autoPlay="autoplay" loop="loop" muted style={{ minHeight: '100%', minWidth: '100%' }}>
                <source src={playback} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
        </section>
    )
}

export default BackgroundVideo;