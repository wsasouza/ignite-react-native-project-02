import React, { useState } from 'react';
import { 
  Alert,
  Keyboard, 
  Modal, 
  TouchableWithoutFeedback 
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { 
  useNavigation, 
  NavigationProp, 
  ParamListBase, 
} from '@react-navigation/native';

import { Button } from '../../Components/Form/Button';
import { CategorySelectButton } from '../../Components/Form/CategorySelectButton';
import { InputForm } from '../../Components/Form/InputForm';
import { TransactionTypeButton } from '../../Components/Form/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
} from './styles';
interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Informe o nome da transação'),
  amount: Yup.number()
    .typeError('Informe um número válido')
    .positive('O valor não pode ser negativo')
    .required('Informe o valor da transação')
});

export function Register() {  
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'    
  });

  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelected(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData){
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação');

    if(category.key === 'category')
      return Alert.alert('Selecione uma categoria');

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try { 
      const dataKey = '@gofinances:transactions';

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        newTransaction,
        ...currentData        
      ];
      
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });

      navigate('Listagem');

    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível cadastrar');
    }
  } 

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>      
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              errors={errors.name && errors.name.message}
            />

            <InputForm 
              name="amount"
              control={control}
              placeholder="Valor"
              keyboardType="numeric"
              errors={errors.amount && errors.amount.message}
            />         

            <TransactionTypes>
              <TransactionTypeButton 
                type="up"
                title="income"
                onPress={() => handleTransactionTypeSelected('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton 
                type="down"
                title="outcome"
                onPress={() => handleTransactionTypeSelected('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionTypes>

            <CategorySelectButton 
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />      
          
          </Fields>

          <Button 
            title="Enviar" 
            onPress={handleSubmit(handleRegister)}
          />

        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}      
          />
        </Modal>

      </Container>
    </TouchableWithoutFeedback>
  );
}