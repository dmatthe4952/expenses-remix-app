import { Link, useLoaderData} from "@remix-run/react";

import { Outlet } from "@remix-run/react";
import ExpensesList from "~/components/expenses/ExpensesList";
import { FaPlus, FaDownload } from "react-icons/fa";
import { getExpenses } from "~/data/expenses.server";


export default function ExpensesLayout(){
    const expensesData = useLoaderData();
    console.log("Rendering ExpensesLayout");

    return(
        <>
            <Outlet />
            <main>
                <section id="expenses-actions">
                    <span>
                        <Link to="add">
                            <FaPlus />Add a new Expense
                        </Link>
                    </span>
                    <span>
                        <a href="expenses/raw"><FaDownload />Download raw data</a>
                    </span>
                </section>                
                <ExpensesList expenses={expensesData}/>
            </main>           
       </>
    )
}
export function loader(){
    console.log("EXPENSES LOADER");
    return getExpenses(); 
}
