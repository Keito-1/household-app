import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  IconButton, 
  Button, 
  Box 
} from '@mui/material';
import { Add, Settings } from '@mui/icons-material';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import { Transaction, Currency } from '../../types';

interface TransactionModalProps {
  open: boolean;
  selectedDate: Date | null;
  modalMode: 'view' | 'add' | 'edit';
  transactions: Transaction[];
  currencies: Currency[];
  
  // フォーム関連の props
  transactionType: 'income' | 'expense';
  amount: string;
  currency: string;
  category: string;
  description: string;
  expenseCategories: string[];
  incomeCategories: string[];
  customExpenseCategories: string[];
  customIncomeCategories: string[];
  defaultExpenseCategories: string[];
  defaultIncomeCategories: string[];
  newCategoryName: string;
  showCategoryManager: boolean;
  
  // イベントハンドラー
  onClose: () => void;
  onAddNew: () => void;
  onBackToList: () => void;
  onSave: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
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

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  selectedDate,
  modalMode,
  transactions,
  currencies,
  transactionType,
  amount,
  currency,
  category,
  description,
  expenseCategories,
  incomeCategories,
  customExpenseCategories,
  customIncomeCategories,
  defaultExpenseCategories,
  defaultIncomeCategories,
  newCategoryName,
  showCategoryManager,
  onClose,
  onAddNew,
  onBackToList,
  onSave,
  onEditTransaction,
  onDeleteTransaction,
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
  const getModalTitle = () => {
    switch (modalMode) {
      case 'view':
        return `取引一覧 - ${selectedDate?.toLocaleDateString('ja-JP')}`;
      case 'add':
        return `収支登録 - ${selectedDate?.toLocaleDateString('ja-JP')}`;
      case 'edit':
        return `取引編集 - ${selectedDate?.toLocaleDateString('ja-JP')}`;
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {getModalTitle()}
        </Typography>
        {(modalMode === 'add' || modalMode === 'edit') && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              カテゴリー追加
            </Typography>
            <IconButton 
              onClick={onToggleCategoryManager}
              color="primary"
              title="カテゴリ管理"
            >
              <Settings />
            </IconButton>
          </Box>
        )}
      </DialogTitle>
      <DialogContent>
        {modalMode === 'view' ? (
          <Box sx={{ mt: 1 }}>
            <TransactionList
              transactions={transactions}
              currencies={currencies}
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
            />
          </Box>
        ) : (
          <TransactionForm
            transactionType={transactionType}
            amount={amount}
            currency={currency}
            category={category}
            description={description}
            currencies={currencies}
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
            customExpenseCategories={customExpenseCategories}
            customIncomeCategories={customIncomeCategories}
            defaultExpenseCategories={defaultExpenseCategories}
            defaultIncomeCategories={defaultIncomeCategories}
            newCategoryName={newCategoryName}
            showCategoryManager={showCategoryManager}
            onTransactionTypeChange={onTransactionTypeChange}
            onAmountChange={onAmountChange}
            onCurrencyChange={onCurrencyChange}
            onCategoryChange={onCategoryChange}
            onDescriptionChange={onDescriptionChange}
            onNewCategoryNameChange={onNewCategoryNameChange}
            onAddCategory={onAddCategory}
            onDeleteCategory={onDeleteCategory}
            onToggleCategoryManager={onToggleCategoryManager}
          />
        )}
      </DialogContent>
      <DialogActions>
        {modalMode === 'view' ? (
          <>
            <Button onClick={onClose}>閉じる</Button>
            <Button 
              onClick={onAddNew}
              variant="contained"
              startIcon={<Add />}
            >
              新規追加
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onBackToList}>戻る</Button>
            <Button onClick={onClose}>キャンセル</Button>
            <Button 
              onClick={onSave}
              variant="contained"
              disabled={!amount || !category}
            >
              {modalMode === 'edit' ? '更新' : '保存'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TransactionModal;
