import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

interface TransactionContextType {
  transactions: Transaction[];
  selectedCurrency: string;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionsForDate: (date: Date) => Transaction[];
  setSelectedCurrency: (currency: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('JPY');

  // 初期ロード（ログイン済前提。AuthGateが未ログイン時はUIを出さない）
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      if (mounted) setTransactions((data ?? []).map(rowToTx));
    })();
    return () => { mounted = false; };
  }, []);

  const rowToTx = (r: any): Transaction => ({
    id: r.id,
    date: new Date(r.date).toISOString().slice(0,10),
    type: r.type,
    amount: Number(r.amount),
    currency: r.currency,
    category: r.category,
    description: r.description ?? ''
  });

  const addTransaction = async (t: Transaction) => {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user.id;
    if (!uid) throw new Error('not signed in');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: uid,
        date: t.date.slice(0,10),
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        category: t.category,
        description: t.description || null
      })
      .select()
      .single();

    if (error) throw error;
    setTransactions(prev => [rowToTx(data), ...prev]);
  };

  const updateTransaction = async (id: string, tx: Transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        date: tx.date.slice(0,10),
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        category: tx.category,
        description: tx.description || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setTransactions(prev => prev.map(p => p.id === id ? rowToTx(data) : p));
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    setTransactions(prev => prev.filter(p => p.id !== id));
  };

  const getTransactionsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const day = date.getDate();
    return transactions.filter(t => {
      // t.date は "YYYY-MM-DD" 前提。TZずれ防止で T00:00:00 を足してローカル日付で比較
      const d = new Date(`${t.date}T00:00:00`);
      return (
        d.getFullYear() === y &&
        d.getMonth() === m &&
        d.getDate() === day
      );
    });
  };

  const value: TransactionContextType = useMemo(() => ({
    transactions,
    selectedCurrency,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsForDate,
    setSelectedCurrency
  }), [transactions, selectedCurrency]);

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within a TransactionProvider');
  return ctx;
};
