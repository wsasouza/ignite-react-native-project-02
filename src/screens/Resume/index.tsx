import React, { useCallback, useState, useEffect }  from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { HistoryCard } from '../../Components/HistoryCard';
import { categories } from '../../utils/categories';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';
import { 
  Container,
  LoadContainer,
  Header,
  Title,
  Content,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  function handleDateChange(action: 'next' | 'prev'){   
    if(action === 'next') {      
      setSelectedDate(addMonths(selectedDate, 1));

    } else {      
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData(){
    setIsLoading(true);
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted
      .filter((expense: TransactionData) => 
        expense.type === 'negative' &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear()
      );

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
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));


  return(
    <Container>     
          
      <Header>
        <Title>Resumo das Despesas</Title>
      </Header>
      { isLoading ? 
            <LoadContainer>            
              <ActivityIndicator color={theme.colors.secondary} size="large"/>
            </LoadContainer> :

            <Content
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: useBottomTabBarHeight()
              }}
            >

              <MonthSelect>
                <MonthSelectButton onPress={() => handleDateChange('prev')}>
                  <MonthSelectIcon name="chevron-left"/>
                </MonthSelectButton>

                <Month>
                  { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
                </Month>

                <MonthSelectButton onPress={() => handleDateChange('next')}>
                  <MonthSelectIcon name="chevron-right"/>
                </MonthSelectButton>
              </MonthSelect>

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
          
      }
    </Container>
  );
}



