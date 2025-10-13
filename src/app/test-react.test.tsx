import { render } from '@testing-library/react';

describe('Basic React Testing Libarary Test', () => {
  it('should render a simple component', () => {
    const { getByText } = render(<div>Hello, World!</div>);
    expect(getByText('Hello, World!')).toBeInTheDocument();
  });
});
