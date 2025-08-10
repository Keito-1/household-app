import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import BarChart from '../components/chart/BarChart';
import { useTransactions } from '../contexts/TransactionContext';
import { Transaction, Currency } from '../types';

const currencies: Currency[] = [
  { code: 'JPY', symbol: '¥', name: '日本円' },
  { code: 'USD', symbol: '$', name: 'アメリカドル' },
  { code: 'AUD', symbol: 'A$', name: 'オーストラリアドル' },
  { code: 'CAD', symbol: 'C$', name: 'カナダドル' }
];

const Analytics = () => {
  const { transactions, selectedCurrency, setSelectedCurrency } = useTransactions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // 通貨記号を取得
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '¥';
  };

  // 年別月次データを集計
  const monthlyData = useMemo(() => {
    const months = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ];

    return months.map((month, index) => {
      const monthTransactions = transactions.filter((t: Transaction) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === selectedYear &&
               transactionDate.getMonth() === index &&
               t.currency === selectedCurrency;
      });

      const income = monthTransactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      return {
        month,
        income,
        expense
      };
    });
  }, [transactions, selectedYear, selectedCurrency]);

  // 年の選択肢を生成（現在年から前後5年）
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    
    // 現在年から前後5年分を生成
    for (let i = -5; i <= 5; i++) {
      years.push(currentYear + i);
    }
    
    return years.sort((a, b) => b - a); // 降順でソート
  }, []);

  // 統計情報を計算
  const yearlyIncome = monthlyData.reduce((sum, data) => sum + data.income, 0);
  const yearlyExpense = monthlyData.reduce((sum, data) => sum + data.expense, 0);
  const netIncome = yearlyIncome - yearlyExpense;
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        アナリティクス
      </Typography>

      {/* フィルタリングオプション */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          フィルター
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap' 
        }}>
          <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>年</InputLabel>
            <Select
              value={selectedYear}
              label="年"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}年
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>通貨</InputLabel>
            <Select
              value={selectedCurrency}
              label="通貨"
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* 年間統計情報 */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 2, sm: 3 }, 
        mb: 3, 
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap' 
      }}>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              年間収入
            </Typography>
            <Typography 
              color="success.main"
              sx={{ 
                wordBreak: 'break-all',
                fontSize: { xs: '1.5rem', sm: '2.125rem' },
                fontWeight: 400,
                lineHeight: 1.235
              }}
            >
              {yearlyIncome.toLocaleString()}{getCurrencySymbol(selectedCurrency)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              年間支出
            </Typography>
            <Typography 
              color="error.main"
              sx={{ 
                wordBreak: 'break-all',
                fontSize: { xs: '1.5rem', sm: '2.125rem' },
                fontWeight: 400,
                lineHeight: 1.235
              }}
            >
              {yearlyExpense.toLocaleString()}{getCurrencySymbol(selectedCurrency)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              純収入
            </Typography>
            <Typography 
              color={netIncome >= 0 ? "success.main" : "error.main"}
              sx={{ 
                wordBreak: 'break-all',
                fontSize: { xs: '1.5rem', sm: '2.125rem' },
                fontWeight: 400,
                lineHeight: 1.235
              }}
            >
              {netIncome.toLocaleString()}{getCurrencySymbol(selectedCurrency)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 月別収支グラフ */}
      <BarChart
        title={`${selectedYear}年 月別収支 (${getCurrencySymbol(selectedCurrency)})`}
        data={monthlyData}
        currencySymbol={getCurrencySymbol(selectedCurrency)}
      />
    </Box>
  );
};

export default Analytics;
