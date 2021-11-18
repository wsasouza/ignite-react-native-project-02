import React, { useCallback, useState, useEffect }  from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { HistoryCard } from '../../Components/HistoryCard';
import { categories } from '../../utils/categories';

import { useTheme } from 'styled-components';
import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer
} from './styles';
interface TransactionData {   
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}
interface CategoryData {
  key: string
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  async function loadData(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted
      .filter((expense: TransactionData) => expense.type === 'negative');

    const expensesTotal = expenses
      .reduce((acumullator: number, expense: TransactionData) => {
        return acumullator + Number(expense.amount);
    }, 0);
    
    const totalByCategory: CategoryData[] = [];
    
    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if(expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if(categorySum > 0){
        const totalFormatted = categorySum
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        
        const percent = `${(categorySum / expensesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          color: category.color,
          name: category.name,
          total: categorySum,
          totalFormatted,
          percent          
        });     
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));


  return(
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        <ChartContainer>
          <VictoryPie 
            data={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: { 
                fontFamily: theme.fonts.bold,
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape
               }
            }}
            labelRadius={50}
            x="percent"
            y="total"
            height={350}
          />
        </ChartContainer>

        {
          totalByCategories.map(item => (
            <HistoryCard
              key={item.key}
              color={item.color}
              title={item.name}
              amount={item.totalFormatted}            
            />
          ))
        }
      </Content>

    </Container>
  );
}



