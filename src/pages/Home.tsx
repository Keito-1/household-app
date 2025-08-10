import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper
} from '@mui/material';
import { Transaction, Currency, TransactionAmountsByCurrency } from '../types';
import CalendarHeader from '../components/common/CalendarHeader';
import YearSelector from '../components/common/YearSelector';
import MonthSelector from '../components/common/MonthSelector';
import TransactionModal from '../components/transaction/TransactionModal';
import { useTransactions } from '../contexts/TransactionContext';

// 通貨の選択肢
const currencies: Currency[] = [
  { code: 'JPY', symbol: '¥', name: '日本円' },
  { code: 'USD', symbol: '$', name: 'アメリカドル' },
  { code: 'AUD', symbol: 'A$', name: 'オーストラリアドル' },
  { code: 'CAD', symbol: 'C$', name: 'カナダドル' }
];

// カテゴリの選択肢
const defaultExpenseCategories = ['食費', '交通費', '光熱費', '医療費', '娯楽費', 'その他'];
const defaultIncomeCategories = ['給料', 'ボーナス', '副業', 'その他'];

const Home = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, getTransactionsForDate } = useTransactions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'add' | 'edit'>('view');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // フォーム用の状態
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('JPY');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  // カテゴリ管理用の状態
  const [customExpenseCategories, setCustomExpenseCategories] = useState<string[]>([]);
  const [customIncomeCategories, setCustomIncomeCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // 年月選択用の状態
  const [yearAnchorEl, setYearAnchorEl] = useState<HTMLElement | null>(null);
  const [monthAnchorEl, setMonthAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  // カテゴリの選択肢
  const expenseCategories = [...defaultExpenseCategories, ...customExpenseCategories];
  const incomeCategories = [...defaultIncomeCategories, ...customIncomeCategories];

  // ヘルパー関数
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 年選択の処理
  const handleYearClick = (event: React.MouseEvent<HTMLElement>) => {
    setYearAnchorEl(event.currentTarget);
    setSelectedYear(currentDate.getFullYear());
  };

  const handleYearClose = () => {
    setYearAnchorEl(null);
  };

  const handleYearChange = (event: Event, newValue: number | number[]) => {
    const year = Array.isArray(newValue) ? newValue[0] : newValue;
    setSelectedYear(year);
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };

  // 月選択の処理
  const handleMonthClick = (event: React.MouseEvent<HTMLElement>) => {
    setMonthAnchorEl(event.currentTarget);
    setSelectedMonth(currentDate.getMonth());
  };

  const handleMonthClose = () => {
    setMonthAnchorEl(null);
  };

  const handleMonthChange = (event: Event, newValue: number | number[]) => {
    const month = Array.isArray(newValue) ? newValue[0] : newValue;
    setSelectedMonth(month);
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
  };

  // 通貨記号を取得
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '¥';
  };

  // 日付クリック時の処理
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setModalMode('view');
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setModalMode('view');
    setEditingTransaction(null);
    setShowCategoryManager(false);
    setNewCategoryName('');
    // フォームをリセット
    setTransactionType('expense');
    setAmount('');
    setCurrency('JPY');
    setCategory('');
    setDescription('');
  };

  // 取引を保存
  const handleSaveTransaction = () => {
    if (!selectedDate || !amount || !category) return;
    
    if (modalMode === 'edit' && editingTransaction) {
      // 編集モード
      const updatedTransaction: Transaction = {
        ...editingTransaction,
        type: transactionType,
        amount: parseFloat(amount),
        currency,
        category,
        description
      };
      updateTransaction(editingTransaction.id, updatedTransaction);
    } else {
      // 新規追加モード
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        date: selectedDate.toISOString().split('T')[0],
        type: transactionType,
        amount: parseFloat(amount),
        currency,
        category,
        description
      };
      addTransaction(newTransaction);
    }
    
    // 保存後は一覧表示に戻る
    setModalMode('view');
    setEditingTransaction(null);
    // フォームをリセット
    setTransactionType('expense');
    setAmount('');
    setCurrency('JPY');
    setCategory('');
    setDescription('');
  };

  // 新規追加モードに切り替え
  const handleAddNew = () => {
    setModalMode('add');
    setEditingTransaction(null);
    // フォームをリセット
    setTransactionType('expense');
    setAmount('');
    setCurrency('JPY');
    setCategory('');
    setDescription('');
  };

  // 編集モードに切り替え
  const handleEditTransaction = (transaction: Transaction) => {
    setModalMode('edit');
    setEditingTransaction(transaction);
    // フォームに既存データを設定
    setTransactionType(transaction.type);
    setAmount(transaction.amount.toString());
    setCurrency(transaction.currency);
    setCategory(transaction.category);
    setDescription(transaction.description);
  };

  // 取引を削除
  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

  // 一覧表示に戻る
  const handleBackToList = () => {
    setModalMode('view');
    setEditingTransaction(null);
    setShowCategoryManager(false);
    // フォームをリセット
    setTransactionType('expense');
    setAmount('');
    setCurrency('JPY');
    setCategory('');
    setDescription('');
  };

  // カテゴリを追加
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    if (transactionType === 'expense') {
      if (!customExpenseCategories.includes(newCategoryName)) {
        setCustomExpenseCategories([...customExpenseCategories, newCategoryName]);
      }
    } else {
      if (!customIncomeCategories.includes(newCategoryName)) {
        setCustomIncomeCategories([...customIncomeCategories, newCategoryName]);
      }
    }
    setNewCategoryName('');
  };

  // カテゴリを削除
  const handleDeleteCategory = (categoryToDelete: string) => {
    if (transactionType === 'expense') {
      setCustomExpenseCategories(customExpenseCategories.filter(cat => cat !== categoryToDelete));
    } else {
      setCustomIncomeCategories(customIncomeCategories.filter(cat => cat !== categoryToDelete));
    }
    
    // 削除したカテゴリが選択されている場合はリセット
    if (category === categoryToDelete) {
      setCategory('');
    }
  };

  // デフォルトカテゴリかどうかを判定
  const isDefaultCategory = (categoryName: string) => {
    const defaultCategories = transactionType === 'expense' ? defaultExpenseCategories : defaultIncomeCategories;
    return defaultCategories.includes(categoryName);
  };

  // カレンダーの日付配列を生成
  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDay = getLastDayOfMonth(currentDate);
    const startDate = new Date(firstDay);
    
    // 月の最初の週の日曜日を開始日とする
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days = [];
    const currentDateObj = new Date(startDate);
    
    // 6週間分（42日）を生成
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj));
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  
  // 日付が今月かどうかを判定
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  // 今日かどうかを判定
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <Box sx={(theme) => ({ 
      p: 3,
      width: '100%',
      boxSizing: 'border-box',
      [theme.breakpoints.down('sm')]: {
        p: 0,
        m: 0
      }
    })}>
      <Paper elevation={3} sx={(theme) => ({ 
        p: { xs: 1, sm: 2, md: 3 }, 
        maxWidth: 800, 
        mx: 'auto',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
          mx: 0,
          borderRadius: 0,
          width: '100%',
          boxSizing: 'border-box'
        }
      })}>
        {/* カレンダーヘッダー */}
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onYearClick={handleYearClick}
          onMonthClick={handleMonthClick}
        />

        {/* 曜日ヘッダー */}
        <Box sx={(theme) => ({ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: { xs: 0.5, sm: 1 }, 
          mb: 1
        })}>
          {weekdays.map((day, index) => (
            <Box
              key={index}
              sx={(theme) => ({
                textAlign: 'center',
                py: { xs: 0.5, sm: 1 },
                fontWeight: 'bold',
                backgroundColor: 'grey.100',
                color: index === 0 ? 'error.main' : index === 6 ? 'primary.main' : 'text.primary',
                fontSize: { 
                  xs: 'clamp(0.6rem, 2.5vw, 0.8rem)', 
                  sm: 'clamp(0.7rem, 2vw, 0.9rem)',
                  md: 'clamp(0.8rem, 1.5vw, 1rem)'
                }
              })}
            >
              {day}
            </Box>
          ))}
        </Box>

        {/* カレンダー本体 */}
        <Box sx={(theme) => ({ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: { xs: 0.5, sm: 1 },
          width: '100%'
        })}>
          {calendarDays.map((date, index) => {
            const dayTransactions = getTransactionsForDate(date);
            
            // 通貨別に取引をグループ化
            const transactionsByCurrency = dayTransactions.reduce((acc, transaction) => {
              const currency = transaction.currency;
              if (!acc[currency]) {
                acc[currency] = { income: 0, expense: 0 };
              }
              if (transaction.type === 'income') {
                acc[currency].income += transaction.amount;
              } else {
                acc[currency].expense += transaction.amount;
              }
              return acc;
            }, {} as Record<string, { income: number; expense: number }>);
            
            return (
              <Box
                key={index}
                onClick={() => isCurrentMonth(date) && handleDateClick(date)}
                sx={(theme) => ({
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  border: 1,
                  borderColor: 'grey.300',
                  backgroundColor: isToday(date) ? 'primary.light' : 'transparent',
                  color: !isCurrentMonth(date) 
                    ? 'grey.400' 
                    : isToday(date) 
                    ? 'primary.contrastText'
                    : index % 7 === 0 
                    ? 'error.main' 
                    : index % 7 === 6 
                    ? 'primary.main' 
                    : 'text.primary',
                  cursor: isCurrentMonth(date) ? 'pointer' : 'default',
                  '&:hover': {
                    backgroundColor: isCurrentMonth(date) 
                      ? (isToday(date) ? 'primary.light' : 'grey.100')
                      : 'transparent'
                  },
                  p: { xs: 0.125, sm: 0.25 },
                  minHeight: { 
                    xs: 'clamp(40px, 12vw, 60px)', 
                    sm: 'clamp(60px, 10vw, 80px)', 
                    md: 'clamp(70px, 8vw, 100px)',
                    lg: 'clamp(80px, 6vw, 120px)'
                  },
                  fontSize: { 
                    xs: 'clamp(0.6rem, 2.5vw, 0.8rem)', 
                    sm: 'clamp(0.7rem, 2vw, 0.9rem)',
                    md: 'clamp(0.8rem, 1.5vw, 1rem)'
                  }
                })}
              >
                <Typography 
                  variant="body2" 
                  sx={(theme) => ({ 
                    fontWeight: isToday(date) ? 'bold' : 'normal',
                    fontSize: { 
                      xs: 'clamp(0.6rem, 2.5vw, 0.8rem)', 
                      sm: 'clamp(0.7rem, 2vw, 0.9rem)',
                      md: 'clamp(0.8rem, 1.5vw, 1rem)'
                    }
                  })}
                >
                  {date.getDate()}
                </Typography>
                {Object.keys(transactionsByCurrency).length > 0 && (
                  <Box sx={{ width: '100%', mt: 0.25, textAlign: 'center' }}>
                    {Object.entries(transactionsByCurrency).map(([currency, amounts]) => (
                      <Box key={currency} sx={{ mb: 0.25 }}>
                        {amounts.income > 0 && (
                          <Typography 
                            variant="body2" 
                            sx={(theme) => ({ 
                              display: 'block', 
                              color: 'success.main', 
                              fontSize: { 
                                xs: 'clamp(0.45rem, 1.8vw, 0.55rem)', 
                                sm: 'clamp(0.55rem, 1.5vw, 0.65rem)',
                                md: 'clamp(0.65rem, 1.2vw, 0.75rem)'
                              },
                              fontWeight: 'bold',
                              lineHeight: 1.1
                            })}
                          >
                            +{getCurrencySymbol(currency)}{amounts.income.toLocaleString()}
                          </Typography>
                        )}
                        {amounts.expense > 0 && (
                          <Typography 
                            variant="body2" 
                            sx={(theme) => ({ 
                              display: 'block', 
                              color: 'error.main', 
                              fontSize: { 
                                xs: 'clamp(0.45rem, 1.8vw, 0.55rem)', 
                                sm: 'clamp(0.55rem, 1.5vw, 0.65rem)',
                                md: 'clamp(0.65rem, 1.2vw, 0.75rem)'
                              },
                              fontWeight: 'bold',
                              lineHeight: 1.1
                            })}
                          >
                            -{getCurrencySymbol(currency)}{amounts.expense.toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* 年選択ポップオーバー */}
      <YearSelector
        open={Boolean(yearAnchorEl)}
        anchorEl={yearAnchorEl}
        selectedYear={selectedYear}
        onClose={handleYearClose}
        onChange={handleYearChange}
      />

      {/* 月選択ポップオーバー */}
      <MonthSelector
        open={Boolean(monthAnchorEl)}
        anchorEl={monthAnchorEl}
        selectedMonth={selectedMonth}
        onClose={handleMonthClose}
        onChange={handleMonthChange}
      />

      {/* 収支登録・確認モーダル */}
      <TransactionModal
        open={isModalOpen}
        selectedDate={selectedDate}
        modalMode={modalMode}
        transactions={selectedDate ? getTransactionsForDate(selectedDate) : []}
        currencies={currencies}
        transactionType={transactionType}
        amount={amount}
        currency={currency}
        category={category}
        description={description}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        customExpenseCategories={customExpenseCategories}
        customIncomeCategories={customIncomeCategories}
        defaultExpenseCategories={defaultExpenseCategories}
        defaultIncomeCategories={defaultIncomeCategories}
        newCategoryName={newCategoryName}
        showCategoryManager={showCategoryManager}
        onClose={handleCloseModal}
        onAddNew={handleAddNew}
        onBackToList={handleBackToList}
        onSave={handleSaveTransaction}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        onTransactionTypeChange={setTransactionType}
        onAmountChange={setAmount}
        onCurrencyChange={setCurrency}
        onCategoryChange={setCategory}
        onDescriptionChange={setDescription}
        onNewCategoryNameChange={setNewCategoryName}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onToggleCategoryManager={() => setShowCategoryManager(!showCategoryManager)}
      />
    </Box>
  );
}

export default Home;