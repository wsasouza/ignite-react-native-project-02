import React from 'react';

import { 
  EmptyListContainer, 
  Icon,
  EmptyListText
} from './styles';

export function EmptyData(){
  return (
    <EmptyListContainer>
          <Icon name="edit" />
          <EmptyListText>
            Comece já a cadastrar {'\n'}
            as suas {'\n'}
            despesas e receitas... 
          </EmptyListText>
    </EmptyListContainer>
  );
}