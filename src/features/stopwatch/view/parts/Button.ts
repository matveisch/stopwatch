import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  font-size: 16px;
  cursor: pointer;
  margin: ${props => props.theme.spacing.small};
  
  &:hover {
    opacity: 0.8;
  }
`;