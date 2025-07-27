![image.png](image.png)

# VK Video Tool for Editor.js

VK Video Tool is a custom block tool for Editor.js that allows you to embed VK (Vkontakte) videos directly into your Editor.js content.

## Features

- Embed VK videos using their URLs.
- Automatically generates an iframe for video playback.
- Handles various VK video URL formats.

## Installation

### 1. Get the package

Clone this repository or download the files.

### 2. Include modules at your application

Include `src/index.js` and `src/index.css` in your HTML file.

```html
<link rel="stylesheet" href="./src/index.css">
<script src="./src/index.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
```

### 3. Usage

Add `VKVideoTool` to the `tools` property of your Editor.js initial configuration.

```javascript
const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    vkVideo: {
      class: VKVideoTool,
      inlineToolbar: true,
    },
    // ... other tools
  },
  // ... other configurations
});
```

## Example `src/index.js` content

Below is the complete JavaScript code for the `VKVideoTool` class. You should use this content for your `src/index.js` file.

```javascript
class VKVideoTool {
  static get toolbox() {
    return {
      title: 'VK Video',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M336 63.3v149.4c0 10.8-8.7 19.5-19.5 19.5h-54.7c-10.8 0-19.5-8.7-19.5-19.5V63.3c0-10.8 8.7-19.5 19.5-19.5h54.7c10.8 0 19.5 8.7 19.5 19.5zM234.8 43.8H180c-10.8 0-19.5 8.7-19.5 19.5v149.4c0 10.8 8.7 19.5 19.5 19.5h54.7c10.8 0 19.5-8.7 19.5-19.5V63.3c0-10.8-8.7-19.5-19.5-19.5zM133.6 43.8H78.9c-10.8 0-19.5 8.7-19.5 19.5v149.4c0 10.8 8.7 19.5 19.5 19.5h54.7c10.8 0 19.5-8.7 19.5-19.5V63.3c0-10.8-8.7-19.5-19.5-19.5zM32.4 43.8H19.5C8.7 43.8 0 52.5 0 63.3v149.4c0 10.8 8.7 19.5 19.5 19.5h12.9c10.8 0 19.5-8.7 19.5-19.5V63.3c0-10.8-8.7-19.5-19.5-19.5z"/></svg>'
    };
  }

  constructor({ data }) {
    this.data = data;
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    const input = document.createElement('input');

    this.wrapper.classList.add('vk-video-tool');
    input.placeholder = 'Enter VK video URL or iframe embed code';
    input.value = this.data && this.data.url ? this.data.url : '';

    input.addEventListener('paste', (event) => {
      const pastedText = event.clipboardData.getData('text');
      this._createVideoEmbed(pastedText);
    });

    if (this.data && this.data.html) {
      this.wrapper.innerHTML = this.data.html;
    } else if (this.data && this.data.url) {
      this._createVideoEmbed(this.data.url);
    }

    this.wrapper.appendChild(input);

    return this.wrapper;
  }

  _createVideoEmbed(input) {
    let videoSrc = '';
    let iframeHtml = '';

    // Check if it's an iframe embed code
    const iframeMatch = input.match(/<iframe.*?src="(.*?)".*?<\/iframe>/);
    if (iframeMatch && iframeMatch[1]) {
      videoSrc = iframeMatch[1];
      iframeHtml = input;
    } else {
      // Assume it's a URL and try to parse it
      const url = new URL(input);
      const videoId = url.searchParams.get('z') || url.pathname.split('/').pop();

      if (videoId) {
        // Construct the VK video embed URL
        // Example: https://vk.com/video_ext.php?oid=-123456789&id=456239017&hash=abcdef1234567890&hd=2
        // Ensure autoplay is off for Editor.js
        videoSrc = `https://vk.com/video_ext.php?${videoId}&autoplay=0`;
        iframeHtml = `<iframe src="${videoSrc}" width="853" height="480" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" frameborder="0" allowfullscreen></iframe>`;
      }
    }

    if (videoSrc) {
      this.wrapper.innerHTML = iframeHtml;
      this.data = { url: input, html: iframeHtml };
    } else {
      this.wrapper.innerHTML = '<p>Invalid VK video URL or embed code.</p>';
      this.data = {};
    }
  }

  save(blockContent) {
    const input = blockContent.querySelector('input');
    if (input && input.value) {
      return { url: input.value, html: this.data.html };
    } else if (this.data && this.data.html) {
      return this.data;
    }
    return {};
  }

  validate(savedData) {
    if (!savedData.url && !savedData.html) {
      return false;
    }
    return true;
  }
}
```