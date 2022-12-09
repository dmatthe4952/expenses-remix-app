import { useLoaderData, Link, useCatch } from "@remix-run/react";
import { getExpenses } from "~/data/expenses.server";

import ExpenseStatistics from "~/components/expenses/ExpenseStatistics";
import Chart from "~/components/expenses/Chart";
import { json } from "@remix-run/node";
import { FaSortAmountDownAlt } from "react-icons/fa";
import Error from "~/components/util/Error";

export default function AnalysisPage() {
    const expensesAnalysisData = useLoaderData();
    return (
        <main>
            <Chart expenses={expensesAnalysisData} />
            <ExpenseStatistics expenses={expensesAnalysisData} />
        </main>
    )
}

export async function loader(){
    const expenses = await getExpenses();
    if (!expenses|| expenses.length === 0) {
        throw json(
            {message: "Could not retrieve any expenses for analysis"},
            {
                status: 404,
                statusText: "No Expenses Found"
            }
        );
    }

    return expenses;
}

export function CatchBoundary() {
    const caughtResponse = useCatch();
    return <main>
        <Error title={caughtResponse.statusText}>
            <p>{caughtResponse.data?.message || "Something went wrong. Could not find expenses."}</p>
        </Error>
    </main>
}
