class PFModal extends HTMLElement {
  constructor() {
    super();
  }

  get visible() {
    return this.hasAttribute('visible');
  }

  set visible(value) {
    if (value) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(value) {
    this.setAttribute('title', value);
  }

  get focusableItems() {
    return this.shadowRoot.querySelector('[role="dialog"]').querySelectorAll(
      `button, [href], input, select, textarea, 
      [tabindex]:not([tabindex="-1"]), video`,
    );
  }

  connectedCallback() {
    this._render();
    this._attachEventHandlers();
  }

  static get observedAttributes() {
    return ['visible', 'title'];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === 'title' && this.shadowRoot) {
      this.shadowRoot.querySelector('.title').textContent = newValue;
    }
    if (name === 'visible' && this.shadowRoot) {
      if (newValue === null) {
        this.shadowRoot.querySelector('.overlay').classList.remove('visible');
      } else {
        this.shadowRoot.querySelector('.overlay').classList.add('visible');
        // we should focus on the close button here when modal opens
        this.shadowRoot
          .getElementById('close-btn')
          .focus({ focusVisible: true });
      }
    }
  }

  _attachEventHandlers() {
    // 1.  Close button modal -----------------
    const closeBtn = this.shadowRoot.getElementById('close-btn');

    closeBtn.addEventListener('click', () => {
      this.removeAttribute('visible');
    });

    // 1. handle backdrop click -------------
    const dialog = this.shadowRoot.querySelector('[role="dialog"]');
    const overlay = this.shadowRoot.querySelector('.overlay');

    console.log({ overlay });

    overlay.addEventListener('click', (e) => {
      if (dialog.contains(e.target)) {
        // click was within the modal
        return;
      }
      // Else, close the modal
      this.removeAttribute('visible');
    });

    overlay.addEventListener('keydown', this._handleEscKeypress.bind(this));

    console.log('attching window');
    window.addEventListener('keydown', this._handleFocusTrap.bind(this));
  }

  // 3. Handle 'Esc' keypress -------------
  _handleEscKeypress(event) {
    if (this.visible && event.key === 'Escape') {
      event.preventDefault();
      this.removeAttribute('visible');
    }
  }

  // 4. focus trap handler
  _handleFocusTrap(event) {
    if (!this.focusableItems) {
      return;
    }
    const { keyCode, shiftKey } = event;
    const {
      length,
      0: firstItem,
      [length - 1]: lastItem,
    } = this.focusableItems;

    // key code for `TAB` is 9
    if (keyCode === 9) {
      // If only one item then prevent tabbing
      if (length === 1) {
        event.preventDefault();
        return;
      }

      // If focused on last item
      // then focus on first item when tab is pressed
      if (!shiftKey && this.shadowRoot.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
        return;
      }

      // If focused on first item
      // then focus on last item when shift + tab is pressed
      if (shiftKey && this.shadowRoot.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      }
    }
  }

  _render() {
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // overlay-------
    const overlay = document.createElement('div');
    const overlayClass = this.visible ? 'overlay visible' : 'overlay';
    overlay.setAttribute('class', overlayClass);

    overlay.innerHTML = `
        <div class='content-wrapper' role='dialog' aria-modal='true'>
          <div class='modal-head'>
            <h2 class='title'>${this.title}</h2>
            <button id='close-btn' class='close-btn'  aria-labelledby='close-btn-label'>
                <span id='close-btn-label' hidden>Close modal</span>
                <img src="./close-icon.svg" alt=''/>
            </button>
          </div>
          <div class='content'>
            <slot></slot>
          </div>
        </div>`;

    // Apply external styles to the shadow DOM
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'modal.css');

    // Attach the created link element to the shadow DOM
    shadowRoot.appendChild(linkElem);
    shadowRoot.appendChild(overlay);
  }
}
window.customElements.define('pf-modal', PFModal);