import React from 'react';

import { 
  EmptyListContainer, 
  Icon,
  EmptyListText
} from './styles';

interface Props {
  icon: string 
  text: string;
}

export function EmptyData({ icon, text }: Props){
  return (
    <EmptyListContainer>
          <Icon name={icon} />
          <EmptyListText>
            {text} 
          </EmptyListText>
    </EmptyListContainer>
  );
}