import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { HighlightCard } from '../../Components/HighlightCard';
import { EmptyData } from '../../Components/EmptyData';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../Components/TransactionCard';

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

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );  
  
  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const collectionFilttered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFilttered.length === 0) return 0;

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFilttered.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    return `${`${lastTransaction.getDate()}`.padStart(2, '0')} de ${lastTransaction.toLocaleString(
      'pt-BR',
      { month: 'long' }
    )}`;
  }

  function getLastTransactionInterval(collection: DataListProps[]){

    const lastTransactionInterval = new Date(Math.max.apply(Math, collection
      .map(transaction => new Date(transaction.date)
      .getTime()))); 
    
    const validDate = !isNaN(lastTransactionInterval.getDate());
    
    if(!validDate)
      return 'N??o h?? transa????es'    

    return `01 a ${`${lastTransactionInterval.getDate()}`.padStart(2, '0')} de ${lastTransactionInterval.toLocaleString(
      'pt-BR',
      { month: 'long' }
    )}`;
    
  }

  async function loadTransactions() { 
    const dataKey = `@gofinances:transactions_user:${user.id}`;   
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensesTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      'positive'
    );

    const lastTransactionExpenses = getLastTransactionDate(
      transactions,
      'negative'
    );

    const lastTransactionInterval = getLastTransactionInterval(transactions);
        
    const total = entriesTotal - expensesTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastTransactionEntries === 0
            ? 'N??o h?? transa????es de entrada'
            : `??ltima entrada dia ${lastTransactionEntries}`,
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastTransactionExpenses === 0
            ? 'N??o h?? transa????es de sa??da'
            : `??ltima sa??da dia ${lastTransactionExpenses}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `${lastTransactionInterval}`,
      },
    });

    setIsLoading(false);
  }  

  function handleRemoveTransaction(id: string) {    

    Alert.alert('Remover lan??amento', 'Tem certeza que voc?? deseja remover esse lan??amento?', [
      {
        style: 'cancel',
        text: 'N??o'
      },
      {
        style: 'destructive',
        text: 'Sim',
        onPress: async () => {
          try {
            const dataKey = `@gofinances:transactions_user:${user.id}`;
            const response = await AsyncStorage.getItem(dataKey);
            const transactions = response ? JSON.parse(response) : [];
            const alteredTransactions = transactions.filter(
              (transaction: { id: string; }) => transaction.id !== id
            )
            AsyncStorage.setItem(dataKey, JSON.stringify(alteredTransactions));
            loadTransactions();
          } catch (error) {
            console.log(error);
            Alert.alert('N??o foi poss??vel deletar essa transa????o');
          }          
        }
      }
    ])
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Avatar source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Ol??,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="log-out" />
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
              title="Sa??das"
              amount={highlightData.expenses.amount}
              lastTransaction={highlightData.expenses.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Saldo"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>

          {transactions.length === 0 ? (
            <EmptyData 
              icon="smile"
              text={`Comece j?? a cadastrar\n as suas \n despesas e receitas...`}
            />
            ) : (

            <Transactions>
              <Title>Lan??amentos</Title>

              <TransactionList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => 
                  <TransactionCard 
                    data={item} 
                    removeTransaction={handleRemoveTransaction} 
                  />}
              />
            </Transactions>
            )
          }
        </>
      )}
    </Container>
  );
}
