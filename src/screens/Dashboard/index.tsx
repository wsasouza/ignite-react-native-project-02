import React from 'react';

import { HighlightCard } from '../../Components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../Components/TransactionCard';

import { 
  Container, 
  Header,
  UserWrapper,
  UserInfo,
  LogoutButton,
  Avatar,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard(){
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: 'Desenvolvimento de site',
      amount: 'R$ 12.000,00',
      category: {
        name: 'Vendas',
        icon: 'dollar-sign'
      },
      date: "10/11/2021"
    },
    {
      id: '2',
      type: 'negative',
      title: 'Compra do monitor',
      amount: 'R$ 1550,00',
      category: {
        name: 'Compras',
        icon: 'shopping-bag'
      },
      date: "10/11/2021"
    },
    {
      id: '3',
      type: 'positive',
      title: 'Seguro',
      amount: 'R$ 1.911,00',
      category: {
        name: 'Salário',
        icon: 'dollar-sign'
      },
      date: "10/11/2021"
    },

  ];


  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Avatar source={{ uri: 'https://github.com/wsasouza.png' }} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Walter</UserName>
            </User>            
          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>        
      </Header>

      <HighlightCards>
        <HighlightCard 
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 09 de novembro"
        />
        <HighlightCard 
          type="down"
          title="Saídas"
          amount="R$ 5.400,00"
          lastTransaction="Última saída dia 10 de novembro"
        />
        <HighlightCard 
          type="total"
          title="Total"
          amount="R$ 12.000,00"
          lastTransaction="01 à 10 de novembro"
        />
      </HighlightCards >

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList 
          data={data}
          keyExtractor={ item  => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />        
      </Transactions>
    </Container>
  );
}

