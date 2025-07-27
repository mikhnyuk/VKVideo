class VKVideoTool {
  static get toolbox() {
    return {
      title: 'VK Video',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.84961 5H14.1504C15.3314 5 16.2123 5.0648 16.8789 5.21289C17.5339 5.35845 17.9194 5.57096 18.1738 5.8252C18.4282 6.07952 18.6414 6.46488 18.7871 7.12012C18.9353 7.78677 19 8.66807 19 9.84961V14.1504C19 15.3314 18.9352 16.2123 18.7871 16.8789C18.6416 17.5339 18.429 17.9194 18.1748 18.1738C17.9205 18.4282 17.5351 18.6414 16.8799 18.7871C16.2132 18.9353 15.3319 19 14.1504 19H9.84961C8.66859 19 7.78769 18.9352 7.12109 18.7871C6.46605 18.6416 6.08059 18.429 5.82617 18.1748C5.57179 17.9205 5.3586 17.5351 5.21289 16.8799C5.06466 16.2132 5 15.3319 5 14.1504V9.84961C5 8.66859 5.0648 7.78769 5.21289 7.12109C5.35845 6.46605 5.57096 6.08059 5.8252 5.82617C6.07952 5.57179 6.46488 5.3586 7.12012 5.21289C7.78677 5.06466 8.66807 5 9.84961 5Z" stroke="black" stroke-width="2"/> <path d="M12.5969 5H14.1213C16.514 5 17.578 5.27605 18.1292 5.78711C18.6572 6.27676 18.9707 7.23095 18.9973 9.50293V9.50488C18.9988 9.61533 18.9983 9.72691 18.9983 9.84961V14.1504L18.9963 14.4727C18.9721 16.7571 18.6606 17.7174 18.1321 18.21C17.871 18.4532 17.4768 18.6574 16.8196 18.7969C16.1535 18.9382 15.2801 19 14.1213 19H12.5969C11.4097 19 10.5235 18.9355 9.85278 18.7871C9.19339 18.6412 8.8052 18.4277 8.54907 18.1729C8.29331 17.9182 8.07997 17.5325 7.93384 16.8779C7.78516 16.2118 7.71997 15.3313 7.71997 14.1504V9.84961C7.71997 8.6687 7.78516 7.78821 7.93384 7.12207C8.07997 6.4675 8.29331 6.08178 8.54907 5.82715C8.8052 5.57226 9.19339 5.35883 9.85278 5.21289C10.5235 5.06446 11.4097 5 12.5969 5Z" stroke="black" stroke-width="2"/> <path d="M15.2896 10.6162C16.0976 11.0834 16.5024 11.317 16.6384 11.621C16.7568 11.8866 16.7568 12.1906 16.6384 12.4562C16.5024 12.7602 16.0976 12.9938 15.2896 13.461L13.0736 14.741C12.264 15.2098 11.8592 15.4418 11.528 15.4082C11.2384 15.3778 10.9744 15.2258 10.8048 14.9906C10.6096 14.7202 10.6096 14.2546 10.6096 13.3202V10.7602C10.6096 9.82737 10.6096 9.36017 10.8048 9.08977C10.976 8.85457 11.2384 8.70257 11.528 8.67217C11.8608 8.63697 12.264 8.87057 13.0736 9.33777L15.2896 10.6162Z" fill="black"/> </svg>'
    };
  }

  get CSS() {
    return {
      baseClass: 'cdx-block',
      input: 'cdx-input',
      container: 'vk-video-tool',
      inputEl: 'vk-video-tool__input',
      inputHolder: 'vk-video-tool__input-holder',
      inputError: 'vk-video-tool__input-holder--error',
      linkContent: 'vk-video-tool__content',
      linkContentRendered: 'vk-video-tool__content--rendered',
      progress: 'vk-video-tool__progress',
      progressLoading: 'vk-video-tool__progress--loading',
      progressLoaded: 'vk-video-tool__progress--loaded',
    };
  }

  constructor({ data }) {
    this.data = data || { url: '', html: '' };
    this.nodes = {
      wrapper: null,
      container: null,
      progress: null,
      input: null,
      inputHolder: null,
      videoContent: null,
    };
  }

  render() {
    this.nodes.wrapper = this.make('div', this.CSS.baseClass);
    this.nodes.container = this.make('div', this.CSS.container);

    this.nodes.inputHolder = this.makeInputHolder();
    this.nodes.videoContent = this.make('div', this.CSS.linkContent);

    if (Object.keys(this.data).length) {
      this.showVideo(this.data);
      this.nodes.container.appendChild(this.nodes.videoContent);
    } else {
      this.nodes.container.appendChild(this.nodes.inputHolder);
    }

    this.nodes.wrapper.appendChild(this.nodes.container);

    return this.nodes.wrapper;
  }

  make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  makeInputHolder() {
    const inputHolder = this.make('div', this.CSS.inputHolder);

    this.nodes.input = this.make('div', [this.CSS.input, this.CSS.inputEl], {
      contentEditable: true,
    });

    this.nodes.input.dataset.placeholder = 'Embed code <iframe src=\"https://vkvideo.ru/video_ext.php...\">';

    this.nodes.input.addEventListener('paste', (event) => {
      this.startEmbedding(event);
    });

    this.nodes.input.addEventListener('keydown', (event) => {
      const [ENTER, A] = [13, 65];
      const cmdPressed = event.ctrlKey || event.metaKey;

      switch (event.keyCode) {
        case ENTER:
          event.preventDefault();
          event.stopPropagation();
          this.startEmbedding(event);
          break;
        case A:
          if (cmdPressed) {
            event.preventDefault();
            event.stopPropagation();
          }
          break;
      }
    });

    inputHolder.appendChild(this.nodes.input);

    return inputHolder;
  }

  startEmbedding(event) {
    let url = this.nodes.input.textContent;

    if (event.type === 'paste') {
      url = (event.clipboardData || window.clipboardData).getData('text');
    }

    this._createVideoEmbed(url);
  }

  _createVideoEmbed(url) {
    let iframeHtml = '';
    let videoSrc = url;

    const iframeMatch = url.match(/<iframe.*?src="(.*?)".*?\/iframe>/);
    if (iframeMatch) {
      iframeHtml = url;
      videoSrc = iframeMatch[1];
    } else {
      try {
        const parsedUrl = new URL(url);
        const videoId = parsedUrl.searchParams.get('z') || parsedUrl.pathname.split('/').pop();
        if (videoId) {
          videoSrc = `https://vk.com/video_ext.php?${videoId}&hd=2`;
          iframeHtml = `<iframe src="${videoSrc}" width="853" height="480" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>`;
        } else {
          throw new Error('Invalid URL');
        }
      } catch (e) {
        this.nodes.videoContent.innerHTML = '<p>Invalid VK video URL or embed code.</p>';
        return;
      }
    }

    this.data = { url, html: iframeHtml };
    this.nodes.videoContent.innerHTML = iframeHtml;
    this.showVideo();
  }

  showVideo() {
    this.nodes.container.appendChild(this.nodes.videoContent);
    this.nodes.videoContent.classList.add(this.CSS.linkContentRendered);
    this.nodes.container.removeChild(this.nodes.inputHolder);
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    return !!savedData.html;
  }
}