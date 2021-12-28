import React from 'react';
import { categories } from '../../utils/categories';

import { 
  Container,
  Header,
  DataCard,
  Title,
  Amount,
  RemoveTransaction,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date  
} from './styles';

export interface TransactionCardProps {  
  id: string;
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}
interface Props {
  data: TransactionCardProps; 
  removeTransaction: (id: string) => void; 
}


export function TransactionCard({ data, removeTransaction } : Props){
  const [ category ] = categories.filter(
    item => item.key === data.category
  );  

  return (
    <Container>
      <Header>
        <DataCard>
          <Title>{data.name}</Title>

          <Amount type={data.type}>
            {data.type === 'negative' && '- '}
            {data.amount}
          </Amount>
        </DataCard>

        <RemoveTransaction onPress={() => removeTransaction(data.id)}>
          <Icon name="trash" />
        </RemoveTransaction>
      </Header>      

      <Footer>
        <Category>
          <Icon name={category.icon}/>
          <CategoryName>{category.name}</CategoryName>          
        </Category>

          <Date>{data.date}</Date>
      </Footer>

    </Container>
  )
}