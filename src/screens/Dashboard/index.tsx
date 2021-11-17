import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
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
  TransactionList,
  LoadContainer
} from './styles';
import { useTheme } from 'styled-components';


export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard(){
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ){
    const lastTransactionDate = Math.max.apply(Math, collection
      .filter(transaction => transaction.type === type)
      .map(transaction => new Date(transaction.date)
      .getTime()));    
    
    const lastTransactionDateFormatted = Intl
      .DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long'        
        }).format(new Date(lastTransactionDate));    

    return lastTransactionDateFormatted;
  }

  function getLastTransactionInterval(collection: DataListProps[]){
    
    const lastTransactionInterval = Math.max.apply(Math, collection      
      .map(transaction => new Date(transaction.date)
      .getTime()));

    const lastTransactionIntervalFormatted = Intl
      .DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long'        
      }).format(new Date(lastTransactionInterval));
    
    return lastTransactionIntervalFormatted;
  }

  async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps ) => {
        
        if(item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensesTotal += Number(item.amount);
        }       

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

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(
      transactions, 'positive'
    );

    const lastTransactionExpenses = getLastTransactionDate(
      transactions, 'negative'
    );  
    
    const lastTransactionInterval = getLastTransactionInterval(transactions);

    const total = entriesTotal - expensesTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`
      },
      expenses: {
        amount: expensesTotal
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpenses}`
      },
      total: {
        amount: total
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'        
        }),
        lastTransaction: `01 à ${lastTransactionInterval}`
      }
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();    
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));


  return (    
    <Container>      
      { isLoading ? 
          <LoadContainer>            
            <ActivityIndicator color={theme.colors.secondary} size="large"/>
          </LoadContainer> :
        <>
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
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard 
              type="down"
              title="Saídas"
              amount={highlightData.expenses.amount}
              lastTransaction={highlightData.expenses.lastTransaction}
            />
            <HighlightCard 
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards >

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList 
              data={transactions}
              keyExtractor={ item  => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />        
          </Transactions>
        </>
      }
    </Container>
  );
}

