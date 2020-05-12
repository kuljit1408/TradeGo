import React, { Component } from 'react';
import YouTube from 'react-youtube';

class content extends Component {
    render() {
        const opts = {
          height: '390',
          width: '800',
          playerVars: {
            autoplay: 1
          }
        };
      return (  
        <div>
          <div class="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4"> 
            <h1 class="py-2">What we stands for...</h1>
          </div>
          <div class="custom-video">
              <YouTube
                videoId="qtmfCMtlsag"
                opts={opts}
                onReady={this._onReady}
              />
          </div>  
        </div>         
      );
    }
    _onReady(event) {
      event.target.pauseVideo();
    }
  }
  
  export default content;