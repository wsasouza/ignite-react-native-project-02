import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

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
  const [data, setData] = useState<DataListProps[]>([]);

  async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps ) => {
        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });        
        
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date
        }
      });

    setData(transactionsFormatted);
  }

  useEffect(() => {
    loadTransactions();    
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));


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

