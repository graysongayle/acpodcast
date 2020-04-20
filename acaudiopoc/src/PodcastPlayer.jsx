
import React from 'react';
import { AppBar, Toolbar, IconButton, Grid, Divider, LinearProgress } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { PlayArrow, Pause, Audiotrack, Forward10, Replay10, SkipNext, SkipPrevious } from '@material-ui/icons';
import ReactAudioPlayer from 'react-audio-player';
import moment from 'moment';
var momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export class PodcastPlayer extends React.Component {

    podcastPlayer;
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            paused: true,
            muted: false,
            time: 0,
            loading: false
        }
        this.podcastPlayer = undefined;
    }

    handleTimeChange = (_event, value) => {
        this.podcastPlayer.audioEl.currentTime = this.podcastPlayer.audioEl.duration * value / 100
    }

    setPlaybackTime = (time) => {
        const { ready } = this.state;
        if (ready && this.podcastPlayer) {
            this.podcastPlayer.audioEl.currentTime = time;
        }
    }

    updatePlayback = () => {
        const { time, ready, pausePlayback } = this.state;
        if (!pausePlayback) {
            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if ((!ready && this.podcastPlayer.audioEl.readyState === 4) || ready || iOS) {
                this.setState({ ready: true }, () => {
                    if (this.podcastPlayer.audioEl.ended) {
                        this.setState({
                            time: 0,
                            paused: true
                        });
                    }
                    this.setState({
                        time: this.podcastPlayer ?
                            (this.podcastPlayer.audioEl.currentTime / this.podcastPlayer.audioEl.duration) * 100 :
                            time
                    })
                })
            }
        }
    }

    componentDidMount() {
        this.setState({ loading: true }, () => {
            this.interval = setInterval(() => this.updatePlayback(), this.podcastPlayer.audioEl.defaultPlaybackRate * 50);
            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (iOS) {
                this.setState({ loading: false });
                this.podcastPlayer.audioEl.addEventListener("onplay", () => {
                    alert('onplay');
                    this.setState({ loading: true });
                });
            }
            this.podcastPlayer.audioEl.addEventListener("canplaythrough", () => {
                this.setState({ loading: false })
            });
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    timeRemaining = () => {
        const { loading } = this.state;
        var remainder = "";
        var seconds = this.podcastPlayer.audioEl.duration - this.podcastPlayer.audioEl.currentTime;
        if (loading) {
            return "Loading..."
        }
        if (seconds < 60) {
            remainder = `${Math.round(seconds)} seconds remaining`;
        } else {
            remainder = `${Math.floor(seconds / 60)} minutes remaining`;
        }
        return remainder;
    }

    render() {
        const { time, paused, ready, loading } = this.state;
        return <div>
            {this.podcastPlayer ?
                <div style={{ color: "white", position: 'fixed', top: 0 }}>
                    <div>
                        Slider Duration: {time}
                    </div>

                    <div>
                        Current Time:  {this.podcastPlayer.audioEl.currentTime}
                    </div>
                    <div>
                        Time Remaining: {this.podcastPlayer.audioEl.duration - this.podcastPlayer.audioEl.currentTime}
                    </div>
                </div> : undefined
            }

            <ReactAudioPlayer
                title="podcast #1"
                src="https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_1MG.mp3"
                ref={(element) => { this.podcastPlayer = element; }}
            />
            <AppBar style={{ color: "black" }} className="podcast-app-bar" position="fixed" >
                {loading && <LinearProgress />}
                <Toolbar style={{ flexDirection: 'column' }}>
                    <Grid style={{ marginTop: 15, marginBottom: 15 }} alignItems="center" display="flex" container >
                        <Grid container justify="flex-start" item xs={12}>
                            <Grid wrap="nowrap" container direction="row" alignItems="center">
                                <Grid item>
                                    <Audiotrack style={{ marginRight: 10 }} />
                                </Grid>
                                <Grid item>
                                    <div><b>New Agent Onboarding</b></div>
                                    {this.podcastPlayer ? this.timeRemaining() : undefined}

                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid container xs={12} justify="center">
                        <Slider
                            style={{ marginBottom: 10 }}
                            value={time}
                            onDragStart={() => {
                                this.podcastPlayer.audioEl.pause();
                                this.setState({ paused: true });
                            }}
                            onDragEnd={() => {
                                this.podcastPlayer.audioEl.play();
                                this.setState({ paused: false });
                            }}
                            onChange={this.handleTimeChange}
                        />
                        <Divider />
                        <Grid container justify="space-between">
                            <Grid item>
                                {this.podcastPlayer ? moment.duration(this.podcastPlayer.audioEl.currentTime, 'seconds').format("mm:ss", { trim: false }) : undefined}
                            </Grid>
                            <Grid item>
                                {this.podcastPlayer ? moment.duration(this.podcastPlayer.audioEl.duration, 'seconds').format("mm:ss", { trim: false }) : undefined}
                            </Grid>
                        </Grid>
                        <Grid style={{ marginBottom: 10 }} container wrap="nowrap" justify="center" item>
                            <Grid container justify="space-evenly" item xs={12} md={4}>
                                <IconButton onClick={() => { this.setPlaybackTime(this.podcastPlayer.audioEl.currentTime - 10) }}>
                                    <Replay10 />
                                </IconButton>
                                <IconButton onClick={() => { this.setPlaybackTime(0) }}>
                                    <SkipPrevious />
                                </IconButton>
                                {paused ?

                                    <IconButton className="main-btn" disabled={!ready} onClick={() => {
                                        this.setState({ paused: false });
                                        this.podcastPlayer.audioEl.play();
                                    }}>
                                        <PlayArrow />
                                    </IconButton>
                                    :
                                    <IconButton className="main-btn" disabled={!ready} onClick={() => {
                                        this.setState({ paused: true });
                                        this.podcastPlayer.audioEl.pause();
                                    }}>
                                        <Pause />
                                    </IconButton>}
                                <IconButton onClick={() => { this.setPlaybackTime(this.podcastPlayer.audioEl.duration) }}>
                                    <SkipNext />
                                </IconButton>
                                <IconButton onClick={() => { this.setPlaybackTime(this.podcastPlayer.audioEl.currentTime + 10) }}>
                                    <Forward10 />
                                </IconButton>
                            </Grid>

                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div >
    }
}