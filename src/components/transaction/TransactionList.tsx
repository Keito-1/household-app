import React from 'react';
import { Box, Typography, Paper, Chip, IconButton } from '@mui/material';
import { Settings, Delete } from '@mui/icons-material';
import { Transaction, Currency } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  currencies: Currency[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currencies,
  onEdit,
  onDelete
}) => {
  // 通貨記号を取得
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '¥';
  };

  if (transactions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          この日には取引がありません
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {transactions.map((transaction) => (
        <Paper 
          key={transaction.id} 
          elevation={1} 
          sx={{ p: 2, mb: 2, border: 1, borderColor: 'grey.200' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip 
                  label={transaction.type === 'income' ? '収入' : '支出'}
                  color={transaction.type === 'income' ? 'success' : 'error'}
                  size="small"
                />
                <Typography variant="h6" component="span">
                  {transaction.type === 'income' ? '+' : '-'}
                  {getCurrencySymbol(transaction.currency)}{transaction.amount.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                カテゴリ: {transaction.category}
              </Typography>
              {transaction.description && (
                <Typography variant="body2" color="text.secondary">
                  {transaction.description}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => onEdit(transaction)}
                color="primary"
              >
                <Settings />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onDelete(transaction.id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default TransactionList;
