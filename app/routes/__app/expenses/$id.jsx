import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { updateExpense, deleteExpense } from "~/data/expenses.server";
import { validateExpenseInput } from "~/data/validation.server";

export default function ExpenseDetailPage() {
   const navigate = useNavigate();
    function closeHandler() {
        navigate("..");
    }
    return (
        <Modal onClose={closeHandler}>
            <ExpenseForm />
        </Modal>
    )
}

export async function action({params, request}){
    const expenseId = params.id;

    if (request.method === "PATCH") {
        const formData = await request.formData();
        const expenseData = Object.fromEntries(formData);

        try {
            validateExpenseInput(expenseData);
        } catch (error) {
            return error;
        }


        await updateExpense(expenseId, expenseData);
        return redirect('/expenses');
    } else {
        try{
            await deleteExpense(expenseId);
            return { deleted: expenseId };    
        } catch (error) {
            throw new Error("Something went wrong. Unable to delete expense.");
        }
    }
}

export function meta() {
    return {
        title: "RemixExpenses - Edit",
    }
}