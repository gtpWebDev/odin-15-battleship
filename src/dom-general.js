const showDomElement = (domElement) => {
  document.querySelector(domElement).classList.add('display-grid');
  document.querySelector(domElement).classList.remove('display-none');
};

const hideDomElement = (domElement) => {
  document.querySelector(domElement).classList.add('display-none');
  document.querySelector(domElement).classList.remove('display-grid');
};

export { showDomElement, hideDomElement };
