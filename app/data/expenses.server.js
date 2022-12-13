import { prisma } from "./database.server";

export async function addExpense(expenseData, userId) {
    try {
      return await prisma.expense.create({
        data: {
          title: expenseData.title,
          amount: +expenseData.amount,
          date: new Date(expenseData.date),
          User: { connect: {id: userId}}
        },
      });
    } catch (error) {
        throw new Error("Failed to add expense");
    }
}

export async function getExpenses(userId){
    try {
        const expenses =  await prisma.expense.findMany({
            where: {userId},
            orderBy: {date: 'desc'}
        });
        return expenses;
    } catch (error){
        throw new Error("Failed to retrieve expenses");
    }
}

export async function getExpense(id){
    try {
        return await prisma.expense.findFirst({
            where: {id},
        });
    } catch (error) {
        throw new Error("Failed to retrieve expense");
    }
}

export async function updateExpense(id, expenseData) {
    try {
        return await prisma.expense.update({
            where: {id}, data: {
                title: expenseData.title,
                amount: +expenseData.amount,
                date: new Date(expenseData.date),
                },
        });
    } catch (error) {
        throw new Error("Failed to update expense");
    }
}

export async function deleteExpense(id){
    try{
        return await prisma.expense.delete({
            where: {id},
        });
    } catch (error) {
        throw new Error("Failed to delete expense");
    }
}