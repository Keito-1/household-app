import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import PieChart from '../components/chart/PieChart';
import { Transaction, Currency } from '../types';
import { useTransactions } from '../contexts/TransactionContext';

const currencies: Currency[] = [
  { code: 'JPY', symbol: '¥', name: '日本円' },
  { code: 'USD', symbol: '$', name: 'アメリカドル' },
  { code: 'AUD', symbol: 'A$', name: 'オーストラリアドル' },
  { code: 'CAD', symbol: 'C$', name: 'カナダドル' }
];

const Report = () => {
  const { transactions, selectedCurrency, setSelectedCurrency } = useTransactions();
  
  // 現在の年月をデフォルト値として設定
  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${now.getMonth()}`;
  
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('expense');

  // 期間選択肢を生成
  const generatePeriodOptions = () => {
    const options = [];
    const now = new Date();
    
    // 過去6ヶ月から未来6ヶ月まで
    for (let i = -6; i <= 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
      
      let label;
      if (i === 0) {
        label = `今月 (${monthName})`;
      } else if (i === -1) {
        label = `先月 (${monthName})`;
      } else if (i === 1) {
        label = `来月 (${monthName})`;
      } else if (i > 0) {
        label = `${i}ヶ月後 (${monthName})`;
      } else {
        label = `${Math.abs(i)}ヶ月前 (${monthName})`;
      }
      
      options.push({
        value: `${year}-${month}`,
        label: label,
        year: year,
        month: month
      });
    }
    
    return options;
  };

  const periodOptions = generatePeriodOptions();

  // 通貨記号を取得
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '¥';
  };

  // 通貨別の取引件数を計算
  const getCurrencyTransactionCount = (currencyCode: string) => {
    // 現在選択されている期間でフィルタ
    const [yearStr, monthStr] = selectedPeriod.split('-');
    const targetYear = parseInt(yearStr);
    const targetMonth = parseInt(monthStr);
    
    return transactions.filter((t: Transaction) => {
      const transactionDate = new Date(t.date);
      return t.currency === currencyCode &&
             transactionDate.getFullYear() === targetYear && 
             transactionDate.getMonth() === targetMonth;
    }).length;
  };

  // フィルタリングされた取引データ
  const filteredTransactions = useMemo(() => {
    let filtered: Transaction[] = transactions;

    // 通貨でフィルタ（必須）
    filtered = filtered.filter((t: Transaction) => t.currency === selectedCurrency);

    // タイプでフィルタ
    if (selectedType !== 'all') {
      filtered = filtered.filter((t: Transaction) => t.type === selectedType);
    }

    // 期間でフィルタ (YYYY-M形式)
    const [yearStr, monthStr] = selectedPeriod.split('-');
    const targetYear = parseInt(yearStr);
    const targetMonth = parseInt(monthStr);
    
    filtered = filtered.filter((t: Transaction) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === targetYear && 
             transactionDate.getMonth() === targetMonth;
    });

    return filtered;
  }, [transactions, selectedPeriod, selectedCurrency, selectedType]);

  // カテゴリ別データを集計
  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    filteredTransactions.forEach((transaction: Transaction) => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    });

    // カテゴリごとに色を設定
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
      '#4BC0C0', '#FF9F40'
    ];

    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      label: category,
      value: amount,
      color: colors[index % colors.length]
    }));
  }, [filteredTransactions]);

  // 統計情報を計算
  const totalAmount = filteredTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  const transactionCount = filteredTransactions.length;

  return (
    <Box sx={{ p: 3 }}>

      {/* フィルタリングオプション */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          フィルター
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>期間</InputLabel>
            <Select
              value={selectedPeriod}
              label="期間"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periodOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>通貨</InputLabel>
            <Select
              value={selectedCurrency}
              label="通貨"
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {currencies.map((currency) => {
                const count = getCurrencyTransactionCount(currency.code);
                return (
                  <MenuItem key={currency.code} value={currency.code}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{currency.symbol} {currency.name}</span>
                      <span style={{ color: '#9e9e9e', marginLeft: '8px' }}>{count}</span>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>タイプ</InputLabel>
            <Select
              value={selectedType}
              label="タイプ"
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'income' | 'expense')}
            >
              <MenuItem value="all">全て</MenuItem>
              <MenuItem value="income">収入</MenuItem>
              <MenuItem value="expense">支出</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* 統計情報 */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              合計金額
            </Typography>
            <Typography variant="h4">
              {totalAmount.toLocaleString()}{getCurrencySymbol(selectedCurrency)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              取引件数
            </Typography>
            <Typography variant="h4">
              {transactionCount}件
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 円グラフ */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Box sx={{ flex: 1, minWidth: 400, maxWidth: 500 }}>
          <PieChart
            title={`カテゴリ別${selectedType === 'income' ? '収入' : selectedType === 'expense' ? '支出' : '取引'}分析 (${getCurrencySymbol(selectedCurrency)})`}
            data={categoryData}
            width={350}
            height={350}
            currencySymbol={getCurrencySymbol(selectedCurrency)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Report;