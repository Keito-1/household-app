// src/contexts/TransactionContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
// ← あなたのリポは "tipes" フォルダなのでこちら。
// もし "types" で定義しているなら次の行を: import { Transaction } from "../types";
import { Transaction } from "../types";

interface TransactionContextType {
  transactions: Transaction[];
  selectedCurrency: string;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionsForDate: (date: Date) => Transaction[];
  setSelectedCurrency: (currency: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("JPY");

  const rowToTx = (r: any): Transaction => ({
    id: r.id,
    date: new Date(r.date).toISOString().slice(0, 10),
    type: r.type,
    amount: Number(r.amount),
    currency: r.currency,
    category: r.category,
    description: r.description ?? "",
  });

  // ── 初期ロード＋セッション変化で再読込（白画面/消える問題の根治） ──
  useEffect(() => {
    let active = true;

    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        if (active) setTransactions([]); // 未ログインなら空に
        return;
      }
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (!active) return;
      if (error) {
        console.error(error);
        return;
      }
      setTransactions((data ?? []).map(rowToTx));
    };

    // 1) マウント時に一度
    load();

    // 2) セッションが初期化/変化したら読み直す
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        load();
      }
      if (event === "SIGNED_OUT") {
        setTransactions([]);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ── CRUD ──
  const addTransaction = async (t: Transaction) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const uid = session?.user.id;
    if (!uid) throw new Error("not signed in");

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: uid,
        date: t.date.slice(0, 10),
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        category: t.category,
        description: t.description || null,
      })
      .select()
      .single();

    if (error) throw error;
    setTransactions((prev) => [rowToTx(data), ...prev]);
  };

  const updateTransaction = async (id: string, tx: Transaction) => {
    const { data, error } = await supabase
      .from("transactions")
      .update({
        date: tx.date.slice(0, 10),
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        category: tx.category,
        description: tx.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    setTransactions((prev) => prev.map((p) => (p.id === id ? rowToTx(data) : p)));
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw error;
    setTransactions((prev) => prev.filter((p) => p.id !== id));
  };

  // ── “その日ぴったり” でフィルタ（全日表示される不具合の修正） ──
  const getTransactionsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return transactions.filter((t) => {
      const dt = new Date(`${t.date}T00:00:00`);
      return (
        dt.getFullYear() === y &&
        dt.getMonth() === m &&
        dt.getDate() === d
      );
    });
  };

  const value: TransactionContextType = useMemo(
    () => ({
      transactions,
      selectedCurrency,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getTransactionsForDate,
      setSelectedCurrency,
    }),
    [transactions, selectedCurrency]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// フックはコンポーネントの外で export してください（中に書くと構文エラー）
export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within a TransactionProvider");
  return ctx;
};
