import React from 'react';

// Mock the components from antd
const antdMock = {
  Button: ({ children, icon, onClick }) => (
    <button onClick={onClick} data-testid="button">
      {icon && <span>{icon}</span>}
      {children}
    </button>
  ),
  Input: {
    Search: ({ placeholder, allowClear, enterButton, size, onSearch, style }) => (
      <div data-testid="input-search" style={style}>
        <input 
          placeholder={placeholder} 
          data-allow-clear={allowClear} 
          data-size={size}
        />
        <button onClick={() => onSearch && onSearch(document.querySelector('input').value)}>
          {enterButton}
        </button>
      </div>
    ),
  },
  Modal: ({ title, open, onCancel, footer, width, children }) => (
    open ? (
      <div data-testid="modal" data-width={width}>
        <div data-testid="modal-header">
          <span>{title}</span>
          <button onClick={onCancel} aria-label="close">Close</button>
        </div>
        <div data-testid="modal-content">
          {children}
        </div>
        {footer && <div data-testid="modal-footer">{footer}</div>}
      </div>
    ) : null
  ),
  Spin: ({ size }) => (
    <div data-testid="spin" data-size={size} role="img" aria-label="loading"></div>
  ),
  Empty: ({ description }) => (
    <div data-testid="empty">{description}</div>
  ),
  Typography: {
    Text: ({ type, style, children }) => (
      <span data-testid="typography-text" data-type={type} style={style}>{children}</span>
    ),
  },
  Row: ({ gutter, children }) => (
    <div data-testid="row" data-gutter={JSON.stringify(gutter)}>{children}</div>
  ),
  Col: ({ xs, sm, md, children }) => (
    <div data-testid="col" data-xs={xs} data-sm={sm} data-md={md}>{children}</div>
  ),
};

module.exports = antdMock;