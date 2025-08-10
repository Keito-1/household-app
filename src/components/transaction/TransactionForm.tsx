import React from 'react';
import { 
  Stack, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  TextField, 
  Typography,
  Button,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import { Add, Delete, Settings } from '@mui/icons-material';
import { Currency } from '../../types';

interface TransactionFormProps {
  transactionType: 'income' | 'expense';
  amount: string;
  currency: string;
  category: string;
  description: string;
  currencies: Currency[];
  expenseCategories: string[];
  incomeCategories: string[];
  customExpenseCategories: string[];
  customIncomeCategories: string[];
  defaultExpenseCategories: string[];
  defaultIncomeCategories: string[];
  newCategoryName: string;
  showCategoryManager: boolean;
  onTransactionTypeChange: (type: 'income' | 'expense') => void;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  onCategoryChange: (category: string) => void;
  onDescriptionChange: (description: string) => void;
  onNewCategoryNameChange: (name: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (category: string) => void;
  onToggleCategoryManager: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transactionType,
  amount,
  currency,
  category,
  description,
  currencies,
  expenseCategories,
  incomeCategories,
  customExpenseCategories,
  customIncomeCategories,
  defaultExpenseCategories,
  defaultIncomeCategories,
  newCategoryName,
  showCategoryManager,
  onTransactionTypeChange,
  onAmountChange,
  onCurrencyChange,
  onCategoryChange,
  onDescriptionChange,
  onNewCategoryNameChange,
  onAddCategory,
  onDeleteCategory,
  onToggleCategoryManager
}) => {
  // 通貨記号を取得
  const getCurrencySymbol = (currencyCode: string) => {
    const curr = currencies.find(c => c.code === currencyCode);
    return curr ? curr.symbol : '¥';
  };

  // デフォルトカテゴリかどうかを判定
  const isDefaultCategory = (categoryName: string) => {
    const defaultCategories = transactionType === 'expense' ? defaultExpenseCategories : defaultIncomeCategories;
    return defaultCategories.includes(categoryName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAddCategory();
    }
  };

  return (
    <Stack spacing={3} sx={{ mt: 1 }}>
      {/* 収入/支出の選択 */}
      <FormControl>
        <InputLabel>タイプ</InputLabel>
        <Select
          value={transactionType}
          label="タイプ"
          onChange={(e) => onTransactionTypeChange(e.target.value as 'income' | 'expense')}
        >
          <MenuItem value="expense">支出</MenuItem>
          <MenuItem value="income">収入</MenuItem>
        </Select>
      </FormControl>

      {/* 金額 */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>通貨</InputLabel>
          <Select
            value={currency}
            label="通貨"
            onChange={(e) => onCurrencyChange(e.target.value)}
          >
            {currencies.map((curr) => (
              <MenuItem key={curr.code} value={curr.code}>
                {curr.symbol} {curr.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="金額"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          InputProps={{
            startAdornment: <Typography sx={{ mr: 1 }}>{getCurrencySymbol(currency)}</Typography>
          }}
          sx={{
            flexGrow: 1,
            '& input[type=number]': {
              '-moz-appearance': 'textfield'
            },
            '& input[type=number]::-webkit-outer-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0
            }
          }}
        />
      </Box>

      {/* カテゴリ */}
      <FormControl fullWidth>
        <InputLabel>カテゴリ</InputLabel>
        <Select
          value={category}
          label="カテゴリ"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {(transactionType === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* カテゴリ管理セクション */}
      {showCategoryManager && (
        <Box sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {transactionType === 'expense' ? '支出' : '収入'}カテゴリ管理
          </Typography>
          
          {/* 新しいカテゴリ追加 */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              placeholder="新しいカテゴリ名"
              value={newCategoryName}
              onChange={(e) => onNewCategoryNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={onAddCategory}
              disabled={!newCategoryName.trim()}
              startIcon={<Add />}
            >
              追加
            </Button>
          </Box>

          {/* カスタムカテゴリ一覧 */}
          {(transactionType === 'expense' ? customExpenseCategories : customIncomeCategories).length > 0 && (
            <>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                カスタムカテゴリ（削除可能）
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(transactionType === 'expense' ? customExpenseCategories : customIncomeCategories).map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    onDelete={() => onDeleteCategory(cat)}
                    deleteIcon={<Delete />}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      )}

      {/* 説明 */}
      <TextField
        label="説明（オプション）"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />
    </Stack>
  );
};

export default TransactionForm;
