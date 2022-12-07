import { useLoaderData } from "@remix-run/react";
import { getExpenses } from "~/data/expenses.server";

import ExpenseStatistics from "~/components/expenses/ExpenseStatistics";
import Chart from "~/components/expenses/Chart";

export default function AnalysisPage() {
    const expensesAnalysisData = useLoaderData();
    console.log(expensesAnalysisData);
    return (
        <main>
            <Chart expenses={expensesAnalysisData} />
            <ExpenseStatistics expenses={expensesAnalysisData} />
        </main>
    )
}

export function loader(){
    return getExpenses(); 
}
