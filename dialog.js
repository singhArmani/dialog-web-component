class PFModal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const shadowRoot = this.attachShadow({ mode: 'open' }); // returns and set `this.shadowRoot`

    // overlay-------
    const overlay = document.createElement('div');

    const overlayClass = 'overlay visible';
    overlay.setAttribute('class', overlayClass);

    overlay.innerHTML = `
        <style>
          .overlay {
            position: fixed;
            background-color: rgba(0, 0, 0, 0.33);
            inset: 0;
            width: 100%;
            z-index: 1;
            opacity: 0;
            visibility: hidden;
            transform: scale(1.1);
            transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
          }

          .visible {
            opacity: 1;
            visibility: visible;
            transform: scale(1);
            transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
          }

          .content-wrapper {
            background-color: var(--bg-color, #fff);
            border-radius: 1rem;
            position: relative;
            width: min(90%, 50ch);
            padding: 1.5rem;
            margin: 10vh auto;
          }

          /* modal head wrapper */
          .modal-head {
            display: flex;
            padding-block-end: 12px;
            align-items: center;
            border-bottom: 1px solid gray;
            justify-content: space-between;
          }

          /* modal title */
          h2 {
            line-height: 32px;
            font-size: 28px;
            color: inherit;
            font-weight: 400;
            margin: 0;
          }

          /* close button */
          .close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            cursor: pointer;
            outline: revert;
            border: none;
            appearance: none;
            background: transparent;
            height: 2rem;
            width: 2rem;
            transition: background-color 200ms;
            outline: transparent solid 2px;
            outline-offset: 2px;
          }

          .close-btn:hover {
            background-color: rgba(0, 0, 0, 0.06);
          }

          .close-btn:focus,
          .close-btn:active {
            outline-color: currentColor;
          }
        </style>
        <div class='content-wrapper' role='dialog' aria-modal='true'>
          <div class='modal-head'>
            <h2 class='title'>Modal title goes here</h2>
            <button id='close-btn' class='close-btn'  aria-labelledby='close-btn-label'>
                <span id='close-btn-label' hidden>Close modal</span>
                <img src="./close-icon.svg" alt=''/>
            </button>
          </div>
          <div class='content'>
            <p>Modal content goes here.</p>
          </div>
        </div>`;

    // Attach the created link element to the shadow DOM
    shadowRoot.appendChild(overlay);
  }
}
window.customElements.define('pf-modal', PFModal);
