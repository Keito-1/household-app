// 取引データの型定義
export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: string;
  description: string;
}

// 通貨データの型定義
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// 通貨別取引額の型定義
export interface TransactionAmountsByCurrency {
  [currency: string]: {
    income: number;
    expense: number;
  };
}
