import { redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { updateExpense } from "~/data/expenses.server";
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
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);

    try {
        validateExpenseInput(expenseData);
    } catch (error) {
        return error;
    }


    await updateExpense(expenseId, expenseData);
    return redirect('/expenses');
}