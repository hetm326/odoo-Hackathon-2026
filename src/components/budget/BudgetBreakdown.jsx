import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExpenseToTrip, removeExpenseFromTrip } from '../../redux/slices/tripSlice';
import { formatCurrency, calculateSpentPercentage, getCategoryMeta, generateId, formatDate } from '../../utils/helpers';
import { Card, Button, ModalDialog, Input, Select, Badge, AlertBanner } from '../LoadingComponents';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { DollarSign, Plus, AlertTriangle, TrendingUp, CreditCard, PieChart as PieIcon, BarChart2, Trash2 } from 'lucide-react';

export const BudgetBreakdown = ({ trip }) => {
  const dispatch = useDispatch();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'transport',
    date: new Date().toISOString().split('T')[0],
  });

  if (!trip) return null;

  const expenses = trip.expenses || [];
  const totalBudget = trip.totalBudget || 2000;
  const spentBudget = trip.spentBudget || expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const remainingBudget = totalBudget - spentBudget;
  const spentPercentage = calculateSpentPercentage(spentBudget, totalBudget);

  // Recharts Category Data Preparation
  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'misc';
    acc[cat] = (acc[cat] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryTotals).map((catKey) => {
    const meta = getCategoryMeta(catKey);
    return {
      name: meta.label,
      value: categoryTotals[catKey],
      color: meta.color,
    };
  });

  // Default pie fallback if no expenses logged
  const renderPieData = pieChartData.length > 0 ? pieChartData : [
    { name: 'Unallocated', value: totalBudget, color: '#334155' }
  ];

  // Bar Chart Data by Category
  const barChartData = [
    { name: 'Transport', amount: categoryTotals['transport'] || 0 },
    { name: 'Hotel', amount: categoryTotals['accommodation'] || 0 },
    { name: 'Food', amount: categoryTotals['food'] || 0 },
    { name: 'Activities', amount: categoryTotals['activity'] || 0 },
    { name: 'Shopping', amount: categoryTotals['shopping'] || 0 },
    { name: 'Misc', amount: categoryTotals['misc'] || 0 },
  ];

  const handleDeleteExpense = (expenseId) => {
    dispatch(removeExpenseFromTrip({
      tripId: trip.id,
      expenseId: expenseId,
    }));
  };

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    const expenseObj = {
      id: generateId(),
      title: newExpense.title,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
    };

    dispatch(addExpenseToTrip({
      tripId: trip.id,
      expense: expenseObj,
    }));

    setNewExpense({ title: '', amount: '', category: 'transport', date: new Date().toISOString().split('T')[0] });
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Alert if over budget */}
      {spentPercentage > 85 && (
        <AlertBanner
          type={spentPercentage >= 100 ? 'error' : 'warning'}
          title={spentPercentage >= 100 ? 'Budget Limit Exceeded!' : 'Budget Warning'}
          message={`You have spent ${spentPercentage}% of your total ${formatCurrency(totalBudget)} budget.`}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="space-y-1 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Budget Allocated</p>
          <h3 className="text-2xl font-black text-white">{formatCurrency(totalBudget)}</h3>
          <span className="text-xs text-brand-400">Fixed Limit</span>
        </Card>

        <Card className="space-y-1 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Spent</p>
          <h3 className="text-2xl font-black text-rose-400">{formatCurrency(spentBudget)}</h3>
          <span className="text-xs text-slate-400">{spentPercentage}% of total limit</span>
        </Card>

        <Card className="space-y-1 bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase">Remaining Balance</p>
          <h3 className={`text-2xl font-black ${remainingBudget < 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
            {formatCurrency(remainingBudget)}
          </h3>
          <span className="text-xs text-emerald-400 font-medium">Available Funds</span>
        </Card>
      </div>

      {/* Recharts Graphical Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Expenses by Category */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-brand-400" />
              <span>Expense Category Distribution</span>
            </h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={renderPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {renderPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend formatter={(val) => <span className="text-xs text-slate-300">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar Chart: Daily & Category Breakdown */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-ocean-400" />
              <span>Category Spend Comparison</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <RechartsTooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="amount" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Expense History Table & Logger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-400" />
            <span>Logged Expenses ({expenses.length})</span>
          </h3>

          <Button variant="primary" size="sm" onClick={() => setIsExpenseModalOpen(true)} className="space-x-1.5">
            <Plus className="w-4 h-4" />
            <span>Log New Expense</span>
          </Button>
        </div>

        {expenses.length > 0 ? (
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Expense</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5 text-right">Amount</th>
                    <th className="px-5 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {expenses.map((exp) => {
                    const meta = getCategoryMeta(exp.category);
                    return (
                      <tr key={exp.id} className="hover:bg-slate-900/60 transition">
                        <td className="px-5 py-4 font-bold text-white">{exp.title}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${meta.bg}`}>
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-400">{formatDate(exp.date)}</td>
                        <td className="px-5 py-4 text-right font-extrabold text-rose-400">
                          {formatCurrency(exp.amount)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card className="text-center py-10 space-y-3">
            <CreditCard className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">No expenses logged for this trip yet.</p>
            <Button variant="outline" size="sm" onClick={() => setIsExpenseModalOpen(true)}>
              + Add First Expense
            </Button>
          </Card>
        )}
      </div>

      {/* Expense Modal */}
      <ModalDialog isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Log New Expense">
        <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
          <Input
            label="Expense Title"
            type="text"
            placeholder="e.g. Flight Tickets / Hotel Reservation"
            value={newExpense.title}
            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
            required
          />

          <Input
            label="Amount ($ USD)"
            type="number"
            placeholder="150"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            required
          />

          <Select
            label="Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            options={[
              { value: 'transport', label: 'Transportation & Flights' },
              { value: 'accommodation', label: 'Hotel & Stay' },
              { value: 'food', label: 'Food & Dining' },
              { value: 'activity', label: 'Activities & Tours' },
              { value: 'shopping', label: 'Shopping' },
              { value: 'misc', label: 'Miscellaneous' },
            ]}
          />

          <Input
            label="Transaction Date"
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Expense
            </Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
};
export default BudgetBreakdown;
