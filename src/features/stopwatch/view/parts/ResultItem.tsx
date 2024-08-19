import React from 'react';
import { Button } from './Button.ts';
import { formatTime } from '../../../../lib/time.ts';
import styled from 'styled-components';

const ResultItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.small};
  border-bottom: 1px solid ${(props) => props.theme.colors.secondary};
`;

export const ResultItemComponent: React.FC<{
  result: number;
  index: number;
  onDelete: (index: number) => void;
}> = ({ result, index, onDelete }) => (
  <ResultItem>
    <span>{formatTime(result)}</span>
    <Button onClick={() => onDelete(index)}>Delete</Button>
  </ResultItem>
);
