export default function getPath(element) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('Переданный объект не является HTMLElement');
  }

  const path = [];
  let currentElement = element;

  while (currentElement !== document.body && currentElement.parentNode) {
    let selector = currentElement.tagName.toLowerCase();
    
    // Используем ID если есть
    if (currentElement.id) {
      selector += `#${currentElement.id}`;
      path.unshift(selector);
      break;
    }
    
    // Добавляем классы
    const classes = Array.from(currentElement.classList);
    if (classes.length > 0) {
      selector += classes.map(className => `.${className}`).join('');
    }
    
    // Добавляем позицию среди siblings
    const siblings = Array.from(currentElement.parentNode.children);
    const sameTagSiblings = siblings.filter(sibling => 
      sibling.tagName === currentElement.tagName
    );
    
    if (sameTagSiblings.length > 1) {
      const index = siblings.indexOf(currentElement) + 1;
      selector += `:nth-child(${index})`;
    }
    
    path.unshift(selector);
    currentElement = currentElement.parentNode;
  }

  if (currentElement === document.body) {
    path.unshift('body');
  }

  return path.join(' > ');
}